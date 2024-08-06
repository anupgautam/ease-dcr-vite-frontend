import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const ExpensesTypeSlice = createEntityAdapter();

const initialState = ExpensesTypeSlice.getInitialState();

export const ExpensesTypeSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Targets
        getAllExpensesType: builder.query({
            query: () => ({
                url: `expenses/expenses-type/`,
                method: 'GET'
            }),
            providesTags: ['ExpensesType']
        }),
    })
})

export const {
    useGetAllExpensesTypeQuery,
} = ExpensesTypeSlices

//! returns the query result object
export const seleteExpensesTypeResult = ExpensesTypeSlices.endpoints.getAllExpensesType.select()

//!Creates memoized selector
const selectExpensesTypeData = createSelector(
    seleteExpensesTypeResult,
    ExpensesTypeResult => ExpensesTypeResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllExpensesType,
    selectById: selectExpensesTypeById,
    // Pass in a selector that returns the posts slice of state
} = ExpensesTypeSlice.getSelectors(state => selectExpensesTypeData(state) ?? initialState)



