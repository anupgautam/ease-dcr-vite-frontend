import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const hoTourPlanAdapter = createEntityAdapter();

const initialState = hoTourPlanAdapter.getInitialState();

export const HOTourPlanSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all HOTourPlans
        getHOTourPlans: builder.query({
            query: (page) => ({
                url: `other-roles/higher-order-tourplan-with-pagination/?page=${page.page}&visited_with__company_name=${page.company_name}`,
                method: 'GET'
            }),
            providesTags: ['HOTourPlan', 'PostTourplan','TourPlan']
        }),

        //! Get all HOTourPlans By id
        getHOTourPlansById: builder.query({
            query: (id) => ({
                url: `other-roles/higher-order-tourplan-with-pagination/${id}/`,
                method: 'GET'
            }),
            providesTags: ['HOTourPlan']
        }),

        //! Delete HOtourplans by id
        deleteHOTourPlansById: builder.mutation({
            query: (id) => {

                return {
                    url: `other-roles/higher-order-tourplan-with-pagination/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['HOTourPlan']
        }),

        //! POST Tour Plan
        createHOTourPlan: builder.mutation({
            query: (newTourPlan) => {
                newTourPlan.access = Cookies.get("access")
                newTourPlan.refresh = Cookies.get("refresh")

                return {
                    url: `other-roles/higher-order-tourplan-with-pagination/`,
                    method: 'POST',
                    body: newTourPlan,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['HOTourPlan']
        }),

        //! Search MPO filter wala
        searchHOTourPlan: builder.mutation({
            query: (FilteredData) => {
                const { user_id, month, date } = FilteredData;
                return {
                    url: `other-roles/higher-order-tourplan-with-pagination/?user_id=${user_id}&month=${month}&year=${date}`,
                    method: 'GET',
                    // body: { ...FilteredData },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['HOTourPlan']
        }),

        getHOTourPlansByUserId: builder.query({
            query: (id) => ({
                url: `other-roles/higher-order-tourplan-with-pagination/?user_id=${id.user_id}&month=${id.month}&year=${id.date}&page=${id.page}&company_id=${id.company_name}`,
                method: 'GET'
            }),
            providesTags: ['HOTourPlan', 'TourPlan']
        }),

        //! Search Tour Plan CSV filter wala
        searchTourPlanCSV: builder.mutation({
            query: (FilteredData) => {
                // 
                return {
                    // url: `other-roles/higher-order-tourplan-with-pagination/?user_id=${user_id}&month=${monthData}&date=${date}`,
                    method: 'GET',
                    // body: { ...FilteredData },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['TourPlan']
        }),

        //! Update HOTourPlans data by id
        updateHOTourPlans: builder.mutation({
            query: (updateTourPlan) => {
                return {
                    url: `other-roles/higher-order-tour-plan/${updateTourPlan.get('id')}/`,
                    method: 'PATCH',
                    body: updateTourPlan,
                }
            },
            invalidatesTags: ['HOTourPlan'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllHOTourPlans', id, (draft) => {
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
    useGetHOTourPlansByIdQuery,
    useGetHOTourPlansQuery,
    useCreateHOTourPlanMutation,
    useUpdateHOTourPlansMutation,
    useDeleteHOTourPlansByIdMutation,
    useSearchHOTourPlanMutation,
    useGetHOTourPlansByUserIdQuery,
} = HOTourPlanSlice

//! returns the query result object
export const selectHOTourPlansResult = HOTourPlanSlice.endpoints.getHOTourPlans.select()

//!Creates memoized selector
const selectHOTourPlansData = createSelector(
    selectHOTourPlansResult,
    hoTourPlanResult => hoTourPlanResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllHOTourPlans,
    selectById: selectHOTourPlansById,
    // Pass in a selector that returns the posts slice of state
} = hoTourPlanAdapter.getSelectors(state => selectHOTourPlansData(state) ?? initialState)



