import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const shiftWiseChemistDCRAdapter = createEntityAdapter();

const initialState = shiftWiseChemistDCRAdapter.getInitialState();

export const shiftWiseChemistDCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all Chemist DCR
        getShiftWiseChemistDCR: builder.query({
            query: () => ({
                url: '/dcr/mpo-shift-wise-dcr-for-chemist/',
                method: 'GET'
            }),
            providesTags: ['ShiftWiseChemistDCR']
        }),

        //! Get all Chemist DCRs by ID 
        getShiftWiseChemistDCRById: builder.query({
            query: (id) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-chemist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['ShiftWiseChemistDCR']
        }),

        //! Get all Dcotor DCRs by DCRId
        getShiftWiseChemistDCRByDCRId: builder.query({
            query: (id) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-chemist/${id}`,
                method: 'GET'
            }),
            providesTags: ['ShiftWiseChemistDCR']
        }),

        //! CREATE chemist DCR by id
        addShiftWiseChemistDCR: builder.mutation({
            query: (addShiftWiseChemistDCR) => {

                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-Chemist/`,
                    method: 'POST',
                    body: addShiftWiseChemistDCR,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['ShiftWiseChemistDCR']
        }),


        //! DELETE chemist DCR by id
        deleteShiftWiseChemistDCRById: builder.mutation({
            query: ({ id }) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-chemist/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['ShiftWiseChemistDCR']
        }),

        //! Update Stockists DCR By ID 
        updateShiftWiseChemistDCR: builder.mutation({

            query: (ShiftWiseChemistDCR) => {
                
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-chemist/${ShiftWiseChemistDCR.get('id')}/`,
                    method: 'PATCH',
                    body: ShiftWiseChemistDCR,
                }
            },
            invalidatesTags: ['ShiftWiseChemistDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getShiftWiseChemistDCR', id, (draft) => {
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
    useGetShiftWiseChemistDCRQuery,
    useGetShiftWiseChemistDCRByIdQuery,
    useUpdateShiftWiseChemistDCRMutation,
    useDeleteShiftWiseChemistDCRByIdMutation,
    useAddShiftWiseChemistDCRMutation,
    useGetShiftWiseChemistDCRByDCRIdQuery
} = shiftWiseChemistDCRSlice

//! returns the query result object
export const selectShiftWiseChemistDCRResult = shiftWiseChemistDCRSlice.endpoints.getShiftWiseChemistDCR.select()

//!Creates memoized selector
const selectShiftWiseChemistDCRData = createSelector(
    selectShiftWiseChemistDCRResult,
    selectShiftWiseChemistDCRResult => selectShiftWiseChemistDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllShiftWiseChemistDCR,
    selectById: selectShiftWiseChemistDCRById,
    // Pass in a selector that returns the posts slice of state
} = shiftWiseChemistDCRAdapter.getSelectors(state => selectShiftWiseChemistDCRData(state) ?? initialState)



