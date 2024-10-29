import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

const applicationSlice = createEntityAdapter();

const initialState = applicationSlice.getInitialState();

export const ApplicationSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Applications
        getApplications: builder.query({
            query: (page) => ({
                url: `expenses/mpo-leave-application/?application_id__company_name=${page.company_name}&mpo_name=${page.mpo_name}`,
                method: 'GET'
            }),
            providesTags: ['Application']
        }),

        //! Get all Applications By id
        getApplicationsById: builder.query({
            query: (id) => ({
                url: `expenses/mpo-leave-application/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Application']
        }),

        //! Get upper level company user role 
        getUpperLevelCompanyUserRoleById: builder.mutation({
            query: (id) => ({
                url: `user/get-all-upper-level-user-from-company-user-role/`,
                method: 'POST',
                body: id,
            }),
            invalidatesTags: ['Application']
        }),

        //! Delete Applications by id
        deleteApplicationsById: builder.mutation({
            query: (id) => {
                return {
                    url: `expenses/mpo-leave-application/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Application']
        }),
        createApplications: builder.mutation({
            query: (id) => {

                return {
                    url: `expenses/mpo-leave-application/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Application']
        }),


        //! Search MPO filter wala
        searchApplication: builder.mutation({
            query: (FilteredData) => {
                const { selectedOption, companyId, dateData } = FilteredData;
                return {
                    url: `expenses/mpo-leave-application/?mpo_name=${selectedOption}&application_id__company_name=${companyId}&application_id__submission_date=${dateData}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['Application']
        }),

        //! Update Applications data by id
        updateApplications: builder.mutation({
            query: (updateApplication) => {
                return {
                    url: `expenses/mpo-leave-application/${updateApplication.id}/`,
                    method: 'PATCH',
                    body: updateApplication,
                }
            },
            invalidatesTags: ['Application'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getApplications', id, (draft) => {
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
    useGetApplicationsQuery,
    useGetApplicationsByIdQuery,
    useGetUpperLevelCompanyUserRoleByIdMutation,
    useCreateApplicationsMutation,
    useUpdateApplicationsMutation,
    useDeleteApplicationsByIdMutation,
    useSearchApplicationMutation,
} = ApplicationSlices

//! returns the query result object
export const selectApplicationsResult = ApplicationSlices.endpoints.getApplications.select()

//!Creates memoized selector
const selectApplicationsData = createSelector(
    selectApplicationsResult,
    applicationResult => applicationResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllApplications,
    selectById: selectApplicationsById,
    // Pass in a selector that returns the posts slice of state
} = applicationSlice.getSelectors(state => selectApplicationsData(state) ?? initialState)



