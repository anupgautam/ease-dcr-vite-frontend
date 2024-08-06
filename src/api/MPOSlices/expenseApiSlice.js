import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const expenseAdapter = createEntityAdapter();

const initialState = expenseAdapter.getInitialState();

export const expenseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the expenses
        getAllExpenses: builder.query({
            query: () => ({
                url: 'product/product/',
                method: 'GET'
            })
        }),

        //! GET products by id
        getExpensesById: builder.query({
            query: (id) => ({
                url: `product/product/${id}`,
                method: 'GET'
            })
        }),

        //! DELETE Expenses by id
        deleteExpensesById: builder.mutation({
            query: (id) => ({
                url: `product/product/${id}`,
                method: 'DELETE'
            })
        }),

        //! POST Expenses 
        createExpenses: builder.mutation({
            query: (newExpense) => {
                return {
                    url: `product/product/`,
                    method: 'POST',
                    body: newExpense,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            }
        }),

        //! Update Expenses data by id
        updateExpenses: builder.mutation({
            query: (updateExpense) => {
                const { id, ...data } = updateExpense;

                return {
                    url: `product/product/${id}`,
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            }
        })
    })
})

//! Api hooks
export const {
    useGetAllExpensesQuery,
    useGetExpensesByIdQuery,
    useDeleteExpensesByIdMutation,
    useCreateExpensesMutation,
    useUpdateExpensesMutation
} = expenseApiSlice

export const {
    useCreateExpenseMutation
} = expenseApiSlice


export const selectExpensesResult = expenseApiSlice.endpoints.getAllExpenses.select()

// Creates memoized selector
const selectExpensessData = createSelector(
    selectExpensesResult,
    ExpensesResult => ExpensesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllExpenses,
    selectById: selectExpenseById,
    selectIds: selectIds
    // Pass in a selector that returns the posts slice of state
} = expenseAdapter.getSelectors(state => selectExpensessData(state) ?? initialState)