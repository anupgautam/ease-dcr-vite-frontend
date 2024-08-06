import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";


const doctorAdapter = createEntityAdapter();

const initialState = doctorAdapter.getInitialState();

export const doctorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the doctors
        getAllDoctors: builder.query({
            query: () => ({
                url: 'doctor/company-wise-doctor/',
                method: 'GET'
            }),
            providesTags: ['Doctor']
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
                url: `doctor/company-area-wise-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),

        //! GET doctor category
        getDoctorsCategory: builder.query({
            query: () => ({
                url: `doctor/company-wise-doctor-category/`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),

        //! GET doctor category by id 
        getDoctorsCategoryById: builder.query({
            query: (id) => ({
                url: `doctor/company-category-wise-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Doctor']
        }),

        //!  GET company area without pagination
        getAllCompanyAreaOptions: builder.query({
            query: () => ({
                url: 'company/company-area/',
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),

        //!  GET visited Doctors without pagination
        getAllVisitedDoctorsOptions: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor-without-pagination/?company_name=${id.company_name}&mpo_name=${id.mpo_name}&doctor_name__doctor_territory=${id.mpo_area}`,
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

        //! DELETE doctors categories  by id
        deleteDoctorsCategoryById: builder.mutation({
            query: (id) => ({
                url: `doctor/company-wise-doctor-category/${id}/`,
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
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['Doctor']
        }),


        //! Search Doctor wala post
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

        //! Update doctors data by id
        updateDoctors: builder.mutation({
            query: (updateDoctor) => {
                return {
                    url: `doctor/doctor/${updateDoctor.get('doctor_id')}/`,
                    method: 'PUT',
                    body: updateDoctor,
                }
            },
            invalidatesTags: ['Doctor']
        }),
        getAllVisitedMpoWiseDoctor: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor-without-pagination/?company_name=${id.company_name}&mpo_name=${id.mpo_name}&doctor_name__doctor_territory=${id.mpo_area}`,
                method: 'GET'
            }),
            providesTags: ['DoctorDCR']
        }),
        
        getAllVisitedMpoWiseChemist: builder.query({
            query: (id) =>
                    ({
                        url: `chemist/company-wise-chemist-with-out-pagination/?company_name=${id.company_name}&mpo_name=${id.mpo_name}&chemist_name__chemist_territory=${id.mpo_area}`,
                        method: 'GET'
                    }),
            providesTags: ['DoctorDCR']
        }),
    })
})

//! Api hooks
export const {
    useGetAllDoctorsQuery,
    useGetDoctorsByIdQuery,
    useGetDoctorsAreaQuery,
    useGetDoctorsAreaByIdQuery,
    useGetDoctorsCategoryQuery,
    useGetDoctorsCategoryByIdQuery,
    useGetAllVisitedDoctorsOptionsQuery,
    useGetAllCompanyAreaOptionsQuery,
    useDeleteDoctorsByIdMutation,
    useDeleteDoctorsCategoryByIdMutation,
    useCreateDoctorsMutation,
    useUpdateDoctorsMutation,
    useSearchDoctorsMutation,
    useGetAllVisitedMpoWiseDoctorQuery,
    useGetAllVisitedMpoWiseChemistQuery
} = doctorApiSlice

export const {
    useCreateDoctorMutation
} = doctorApiSlice


export const selectDoctorsResult = doctorApiSlice.endpoints.getAllDoctors.select()

// Creates memoized selector
const selectDoctorssData = createSelector(
    selectDoctorsResult,
    DoctorsResult => DoctorsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllDoctors,
    selectById: selectDoctorById,
    // Pass in a selector that returns the posts slice of state
} = doctorAdapter.getSelectors(state => selectDoctorssData(state) ?? initialState)