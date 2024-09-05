import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const TargetSlice = createEntityAdapter();

const initialState = TargetSlice.getInitialState();

export const TargetSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Targets
        getTargets: builder.query({
            query: (page) => ({
                url: `expenses/target/?company_name=${page}`,
                method: 'GET'
            }),
            providesTags: ['Target']
        }),

        //! Get all Targets By id
        getTargetsById: builder.query({
            query: (id) => ({
                url: `expenses/target/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Target']
        }),

        //GET Targets by filtered value
        getTargetsByFilter: builder.query({
            query: (filters) => {
                const { selectedYear, selectedRole } = filters;
                return {
                    url: `expenses/target/?target_from__company_name=${filters.company_name}&year=${selectedYear ? selectedYear : ""}&target_to__role_name=${selectedRole ? selectedRole : ""}`,
                    method: 'GET'
                }
            },
            invalidatesTags: ['Target']
        }),

        //!GET Target by user
        getTargetsByUser: builder.mutation({
            query: (id) => {

                return {
                    url: `expenses/get-target-of-user/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Target']
        }),


        //! Delete Targets by id
        deleteTargetsById: builder.mutation({
            query: (id) => {

                return {
                    url: `expenses/target/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Target']
        }),

        //! Add Target
        createTarget: builder.mutation({
            query: (newTarget) => {
                return {
                    url: `expenses/target/`,
                    method: 'POST',
                    body: newTarget,
                }
            },
            invalidatesTags: ['Target']
        }),


        // //! Search MPO filter wala
        searchTarget: builder.mutation({
            query: (FilteredData) => {
                return {
                    url: `expenses/target/search_target/`,
                    method: 'POST',
                    body: FilteredData,
                }
            },
            providesTags: ['Target']
        }),

        //! Update Targets data by id
        updateTargets: builder.mutation({
            query: (updateTarget) => {
                return {
                    url: `expenses/target/${updateTarget.get('id')}/`,
                    method: 'PATCH',
                    body: updateTarget,
                }
            },
            invalidatesTags: ['Target'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getTargets', id, (draft) => {
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
    useGetTargetsQuery,
    useGetTargetsByIdQuery,
    useGetTargetsByFilterQuery,
    useCreateTargetMutation,
    useUpdateTargetsMutation,
    useDeleteTargetsByIdMutation,
    useSearchTargetMutation,
    useGetTargetsByUserMutation
} = TargetSlices

//! returns the query result object
export const selectTargetsResult = TargetSlices.endpoints.getTargets.select()

//!Creates memoized selector
const selectTargetsData = createSelector(
    selectTargetsResult,
    TargetResult => TargetResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTargets,
    selectById: selectTargetsById,
    // Pass in a selector that returns the posts slice of state
} = TargetSlice.getSelectors(state => selectTargetsData(state) ?? initialState)



