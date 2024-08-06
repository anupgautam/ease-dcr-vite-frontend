import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const shiftWiseDoctorDCRAdapter = createEntityAdapter();

const initialState = shiftWiseDoctorDCRAdapter.getInitialState();

export const shiftWiseDoctorDCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all doctor DCR
        getShiftWiseDoctorDCR: builder.query({
            query: () => ({
                url: '/dcr/mpo-shift-wise-dcr-for-doctor/',
                method: 'GET'
            }),
            providesTags: ['ShiftWiseDoctorDCR']
        }),

        //! Get all Doctor DCRs by ID 
        getShiftWiseDoctorDCRById: builder.query({
            query: (id) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['ShiftWiseDoctorDCR']
        }),

        //! Get all Dcotor DCRs by DCRId
        getShiftWiseDoctorDCRByDCRId: builder.query({
            query: (id) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-doctor/?dcr__dcr__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['ShiftWiseDoctorDCR']
        }),

        //! CREATE chemist DCR by id
        addShiftWiseDoctorDCR: builder.mutation({
            query: (addShiftWiseDoctorDCR) => {

                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-doctor/`,
                    method: 'POST',
                    body: addShiftWiseDoctorDCR,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['ShiftWiseDoctorDCR']
        }),


        //! DELETE chemist DCR by id
        deleteShiftWiseDoctorDCRById: builder.mutation({
            query: ({ id }) => ({
                url: `/dcr/mpo-shift-wise-dcr-for-doctor/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['ShiftWiseDoctorDCR']
        }),

        //! Update Stockists DCR By ID 
        updateShiftWiseDoctorDCR: builder.mutation({

            query: (ShiftWiseDoctorDCR) => {
                
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-doctor/${ShiftWiseDoctorDCR.get('id')}/`,
                    method: 'PATCH',
                    body: ShiftWiseDoctorDCR,
                }
            },
            invalidatesTags: ['ShiftWiseDoctorDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getShiftWiseDoctorDCR', id, (draft) => {
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
    useGetShiftWiseDoctorDCRQuery,
    useGetShiftWiseDoctorDCRByIdQuery,
    useUpdateShiftWiseDoctorDCRMutation,
    useDeleteShiftWiseDoctorDCRByIdMutation,
    useAddShiftWiseDoctorDCRMutation,
    useGetShiftWiseDoctorDCRByDCRIdQuery
} = shiftWiseDoctorDCRSlice

//! returns the query result object
export const selectShiftWiseDoctorDCRResult = shiftWiseDoctorDCRSlice.endpoints.getShiftWiseDoctorDCR.select()

//!Creates memoized selector
const selectShiftWiseDoctorDCRData = createSelector(
    selectShiftWiseDoctorDCRResult,
    selectShiftWiseDoctorDCRResult => selectShiftWiseDoctorDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllShiftWiseDoctorDCR,
    selectById: selectShiftWiseDoctorDCRById,
    // Pass in a selector that returns the posts slice of state
} = shiftWiseDoctorDCRAdapter.getSelectors(state => selectShiftWiseDoctorDCRData(state) ?? initialState)



