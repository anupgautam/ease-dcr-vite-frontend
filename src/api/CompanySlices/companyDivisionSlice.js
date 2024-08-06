import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyDivisionAdapter = createEntityAdapter();

const initialState = companyDivisionAdapter.getInitialState();

export const CompanyDivisionSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the users
        getAllCompanyDivisions: builder.query({
            query: (page) => ({
                url: `/company/company-wise-division/`,
                method: 'GET'
            }),
            providesTags: ['CompanyDivisions']
        }),


        //! GET users by id
        getCompanyDivisionsById: builder.query(
            {
                query: (id) => (
                    {
                        url: `/company/company-wise-division/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyDivisions']
            }),

        // Get Division by company_id
        //! GET users by id
        getCompanyDivisionsByCompanyId: builder.query(
            {
                query: (companyId) => (
                    {
                        url: `/company/company-wise-division/?company_name=${companyId}`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyDivisions']
            }),

        //! DELETE users by id
        deleteCompanyDivisionById: builder.mutation({
            query: (id) => {
                return {
                    url: `/company/company-wise-division/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyDivisions']
        }),

        //! POST users 
        createCompanyDivisions: builder.mutation({
            query: (createCompanyDivisions) => {
                // 

                return {
                    url: "/company/company-wise-division/",
                    method: 'POST',
                    body: createCompanyDivisions,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyDivisions']
        }),

        //! Login User


        //! Update company users data by id
        updateCompanyDivisions: builder.mutation({
            query: (updateCompanyDivisions) => {
                return {
                    url: `/company/company-wise-division/${updateCompanyDivisions.get('id')}/`,
                    method: 'PUT',
                    body: updateCompanyDivisions
                }
            },
            invalidatesTags: ['CompanyDivisions'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyDivisions', id, (draft) => {
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
    useGetAllCompanyDivisionsQuery,
    useGetCompanyDivisionsByIdQuery,
    useDeleteCompanyDivisionByIdMutation,
    useCreateCompanyDivisionsMutation,
    useUpdateCompanyDivisionsMutation,
    useGetCompanyDivisionsByCompanyIdQuery
} = CompanyDivisionSlice

//! returns the query result object
export const selectCompanyDivisionResult = CompanyDivisionSlice.endpoints.getAllCompanyDivisions.select()

//!Creates memoized selector
const selectCompanyDivisionsData = createSelector(
    selectCompanyDivisionResult,
    companyDivisionResult => companyDivisionResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyDivisions,
    selectById: selectCompanyDivisionsById,
    // Pass in a selector that returns the posts slice of state
} = companyDivisionAdapter.getSelectors(state => selectCompanyDivisionsData(state) ?? initialState)



