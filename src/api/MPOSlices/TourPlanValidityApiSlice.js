import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const tourplanvalidityAdapter = createEntityAdapter();

const initialState = tourplanvalidityAdapter.getInitialState();



export const TourPlanValidityApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET default tourplanvalidity
        getTourPlanValidity: builder.query({
            query: () => ({
                url: `user/company-user/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'TourPlanValidity'
                ]
        }),

        //! GET tourplanvaliditys by id
        getTourPlanValidityById: builder.query({
            query: (companyId) => ({
                url: `stat/tour-plan-validity/${companyId}/`,
                method: 'GET'
            }),
            providesTags: ['TourPlanValidity']
        }),

        //! Filter wala
        //! GET tourplanvaliditys by id
        // getTourPlanValidityById: builder.query({
        //     query: (companyId) => ({
        //         url: `stat/tour-plan-validity/`,
        //         method: 'POST',
        //         body: companyId
        //     }),
        //     invalidatesTags: ['TourPlanValidity']
        // }),


        //! Update tourplanvaliditys data by id
        updateTourPlanValidity: builder.mutation({
            query: (updateTourPlanValidity) => {
                return {
                    url: `stat/tour-plan-validity/${updateTourPlanValidity.get('id')}/`,
                    method: 'PUT',
                    body: updateTourPlanValidity
                }
            },
            invalidatesTags: ['TourPlanValidity'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllTourPlanValidity', id, (draft) => {
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
    useGetTourPlanValidityQuery,
    useGetTourPlanValidityByIdQuery,
    useUpdateTourPlanValidityMutation
} = TourPlanValidityApiSlice

//! returns the query result object
export const selectTourPlanValidityResult = TourPlanValidityApiSlice.endpoints.getTourPlanValidity.select()

//!Creates memoized selector
const selectTourPlanValidityData = createSelector(
    selectTourPlanValidityResult,
    tourplanvalidityResult => tourplanvalidityResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTourPlanValidity,
    selectById: selectTourPlanValidityById,
    // Pass in a selector that returns the posts slice of state
} = tourplanvalidityAdapter.getSelectors(state => selectTourPlanValidityData(state) ?? initialState)



