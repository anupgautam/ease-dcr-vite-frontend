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
            query: (page) => ({
                url: `mpo/company-mpo-tour-plan/?page=${page}`,
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
                url: 'TourPlandcr/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! GET all shifts
        getShifts: builder.query({
            query: () => ({
                url: '/mpo/shift/',
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

        //! Search MPO filter wala
        searchMPOName: builder.mutation({
            query: (FilteredData) => {
                // 
                const { mpo_name_id, tour_plan__tour_plan__select_the_month, tour_plan__tour_plan__select_the_date_id } = FilteredData;
                return {
                    url: `mpo/company-mpo-tour-plan/?mpo_name_id=${mpo_name_id}&tour_plan__tour_plan__select_the_month=${tour_plan__tour_plan__select_the_month}&tour_plan__tour_plan__select_the_date_id=${tour_plan__tour_plan__select_the_date_id}`,
                    method: 'GET',
                    // body: { ...FilteredData },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //! Update TourPlans data by id
        updateTourPlans: builder.mutation({
            query: (updateTourPlan) => {
                for (const value of updateTourPlan.values()) {
                    
                }
                return {
                    url: `mpo/company-mpo-tour-plan/${updateTourPlan.get('id')}/`,
                    method: 'PATCH',
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
    useSearchMPONameMutation,
    useUpdateTourPlansMutation,
} = TourPlanApiSlice




export const selectTourPlansResult = TourPlanApiSlice.endpoints.getTourPlans.select()

// Creates memoized selector
const selectTourPlanssData = createSelector(
    selectTourPlansResult,
    TourPlansResult => TourPlansResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTourPlans,
    selectById: selectTourPlanById,
    // Pass in a selector that returns the posts slice of state
} = tourPlanAdapter.getSelectors(state => selectTourPlanssData(state) ?? initialState)