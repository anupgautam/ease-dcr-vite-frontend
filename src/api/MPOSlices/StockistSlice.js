import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const stockistAdapter = createEntityAdapter();

const initialState = stockistAdapter.getInitialState();

export const StockistSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the stockist
        getAllStockists: builder.query({
            query: (page) => {
                return {
                    url: `stockist/company-stockist/?company_name=${page.id}&page=${page.page}&stockist_name__stockist_territory=${page.company_area}`,
                    method: 'GET',
                };
            },
            providesTags: ['Stockist'],
        }),

        getAllAssignStockists: builder.query({
            query: (page) => ({
                url: `stockist/company-stockist-mpo/?company_name=${page.id}&page=${page.page}&mpo_name=${page.mpo_name}&stockist_name__stockist_name__stockist_territory=${page.company_area}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Stockist'
                ]
        }),

        //! GET all the stockist no paginate
        getAllStockistsNoPaginate: builder.query({
            query: () => ({
                url: `stockist/company-stockist`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Stockist'
                ]
        }),

        getAllStockistsWithoutPagination: builder.query({
            query: (page) => {
                return {
                    url: `stockist/company-stockist-with-out-pagination/?company_name=${page?.company_name}&stockist_name__stockist_territory=${page?.company_area}`,
                    method: 'GET',
                };
            },
            providesTags: ['Stockist'],
        }),

        //! GET stockist by id
        getStockistsById: builder.query({
            query: (id) => ({
                url: `stockist/company-stockist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Stockist']
        }),
        getAssignStockistsById: builder.query({
            query: (id) => ({
                url: `stockist/company-stockist-mpo/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Stockist']
        }),

        getStockistsByCompanyArea: builder.query({
            query: (id) => ({
                url: `stockist/company-stockist/?company_name=${id.company_name}&stockist_name__stockist_territory=${id.company_area}`,
                method: 'GET'
            }),
            providesTags: ['Stockist']
        }),

        //! DELETE stockist by id
        deleteStockistsById: builder.mutation({
            query: (id) => ({
                url: `stockist/company-stockist/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Stockist']
        }),

        deleteStockistsAssignById: builder.mutation({
            query: (id) => ({
                url: `stockist/company-stockist-mpo/${id}/`,
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
                }
            },
            invalidatesTags: ['Stockist']
        }),

        createAssignStockists: builder.mutation({
            query: (newStockist) => {
                return {
                    url: `stockist/company-stockist-mpo/`,
                    method: 'POST',
                    body: newStockist,
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
                return {
                    url: `stockist/company-stockist/${updateStockist.id}/`,
                    method: 'PATCH',
                    body: updateStockist,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Stockist'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllStockists', id, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),

        updateAssignStockists: builder.mutation({
            query: (updateStockist) => {
                return {
                    url: `stockist/company-stockist-mpo/${updateStockist.id}/`,
                    method: 'PATCH',
                    body: updateStockist.data
                }
            },
            invalidatesTags: ['Stockist'],
        }),

    })
})

export const {
    useGetAllStockistsQuery,
    useGetAllStockistsNoPaginateQuery,
    useGetStockistsByIdQuery,
    useDeleteStockistsByIdMutation,
    useCreateStockistsMutation,
    useUpdateStockistsMutation,
    useSearchStockistsMutation,
    useGetAllStockistsWithoutPaginationQuery,
    useGetStockistsByCompanyAreaQuery,
    useGetAllAssignStockistsQuery,
    useCreateAssignStockistsMutation,
    useDeleteStockistsAssignByIdMutation,
    useUpdateAssignStockistsMutation,
    useGetAssignStockistsByIdQuery,
} = StockistSlice

//! returns the query result object
export const selectStockistsResult = StockistSlice.endpoints.getAllStockists.select()

//!Creates memoized selector
const selectStockistsData = createSelector(
    selectStockistsResult,
    stockistResult => stockistResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStockists,
    selectById: selectStockistsById,
    // Pass in a selector that returns the posts slice of state
} = stockistAdapter.getSelectors(state => selectStockistsData(state) ?? initialState)



