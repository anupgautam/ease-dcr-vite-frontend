import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const salesSlice = createEntityAdapter();

const initialState = salesSlice.getInitialState();

export const SalesSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Sales
        getSales: builder.query({
            query: (UserRole) => (
                {
                    url: `expenses/get-leave-user`,
                    method: 'GET',
                    body: UserRole
                }
            ),
            providesTags: ['Sale']
        }),


        //! Search MPO filter wala
        searchSale: builder.mutation({
            query: (FilteredData) => {
                return {
                    url: `expenses/get-company-sales/`,
                    body: FilteredData,
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    },
                }
            },
            invalidatesTags: ['Sale']
        }),

    })
})

export const {
    useGetSalesQuery,
    useSearchSaleMutation,
} = SalesSlice

//! returns the query result object
export const selectSalesResult = SalesSlice.endpoints.getSales.select()

//!Creates memoized selector
const selectSalesData = createSelector(
    selectSalesResult,
    salesResult => salesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllSales,
    // selectById: selectSalesById,
    // Pass in a selector that returns the posts slice of state
} = salesSlice.getSelectors(state => selectSalesData(state) ?? initialState)



