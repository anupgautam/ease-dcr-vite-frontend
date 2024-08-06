import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const stockistDCRAdapter = createEntityAdapter();

const initialState = stockistDCRAdapter.getInitialState();

export const StockistDCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all stockist DCR
        getAllStockistsDCR: builder.query({
            query: (page) => ({
                url: `dcr/mpo-shift-wise-dcr-for-stockist/?dcr__dcr__visited_stockist__company_name=${page.id}&page=${page.page}`,
                method: 'GET'
            }),
            providesTags: ['StockistDCR']
        }),

        //! Get Stockists DCR by Id 
        getStockistDCRById: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-stockist/${id}`,
                method: 'GET'
            }),
            providesTags: ['StockistDCR']
        }),

        //! Search Stockists DCR 
        searchStockistsDCR: builder.query({
            query: (searchChemistsDCR) => {

                return {
                    url: `dcr/mpo-shift-wise-dcr-for-stockist/?dcr__dcr__visited_stockist__company_name=${searchChemistsDCR.company_name}&mpo_name=${searchChemistsDCR.user_id}&dcr__dcr__month=${searchChemistsDCR.month}&dcr__dcr__year=${searchChemistsDCR.date}`,
                    method: 'GET',
                }
            },
            providesTags: ['StockistDCR']
        }),

        //! DELETE chemist DCR by id
        deleteStockistsDCRById: builder.mutation({
            query: ({ id }) => ({
                url: `dcr/mpo-shift-wise-dcr-for-stockist/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['StockistDCR']
        }),

        //! Update Stockists DCR By ID 
        updateStockistsDCR: builder.mutation({
            query: (updateStockistsDCR) => {
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-stockist/${updateStockistsDCR.get('id')}/`,
                    method: 'PUT',
                    body: updateStockistsDCR,
                }
            },
            invalidatesTags: ['StockistDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllStockistsDCR', id, (draft) => {
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
    useGetAllStockistsDCRQuery,
    useGetStockistDCRByIdQuery,
    useUpdateStockistsDCRMutation,
    useSearchStockistsDCRQuery,
    useDeleteStockistsDCRByIdMutation
} = StockistDCRSlice

//! returns the query result object
export const selectStockistsDCRResult = StockistDCRSlice.endpoints.getAllStockistsDCR.select()

//!Creates memoized selector
const selectStockistsDCRData = createSelector(
    selectStockistsDCRResult,
    stockistDCRResult => stockistDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStockistsDCR,
    selectById: selectStockistsDCRById,
    // Pass in a selector that returns the posts slice of state
} = stockistDCRAdapter.getSelectors(state => selectStockistsDCRData(state) ?? initialState)



