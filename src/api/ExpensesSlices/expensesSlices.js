import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const ExpenseSlice = createEntityAdapter();

const initialState = ExpenseSlice.getInitialState();

export const ExpenseSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Targets
        getAllExpense: builder.query({
            query: () => ({
                url: `expenses/company-area-wise-expenses/`,
                method: 'GET'
            }),
            providesTags: ['Expense']
        }),

        getAllDetailedExpenses: builder.mutation({
            query: (body) =>({
                url: `expenses/get-detailed-expenses/`,
                method: 'POST',
                body: body
            })
        })

    })
})

export const {
    useGetAllExpenseQuery,
    useGetAllDetailedExpensesMutation
} = ExpenseSlices

//! returns the query result object
export const seleteExpenseResult = ExpenseSlices.endpoints.getAllExpense.select()

//!Creates memoized selector
const selectExpenseData = createSelector(
    seleteExpenseResult,
    ExpenseResult => ExpenseResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllExpense,
    selectById: selectExpenseById,
    // Pass in a selector that returns the posts slice of state
} = ExpenseSlice.getSelectors(state => selectExpenseData(state) ?? initialState)



