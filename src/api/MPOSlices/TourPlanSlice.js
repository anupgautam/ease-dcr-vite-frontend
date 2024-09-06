import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const tourplanAdapter = createEntityAdapter();

const initialState = tourplanAdapter.getInitialState();

export const TourPlanSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all TourPlans
        getTourPlans: builder.query({
            query: (page) => {
                return {
                    url: `mpo/company-mpo-tour-plan/?company_name=${page.id}&page=${page.page}`,
                    method: 'GET'
                };
            },
            providesTags: ['Tourplan'],
            invalidatesTags: ['Tourplan']
        }),

        getMpoArea: builder.query({
            query: (id) => {
                return {
                    url: `mpo/company-mpo-area/?company_name=${id.company_name}&mpo_name=${id.mpo_name}`,
                    method: 'GET',
                };
            },
            providesTags: ['Tourplan', 'Doctor'],
            invalidatesTags: ['Tourplan']
        }),


        //! Get all TourPlans without pagination
        getTourPlansWithoutPaginate: builder.query({
            query: () => ({
                url: `mpo/company-mpo-tour-plan-with-out-pagination/`,
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
            invalidatesTags: ['TourPlan', 'PostTourplan']
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

        //! Get all locked user
        getLockedUsers: builder.query({
            query: (id) => ({
                url: `mpo/company-mpo-tour-plan/?company_name=${id}&tour_plan__tour_plan__is_admin_opened=true`,
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        getTourplanOfMpoByDateMonth: builder.query({
            query: mpoName => ({
                url: `/mpo/company-mpo-tour-plan/?company_name=${mpoName.company_name}&mpo_name_id=${mpoName.mpo_name}&tour_plan__tour_plan__select_the_month=${mpoName.month}&page=${mpoName.page}&tour_plan__tour_plan__year=${mpoName.date}&mpo_name__role_name__role_name=${mpoName.role_data}`,
                method: 'GET',
            }),
            providesTags: ['Tourplan', 'TourPlan'],
        }),
        getTourplanOfMpoByDateMonthandShift: builder.query({
            query: mpoName => ({
                url: `/mpo/company-mpo-tour-plan/?company_name=${mpoName.company_name}&mpo_name_id=${mpoName.mpo_name}&tour_plan__tour_plan__select_the_date_id=${mpoName.date}&tour_plan__shift_id=${mpoName.shift}`,
                method: 'GET',
            }),
            providesTags: ['Tourplan'],
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
            query: (id) => ({
                url: `mpo/shift/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! GET MPO area
        areaMPO: builder.query({
            query: (id) => {
                return {
                    url: `mpo/company-mpo-area/?company_name=${id.company_name}&mpo_name=${id.mpo_name}`,
                    method: 'GET'
                }
            },
            providesTags: ['TourPlan']
        }),
        getAreaMPOById: builder.query({
            query: (id) => {
                return {
                    url: `mpo/company-mpo-area/${id}/`,
                    method: 'GET'
                }
            },
            providesTags: ['TourPlan']
        }),

        postAreaofMPO: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/company-mpo-area/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['TourPlan', 'Doctor']
        }),

        updateAreaofMPO: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/company-mpo-area/`,
                    method: 'PATCH',
                    body: id
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //! Delete MPO areas
        deleteareaMPO: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/company-mpo-area/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['TourPlan']
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

        //! Unlock Locked User
        unlockLockedUser: builder.mutation({
            query: (unlockUser) => {
                return {
                    url: `mpo/company-mpo-tour-plan/${unlockUser.id}/`,
                    method: 'PATCH',
                    body: unlockUser.data,
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
        getTourPlanFliterByUserData: builder.query({
            query: (id) => {
                return {
                    url: `mpo/company-mpo-tour-plan/?company_name=${id.company_name}&mpo_name_id=${id.mpo_name}&tour_plan__tour_plan__select_the_month=${id.month}&tour_plan__tour_plan__select_the_date_id=${id.date}`,
                    method: 'PATCH',
                    body: unlockUser.data,
                }
            }
        }),

        //! Search MPO Areas
        searchMPOArea: builder.mutation({
            query: (FilteredData) => {
                const { selectedOption, companyId, companyArea } = FilteredData;
                return {
                    url: `mpo/company-mpo-area/?company_name=${companyId}&mpo_name=${selectedOption}&company_area=${companyArea}`,
                    method: 'GET',
                    // body: { ...FilteredData },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //data lock 
        getLockedTourPlan: builder.query({
            query: (id) => {
                // 
                return {
                    url: `mpo/company-mpo-tour-plan/get_locked_tour_plan_list_mpo/?mpo_name=${id}`,
                    method: 'GET',
                }
            },
            providesTags: ['TourPlan']
        }),
        getLockedTourPlanForHigher: builder.query({
            query: (id) => {
                // 
                return {
                    url: `other-roles/higher-order-tour-plan/get_locked_tour_plan_list/?user_id=${id}`,
                    method: 'GET',
                }
            },
            providesTags: ['TourPlan']
        }),

        //! Search Locked Users MPO
        searchLockedUsersMPO: builder.mutation({
            query: (FilteredData) => {
                // 
                const { selectedOption, companyId, roleSelect } = FilteredData;
                return {
                    url: `mpo/company-mpo-tour-plan/?mpo_name_id=${selectedOption}&company_name=${companyId}&mpo_name__role_name__role_name=${roleSelect}`,
                    method: 'GET',
                    // body: { ...FilteredData },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['TourPlan']
        }),
        //! Search Locked Users Higher Order
        searchLockedUsersHigherOrder: builder.mutation({
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
        bulkUpdateTourplanByMpo: builder.mutation({
            query: value => {
                return {
                    url: '/mpo/tour-plan-bulk-update/',
                    method: 'POST',
                    body: value,
                };
            },
            invalidatesTags: ['TourPlan'],
        }),
        bulkUpdateTourplanByHo: builder.mutation({
            query: value => {
                return {
                    url: '/other-roles/higher-order-tour-plan-bulk-update',
                    method: 'POST',
                    body: value,
                };
            },
            invalidatesTags: ['TourPlan'],
        }),

        //! Update TourPlans data by id
        updateTourPlans: builder.mutation({
            query: (updateTourPlan) => {
                return {
                    url: `mpo/company-mpo-tour-plan/${updateTourPlan.id}/`,
                    method: 'PATCH',
                    body: updateTourPlan.value
                }
            },
            invalidatesTags: ['TourPlan'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getTourPlans', id, (draft) => {
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

        //! TourPlan locks
        //! Get TP lock days
        getTPlockDays: builder.query({
            query: () => ({
                url: 'company/company-roles-tp-lock/',
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! Get By id
        getTPLockDaysById: builder.query({
            query: (id) => ({
                url: `company/company-roles-tp-lock/${id}/`,
                method: 'GET'
            }),
            providesTags: ['TourPlan']
        }),

        //! POST TP Days
        createTPDays: builder.mutation({
            query: (TPDays) => {
                return {
                    url: `company/company-roles-tp-lock/`,
                    method: 'POST',
                    body: TPDays,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        postUserIdToGetMpoArea: builder.mutation({
            query: (TPDays) => {
                return {
                    url: `user/get-lower-level-areas/`,
                    method: 'POST',
                    body: TPDays,
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //! Update TP Days
        //! Update users data by id
        updateTPDays: builder.mutation({
            query: (updateTPDays) => {
                return {
                    url: `company/company-roles-tp-lock/${updateTPDays.get('id')}/`,
                    method: 'PATCH',
                    body: updateTPDays
                }
            },
            invalidatesTags: ['TourPlan'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getTPlockDays', id, (draft) => {
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
    useGetTourPlansQuery,
    useGetTourPlansWithoutPaginateQuery,
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
    useGetMpoAreaQuery,
    useGetTourplanOfMpoByDateMonthQuery,
    useGetLockedUsersQuery,
    useUnlockLockedUserMutation,
    useSearchLockedUsersMPOMutation,
    useSearchLockedUsersHigherOrderMutation,
    useAreaMPOQuery,
    useDeleteareaMPOMutation,
    useSearchMPOAreaMutation,
    useGetLockedTourPlanQuery,
    useGetTourPlanFliterByUserDataQuery,
    usePostAreaofMPOMutation,
    useGetAreaMPOByIdQuery,
    useBulkUpdateTourplanByMpoMutation,
    useGetTourplanOfMpoByDateMonthandShiftQuery,
    useBulkUpdateTourplanByHoMutation,
    useGetLockedTourPlanForHigherQuery,

    //! TP Lock Hooks
    useGetTPlockDaysQuery,
    useGetTPLockDaysByIdQuery,
    useCreateTPDaysMutation,
    useUpdateTPDaysMutation,
    usePostUserIdToGetMpoAreaMutation,
} = TourPlanSlice

//! returns the query result object
export const selectTourPlanResult = TourPlanSlice.endpoints.getTourPlans.select()

//!Creates memoized selector
const selectTourPlanData = createSelector(
    selectTourPlanResult,
    tourplanResult => tourplanResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTourPlans,
    selectById: selectTourPlansById,
    // Pass in a selector that returns the posts slice of state
} = tourplanAdapter.getSelectors(state => selectTourPlanData(state) ?? initialState)



