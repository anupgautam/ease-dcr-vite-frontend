import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const doctorDCRAllAdapter = createEntityAdapter();

const initialState = doctorDCRAllAdapter.getInitialState();

export const DoctorDCRAllSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all doctor DCR
        getAllDoctorsAllDCR: builder.query({
            query: () => ({
                url: 'dcr/dcr-for-doctor-company-product-map/',
                method: 'GET'
            }),
            providesTags: ['DoctorAllDCR']
        }),

        //! Get all Doctor DCRs by ID 
        getDoctorAllDCRById: builder.query({
            query: (id) => ({
                // url: `dcr/dcr-for-doctor-company-product-map/?dcr_id=${id}`,
                url: `dcr/mpo-shift-wise-dcr-for-doctor/${id}`,
                method: 'GET'
            }),
            providesTags: ['DoctorAllDCR']
        }),
        getPromotedProductByDcrId: builder.query({
            query: (id) => ({
                url: `dcr/dcr-for-doctor-company-product-map/?dcr_id=${id}`,
                method: 'GET'
            }),
            providesTags: ['DoctorAllDCR']
        }),
        
        //! By Id Tanni wala 
        getDoctorDcrById: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['DoctorAllDCR']
        }),

        //! CREATE doctor DCR by id
        addDoctorsAllDCR: builder.mutation({
            query: (addDoctorsDCR) => {

                return {
                    url: `dcr/dcr-for-doctor-company-product-map/`,
                    method: 'POST',
                    body: addDoctorsDCR,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['DoctorAllDCR']
        }),


        //! DELETE chemist DCR by id
        deleteDoctorsAllDCRById: builder.mutation({
            query: (id) => ({
                url: `dcr/dcr-for-doctor-company-product-map/${id['id']}/`,
                method: 'DELETE',
                body: id,
            }),
            invalidatesTags: ['DoctorAllDCR']
        }),

        //! Update Stockists DCR By ID 
        updateDoctorsAllDCR: builder.mutation({
            query: (updateDoctorsDCR) => {
                return {
                    url: `dcr/dcr-for-doctor-company-product-map/${updateDoctorsDCR['data']['id']}/`,
                    method: 'PATCH',
                    body: updateDoctorsDCR['data'],
                }
            },
            invalidatesTags: ['DoctorAllDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllDoctorsAllDCR', id, (draft) => {
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
    })
})

export const {
    useGetDoctorAllDCRByIdQuery,
    useGetAllDoctorsAllDCRQuery,
    useUpdateDoctorsAllDCRMutation,
    useDeleteDoctorsAllDCRByIdMutation,
    useAddDoctorsAllDCRMutation,
    useGetDoctorDcrByIdQuery,
    useGetPromotedProductByDcrIdQuery,
} = DoctorDCRAllSlice

//! returns the query result object
export const selectDoctorDCRAllDCRResult = DoctorDCRAllSlice.endpoints.getAllDoctorsAllDCR.select()

//!Creates memoized selector
const selectDoctorsDCRAllData = createSelector(
    selectDoctorDCRAllDCRResult,
    doctorDCRAllResult => doctorDCRAllResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDoctorsDCRAll,
    selectById: selectDoctorsDCRAllById,
    // Pass in a selector that returns the posts slice of state
} = doctorDCRAllAdapter.getSelectors(state => selectDoctorsDCRAllData(state) ?? initialState)



