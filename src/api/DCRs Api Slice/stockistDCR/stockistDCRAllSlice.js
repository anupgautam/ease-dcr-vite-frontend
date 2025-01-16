import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const StockistDCRAllAdapter = createEntityAdapter();

const initialState = StockistDCRAllAdapter.getInitialState();

export const StockistDCRAllSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all Stockist DCR
        getAllStockistsAllDCR: builder.query({
            query: () => ({
                url: 'dcr/dcr-for-stockist-product-rewards-roles/',
                method: 'GET'
            }),
            providesTags: ['StockistAllDCR']
        }),

        //! Get all Stockist DCRs by ID 
        getStockistAllDCRById: builder.query({
            query: (id) => ({
                // url: `dcr/dcr-for-stockist-product-rewards-roles/${id}/`,
                url: `dcr/mpo-shift-wise-dcr-for-stockist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['StockistAllDCR']
        }),

        
        getStockistDcrById: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-stockist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['StockistAllDCR']
        }),

        //! CREATE chemist DCR by id
        addStockistsAllDCR: builder.mutation({
            query: (addStockistsDCR) => {

                return {
                    url: `dcr/dcr-for-stockist-product-rewards-roles/${addStockistsDCR?.id}`,
                    method: 'PATCH',
                    body: addStockistsDCR,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['StockistAllDCR']
        }),


        //! DELETE chemist DCR by id
        deleteStockistsAllDCRById: builder.mutation({
            query: (id) => ({
                url: `dcr/dcr-for-stockist-product-rewards-roles/${id['id']}/`,
                method: 'DELETE',
                body: id,
            }),
            invalidatesTags: ['StockistAllDCR']
        }),

        //! Update Stockists DCR By ID 
        updateStockistsAllDCR: builder.mutation({

            query: (updateStockistsDCR) => {

                return {
                    url: `dcr/dcr-for-stockist-product-rewards-roles/${updateStockistsDCR['data']['id']}/`,
                    method: 'PATCH',
                    body: updateStockistsDCR['data'],
                }
            },
            invalidatesTags: ['StockistAllDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllStockistsAllDCR', id, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()

                    /**
                     * Alternatively, on failure you can invalidate the corresponding cache tags
                     * to trigger a re-fetch:
                     * dispatch(api.util.invalidateTags(['Post']))
                     */
                }
            },
        }),
    })
})

export const {
    useGetStockistAllDCRByIdQuery,
    useGetAllStockistsAllDCRQuery,
    useUpdateStockistsAllDCRMutation,
    useDeleteStockistsAllDCRByIdMutation,
    useAddStockistsAllDCRMutation,
    useGetStockistDcrByIdQuery,
} = StockistDCRAllSlice

//! returns the query result object
export const selectStockistDCRAllDCRResult = StockistDCRAllSlice.endpoints.getAllStockistsAllDCR.select()

//!Creates memoized selector
const selectStockistsDCRAllData = createSelector(
    selectStockistDCRAllDCRResult,
    StockistDCRAllResult => StockistDCRAllResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStockistsDCRAll,
    selectById: selectStockistsDCRAllById,
    // Pass in a selector that returns the posts slice of state
} = StockistDCRAllAdapter.getSelectors(state => selectStockistsDCRAllData(state) ?? initialState)



