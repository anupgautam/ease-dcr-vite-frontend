import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const tourPlanAdapter = createEntityAdapter();

const initialState = tourPlanAdapter.getInitialState();

export const TourPlanApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! Get all TourPlans
        getTourPlans: builder.query({
            query: () => ({
                url: 'mpo/company-mpo-tour-plan/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! Get all TourPlans By id
        getTourPlansById: builder.query({
            query: (id) => ({
                url: `mpo/company-mpo-tour-plan/${id}/`,
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! Delete tourplans by id
        deleteTourPlansById: builder.mutation({
            query: (id) => {
                
                return {
                    url: `mpo/company-mpo-tour-plan/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //! GET all Doctors to visits
        getDoctorsToVisit: builder.query({
            query: () => ({
                url: '/doctor/doctor/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! GET all selected areas
        getSelectedAreas: builder.query({
            query: () => ({
                url: 'company/company-area/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! GET all purposes of visit
        getPurposesOfVisits: builder.query({
            query: () => ({
                url: 'mpo/purpose-of-visit/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! GET all MPO names
        getMPONames: builder.query({
            query: () => ({
                url: 'stockistdcr/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! GET all shifts
        getShifts: builder.query({
            query: () => ({
                url: 'mpo/shift/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! POST Tour Plan
        createTourPlan: builder.mutation({
            query: (newTourPlan) => {
                newTourPlan.access = Cookies.get("access")
                newTourPlan.refresh = Cookies.get("refresh")
                
                return {
                    url: `mpo/company-mpo-tour-plan/`,
                    method: 'POST',
                    body: newTourPlan,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //! Update TourPlans data by id
        updateTourPlans: builder.mutation({
            query: (updateTourPlan) => {
                
                return {
                    url: `mpo/company-mpo-tour-plan/${updateTourPlan.id}`,
                    method: 'PUT',
                    body: updateTourPlan,
                }
            },
            invalidatesTags: ['TourPlan']
        })

    })
})

//! Api hooks
export const {
    useGetTourPlansQuery,
    useGetTourPlansByIdQuery,
    useDeleteTourPlansByIdMutation,
    useGetDoctorsToVisitQuery,
    useGetSelectedAreasQuery,
    useGetMPONamesQuery,
    useGetPurposesOfVisitsQuery,
    useGetShiftsQuery,
    useCreateTourPlanMutation,
    useUpdateTourPlansMutation,
} = TourPlanApiSlice

//! returns the query result object
export const selectTourPlansResult = TourPlanApiSlice.endpoints.getTourPlans.select()

//!Creates memoized selector
const selectTourPlansData = createSelector(
    selectTourPlansResult,
    TourPlanDCRResult => TourPlanDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTourPlans,
    selectById: selectTourPlansById,
    // Pass in a selector that returns the posts slice of state
} = tourPlanAdapter.getSelectors(state => selectTourPlansData(state) ?? initialState)