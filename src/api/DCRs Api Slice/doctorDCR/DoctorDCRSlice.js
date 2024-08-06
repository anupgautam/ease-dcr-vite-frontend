import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const doctorDCRadapter = createEntityAdapter();

const initialState = doctorDCRadapter.getInitialState();

export const DoctorDCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all doctor DCR
        getAllDoctorsDCR: builder.query({
            query: (page) => ({
                url: `dcr/mpo-shift-wise-dcr-for-doctor/?dcr__dcr__visited_doctor__company_name=${page.id}&page=${page.page}`,
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),
        getAllDataofDCRDoctor: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-doctor/?dcr__dcr__visited_doctor__company_name=${id.id}&page=${id.page}`,
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),
        //! GET Doctor DCR by ID 
        getDoctorDCRById: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),

        //! Search Doctor DCR 
        searchDoctorsDCR: builder.query({
            query: (searchChemistsDCR) => {

                return {
                    url: `dcr/mpo-shift-wise-dcr-for-doctor/?dcr__dcr__visited_doctor__company_name=${searchChemistsDCR.company_name}&mpo_name=${searchChemistsDCR.user_id}&dcr__dcr__month=${searchChemistsDCR.month}&dcr__dcr__year=${searchChemistsDCR.date}&dcr__dcr__year=${searchChemistsDCR.fullDate}`,
                    method: 'GET',
                }
            },
            providesTags: ['DoctorDCR']
        }),

        //! DELETE doctor DCR by id
        deleteDoctorsDCRById: builder.mutation({
            query: ({ id }) => ({
                url: `dcr/mpo-shift-wise-dcr-for-doctor/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['DoctorDCR']
        }),

        //! Update stockist data by id
        updateDoctorsDCR: builder.mutation({
            query: (updateDoctorsDCR) => {
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-doctor/${updateDoctorsDCR.get('id')}/`,
                    method: 'PUT',
                    body: updateDoctorsDCR,
                }
            },
            invalidatesTags: ['Stockist'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllDoctorsDCR', id, (draft) => {
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
    useGetAllDoctorsDCRQuery,
    useGetDoctorDCRByIdQuery,
    useUpdateDoctorsDCRMutation,
    useSearchDoctorsDCRQuery,
    useDeleteDoctorsDCRByIdMutation,
    useGetAllDataofDCRDoctorQuery
} = DoctorDCRSlice

//! returns the query result object
export const selectDoctorDCRsResult = DoctorDCRSlice.endpoints.getAllDoctorsDCR.select()

//!Creates memoized selector
const selectDoctorDCRsData = createSelector(
    selectDoctorDCRsResult,
    doctorDCRresult => doctorDCRresult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDoctorDCRs,
    selectById: selectDoctorsById,
    // Pass in a selector that returns the posts slice of state
} = doctorDCRadapter.getSelectors(state => selectDoctorDCRsData(state) ?? initialState)



