import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const stockistAdapter = createEntityAdapter();

const initialState = stockistAdapter.getInitialState();

export const stockistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the stockist
        getAllStockists: builder.query({
            query: (page) => ({
                url: `stockist/company-stockist/?page=${page}`,
                method: 'GET'
            }),
            providesTags: ['Stockist']
        }),

        //! GET stockist by id
        getStockistsById: builder.query({
            query: (id) => ({
                url: `stockist/company-stockist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Stockist']
        }),

        getStockistsWithoutPagination: builder.query({
            query: (id) => ({
                url: `stockist/company-stockist-with-out-pagination/?company_name=${id}`,
                method: 'GET',
            }),
            providesTags: ['Stockist']
        }),

        //! DELETE stockist by id
        deleteStockistsById: builder.mutation({
            query: ({ id }) => ({
                url: `stockist/company-stockist/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Stockist']
        }),

        //! POST stockist   
        createStockists: builder.mutation({
            query: (newStockist) => {
                newStockist.company_id = Cookies.get("company_id")

                return {
                    url: `stockist/company-stockist/create_stockist/`,
                    method: 'POST',
                    body: newStockist,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Stockist']
        }),

        //! Search Stockist wala post
        searchStockists: builder.mutation({
            query: (searchStockist) => {
                // 
                return {
                    url: 'stockist/company-stockist/search_stockist/',
                    method: 'POST',
                    body: searchStockist,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Stockist']
        }),

        //! Update stockist data by id
        updateStockists: builder.mutation({
            query: (updateStockist) => {
                // 
                return {
                    url: `stockist/company-stockist/${updateStockist.get('id')}/update_stockist/`,
                    method: 'PUT',
                    body: updateStockist,
                }
            },
            invalidatesTags: ['Stockist']
        })
    })
})

//! Api hooks
export const {
    useGetAllStockistsQuery,
    useGetStockistsByIdQuery,
    useDeleteStockistsByIdMutation,
    useCreateStockistsMutation,
    useUpdateStockistsMutation,
    useSearchStockistsMutation,
    useGetStockistsWithoutPaginationQuery
} = stockistApiSlice

export const {
    useCreateStockistMutation
} = stockistApiSlice


export const selectStockistsResult = stockistApiSlice.endpoints.getAllStockists.select()

// Creates memoized selector
const selectStockistssData = createSelector(
    selectStockistsResult,
    StockistsResult => StockistsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStockists,
    selectById: selectStockistById,
    // Pass in a selector that returns the posts slice of state
} = stockistAdapter.getSelectors(state => selectStockistssData(state) ?? initialState)