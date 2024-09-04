import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const doctorAdapter = createEntityAdapter();

const initialState = doctorAdapter.getInitialState();

export const DoctorSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET all the doctors
        getAllDoctors: builder.query({
            query: (page) => ({
                url: `doctor/company-wise-doctor/?company_user_role_id=${page.id}&page=${page.page}&mpo_name=${page.mpo_name}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Doctor'
                ]
        }),

        //! Get MPO names without pagination
        postAllMPONamesNoPage: builder.mutation({
            query: (page) => (
                {
                    url: `mpo/get-mpo-list`,
                    method: 'POST',
                    body: page
                }),
            InvalidatesTags: (result, error, arg) =>
                [
                    'Doctor', 'Chemist'
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
                    'Doctor'
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
                    'Doctor'
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
                    'Doctor'
                ]
        }),

        //! GET doctors by id
        getDoctorsById: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),

        //! GET doctors area
        getDoctorsArea: builder.query({
            query: () => ({
                url: `doctor/company-wise-doctor-area/`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),


        //! GET doctors area by id
        getDoctorsAreaById: builder.query({
            query: (id) => ({
                url: `doctor/company-area-wise-doctor/${id}`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),

        //! GET doctor specialization
        getDoctorsSpecialization: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor-specialization/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Doctor'
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
            invalidatesTags: ['Doctor']
        }),

        //! GET doctor category by id 
        getDoctorsSpecialiationById: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor-specialization/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),

        //! DELETE doctors specialization
        deleteDoctorsSpecializationById: builder.mutation({
            query: (id) => ({
                url: `doctor/company-wise-doctor-specialization/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Doctor']
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
            invalidatesTags: ['Doctor']
        }),

        //! DELETE doctors events
        deleteDoctorsEventsById: builder.mutation({
            query: (id) => ({
                url: `doctor/doctor-events/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Doctor']
        }),

        //! POST doctors 
        createDoctors: builder.mutation({
            query: (newDoctor) => {
                newDoctor.company_id = Cookies.get("company_id")
                return {
                    url: `doctor/doctor/`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['Doctor']
        }),

        createDoctorsEvents: builder.mutation({
            query: (newDoctor) => {
                return {
                    url: `doctor/doctor-events/`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['Doctor']
        }),

        transferMpoArea: builder.mutation({
            query: (newDoctor) => {
                return {
                    url: `mpo/transfer-mpo-data`,
                    method: 'POST',
                    body: newDoctor,
                }
            },
            invalidatesTags: ['Doctor']
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
            invalidatesTags: ['Doctor']
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
            invalidatesTags: ['Doctor']
        }),

        //! Update doctors data by id
        updateDoctors: builder.mutation({
            query: (updateDoctor) => {
                return {
                    url: `doctor/doctor/${updateDoctor.get('id')}/`,
                    method: 'PUT',
                    body: updateDoctor
                }
            },
            invalidatesTags: ['Doctor'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllDoctors', id, (draft) => {
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
                    url: `doctor/company-wise-doctor-specialization/${updateDoctorSpecialization.get('id')}/`,
                    method: 'PATCH',
                    body: updateDoctorSpecialization
                }
            },
            invalidatesTags: ['Doctor'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllDoctors', id, (draft) => {
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
} = DoctorSlice

//! returns the query result object
export const selectDoctorsResult = DoctorSlice.endpoints.getAllDoctors.select()

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
} = doctorAdapter.getSelectors(state => selectDoctorsData(state) ?? initialState)



