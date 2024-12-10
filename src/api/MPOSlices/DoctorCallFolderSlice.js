import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const doctorCallAdapter = createEntityAdapter();

const initialState = doctorCallAdapter.getInitialState();

export const DoctorCallFolderSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET all the doctors calls
        getDoctorCall: builder.query({
            query: (page) => ({
                url: `doctor/doctor-call-folder/?company_name=${page.id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! GET all the doctors calls
        getDoctorCallById: builder.query({
            query: (id) => ({
                url: `doctor/doctor-call-folder/${id}/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! DELETE doctors Calls
        deleteDoctorCallById: builder.mutation({
            query: (id) => ({
                url: `doctor/doctor-call-folder/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['DoctorCall']
        }),

        //! Update doctors data by id
        updateDoctorCall: builder.mutation({
            query: (updateDoctor) => {
                return {
                    url: `doctor/doctor-call-folder/${updateDoctor.get('id')}/`,
                    // url: `doctor/doctor-call-folder/${id}/`,
                    method: 'PATCH',
                    body: updateDoctor,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['DoctorCall'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('useGetDoctorCallQuery', id, (draft) => {
                        Object.assign(draft, patch.formData)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),

        //! GET company division product
        getCompanyDivisionProduct: builder.query({
            query: (page) => ({
                url: `product/company-division-product-without-pagination/?company_name=${page.id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! Get MPO names without pagination
        postAllMPONamesNoPage: builder.mutation({
            query: (page) => (
                {
                    url: `mpo/get-mpo-list/`,
                    method: 'POST',
                    body: page
                }),
            InvalidatesTags: (result, error, arg) =>
                [
                    'DoctorCall', 'Chemist'
                ]
        }),

        //! Get MPO areas without pagination
        getAllMPOAreasNoPage: builder.query({
            query: (page) => {
                return {
                    url: `mpo/company-mpo-area/?company_name=${page.id}&mpo_name=${page.mpo_name}`,
                    method: 'GET'
                }
            },
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! GET all doctors without pagination
        getAllDoctorsWithoutPaginate: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor/?company_name=${id.id}&`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! GET all the doctor events
        getAllDoctorEvents: builder.query({
            query: (page) => {
                return {
                    url: `doctor/doctor-events/?doctor_id__company_name=${page.id}&page=${page.page}&mpo_id=${page.mpo_name}`,
                    method: 'GET'
                }
            },
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! GET doctors by id
        getDoctorsById: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['DoctorCall']
        }),

        //! GET doctors area
        getDoctorsArea: builder.query({
            query: () => ({
                url: `doctor/company-wise-doctor-area/`,
                method: 'GET'
            }),
            providesTags: ['DoctorCall']
        }),


        //! GET doctors area by id
        getDoctorsAreaById: builder.query({
            query: (id) => ({
                url: `doctor/company-area-wise-doctor/${id}`,
                method: 'GET'
            }),
            providesTags: ['DoctorCall']
        }),

        //! GET doctor specialization
        getDoctorsSpecialization: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor-specialization/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'DoctorCall'
                ]
        }),

        //! POST doctors specialization
        createDoctorsSpecialization: builder.mutation({
            query: (newDoctor) => {
                return {
                    url: `doctor/company-wise-doctor-specialization/`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['DoctorCall']
        }),

        //! GET doctor category by id 
        getDoctorsSpecialiationById: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor-specialization/${id}/`,
                method: 'GET'
            }),
            providesTags: ['DoctorCall']
        }),

        //! DELETE doctors specialization
        deleteDoctorsSpecializationById: builder.mutation({
            query: (id) => ({
                url: `doctor/company-wise-doctor-specialization/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['DoctorCall']
        }),

        //!  GET company area without pagination
        getAllCompanyAreaOptions: builder.query({
            query: () => ({
                url: 'company/company-area/',
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),
        getFliterDoctorEventByMpoId: builder.query({
            query: (id) => ({
                url: `doctor/doctor-events/?mpo_id=${id.mpo_name}&doctor_id__company_name=${id.company_name}`,
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),
        getAllDoctorByMpoAndMpoArea: builder.query({
            query: (id) => ({
                url: `/doctor/company-wise-doctor/?company_name=${id.company_name}&doctor_name__doctor_territory=${id.mpo_area}&mpo_name=${id.mpo_name}&page=${id.page}`,
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),

        //!  GET visited Doctors without pagination
        getAllVisitedDoctorsOptions: builder.query({
            query: () => ({
                url: 'doctor/company-wise-doctor-without-pagination/',
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),

        //! DELETE doctors by id
        deleteDoctorsById: builder.mutation({
            query: (id) => ({
                url: `doctor/company-wise-doctor/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['DoctorCall']
        }),

        //! DELETE doctors events
        deleteDoctorsEventsById: builder.mutation({
            query: (id) => ({
                url: `doctor/doctor-events/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['DoctorCall']
        }),

        //! POST doctors 
        createDoctorCall: builder.mutation({
            query: (newDoctor) => {
                return {
                    url: `doctor/doctor-call-folder`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['DoctorCall']
        }),

        createDoctorsEvents: builder.mutation({
            query: (newDoctor) => {
                return {
                    url: `doctor/doctor-events/`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['DoctorCall']
        }),

        transferMpoArea: builder.mutation({
            query: (newDoctor) => {
                return {
                    url: `mpo/transfer-mpo-data`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['DoctorCall']
        }),

        searchDoctors: builder.mutation({
            query: (searchDoctor) => {
                return {
                    url: `doctor/company-wise-doctor/search_doctor/`,
                    method: 'POST',
                    body: searchDoctor,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['DoctorCall']
        }),

        searchDoctorEvents: builder.mutation({
            query: (FilteredData) => {
                const { companyId, mpoName } = FilteredData;
                return {
                    url: `doctor/doctor-events-without-pagination/?company_name=${companyId}&mpo_id=${mpoName}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['DoctorCall']
        }),

        //! Update doctors data by id
        updateDoctors: builder.mutation({
            query: (updateDoctor) => {
                return {
                    // url: `doctor/doctor/${updateDoctor.get('id')}/`,
                    url: `doctor/doctor/${updateDoctor.id}/`,
                    method: 'PATCH',
                    body: updateDoctor,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['DoctorCall'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('useGetDoctorCallQuery', id, (draft) => {
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

        //! Update doctors data by id
        updateDoctorsSpecialization: builder.mutation({
            query: (updateDoctorSpecialization) => {
                return {
                    url: `doctor/company-wise-doctor-specialization/${updateDoctorSpecialization.id}/`,
                    method: 'PATCH',
                    body: updateDoctorSpecialization
                }
            },
            invalidatesTags: ['DoctorCall'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('useGetDoctorCallQuery', id, (draft) => {
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
    useGetAllDoctorsQuery,
    useGetAllDoctorsWithoutPaginateQuery,
    useGetDoctorsByIdQuery,
    useGetDoctorsAreaQuery,
    useGetDoctorsAreaByIdQuery,
    useGetDoctorsCategoryByIdQuery,
    useGetAllVisitedDoctorsOptionsQuery,
    useGetAllCompanyAreaOptionsQuery,
    useGetAllDoctorEventsQuery,
    useDeleteDoctorsEventsByIdMutation,
    useDeleteDoctorsByIdMutation,
    useCreateDoctorsMutation,
    useUpdateDoctorsMutation,
    useUpdateDoctorsCategoriesMutation,
    useSearchDoctorsMutation,
    useSearchDoctorEventsMutation,
    useGetAllMPOAreasNoPageQuery,
    useGetDoctorsSpecialiationByIdQuery,
    useGetDoctorsSpecializationQuery,
    useDeleteDoctorsSpecializationByIdMutation,
    useCreateDoctorsSpecializationMutation,
    useUpdateDoctorsSpecializationMutation,
    usePostAllMPONamesNoPageMutation,
    useGetAllDoctorByMpoAndMpoAreaQuery,
    useGetFliterDoctorEventByMpoIdQuery,
    useCreateDoctorsEventsMutation,
    useTransferMpoAreaMutation,


    //! Doctor Call
    useGetDoctorCallQuery,
    useGetDoctorCallByIdQuery,
    useGetCompanyDivisionProductQuery,
    useCreateDoctorCallMutation,
    useUpdateDoctorCallMutation,
    useDeleteDoctorCallByIdMutation,
} = DoctorCallFolderSlice

//! returns the query result object
export const selectDoctorsResult = DoctorCallFolderSlice.endpoints.getDoctorCall.select()

//!Creates memoized selector
const selectDoctorsData = createSelector(
    selectDoctorsResult,
    doctorsResult => doctorsResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDoctors,
    selectById: selectDoctorById,
    // Pass in a selector that returns the posts slice of state
} = doctorCallAdapter.getSelectors(state => selectDoctorsData(state) ?? initialState)



