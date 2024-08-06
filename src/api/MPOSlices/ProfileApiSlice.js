import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const profileAdapter = createEntityAdapter();

const initialState = profileAdapter.getInitialState();

export const ProfileSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET default profile
        getProfile: builder.query({
            query: () => ({
                url: `user/company-user/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Profile'
                ]
        }),

        //! GET profiles by id
        getProfileById: builder.query({
            query: (id) => ({
                url: `doctor/company-wise-doctor/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Profile']
        }),

        //! DELETE profiles by id
        deleteProfilesById: builder.mutation({
            query: (id) => ({
                url: `doctor/company-wise-doctor/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Profile']
        }),

        //! POST profiles 
        createProfiles: builder.mutation({
            query: (newProfile) => {
                newProfile.company_id = Cookies.get("company_id")
                return {
                    url: `doctor/doctor/`,
                    method: 'POST',
                    body: newProfile,
                }
            },
            invalidatesTags: ['Profile']
        }),

        //! Update profiles data by id
        updateProfiles: builder.mutation({
            query: (updateProfile) => {
                return {
                    url: `user/company-user/${updateProfile.get('id')}/`,
                    method: 'PUT',
                    body: updateProfile
                }
            },
            invalidatesTags: ['Profile'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllProfiles', id, (draft) => {
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
    useGetProfileQuery,
    useGetProfileByIdQuery,
    useCreateProfilesMutation,
    useDeleteProfilesByIdMutation,
    useUpdateProfilesMutation
} = ProfileSlice

//! returns the query result object
export const selectProfilesResult = ProfileSlice.endpoints.getProfile.select()

//!Creates memoized selector
const selectProfilesData = createSelector(
    selectProfilesResult,
    profilesResult => profilesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProfiles,
    selectById: selectProfileById,
    // Pass in a selector that returns the posts slice of state
} = profileAdapter.getSelectors(state => selectProfilesData(state) ?? initialState)



