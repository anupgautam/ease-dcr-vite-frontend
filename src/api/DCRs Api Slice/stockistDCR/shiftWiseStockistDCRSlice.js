import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const shiftWiseStockistDCRAdapter = createEntityAdapter();

const initialState = shiftWiseStockistDCRAdapter.getInitialState();

export const shiftWiseStockistDCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all Stockist DCR
        getShiftWiseStockistDCR: builder.query({
            query: () => ({
                url: '/dcr/mpo-shift-wise-dcr-for-stockist/',
                method: 'GET'
            }),
            providesTags: ['ShiftWiseStockistDCR']
        }),

        //! Get all Stockist DCRs by ID 
        getShiftWiseStockistDCRById: builder.query({
            query: (id) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-stockist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['ShiftWiseStockistDCR']
        }),

        //! Get all Dcotor DCRs by DCRId
        getShiftWiseStockistDCRByDCRId: builder.query({
            query: (id) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-stockist/?dcr__dcr__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['ShiftWiseStockistDCR']
        }),

        //! CREATE chemist DCR by id
        addShiftWiseStockistDCR: builder.mutation({
            query: (addShiftWiseStockistDCR) => {

                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-stockist/`,
                    method: 'POST',
                    body: addShiftWiseStockistDCR,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['ShiftWiseStockistDCR']
        }),


        //! DELETE chemist DCR by id
        deleteShiftWiseStockistDCRById: builder.mutation({
            query: ({ id }) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-stockist/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['ShiftWiseStockistDCR']
        }),

        //! Update Stockists DCR By ID 
        updateShiftWiseStockistDCR: builder.mutation({

            query: (ShiftWiseStockistDCR) => {
                
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-stockist/${ShiftWiseStockistDCR.get('id')}/`,
                    method: 'PATCH',
                    body: ShiftWiseStockistDCR,
                }
            },
            invalidatesTags: ['ShiftWiseStockistDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getShiftWiseStockistDCR', id, (draft) => {
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
    useGetShiftWiseStockistDCRQuery,
    useGetShiftWiseStockistDCRByIdQuery,
    useUpdateShiftWiseStockistDCRMutation,
    useDeleteShiftWiseStockistDCRByIdMutation,
    useAddShiftWiseStockistDCRMutation,
    useGetShiftWiseStockistDCRByDCRIdQuery
} = shiftWiseStockistDCRSlice

//! returns the query result object
export const selectShiftWiseStockistDCRResult = shiftWiseStockistDCRSlice.endpoints.getShiftWiseStockistDCR.select()

//!Creates memoized selector
const selectShiftWiseStockistDCRData = createSelector(
    selectShiftWiseStockistDCRResult,
    selectShiftWiseStockistDCRResult => selectShiftWiseStockistDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllShiftWiseStockistDCR,
    selectById: selectShiftWiseStockistDCRById,
    // Pass in a selector that returns the posts slice of state
} = shiftWiseStockistDCRAdapter.getSelectors(state => selectShiftWiseStockistDCRData(state) ?? initialState)



