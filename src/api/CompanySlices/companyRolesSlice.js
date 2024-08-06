import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyRolesAdapter = createEntityAdapter();

const initialState = companyRolesAdapter.getInitialState();

export const CompanyRolesSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the users
        getAllCompanyRoles: builder.query({
            query: (page) => ({
                url: `company/company-roles/?company_name=${page}`,
                method: 'GET'
            }),
            providesTags: ['CompanyRoles']
        }),


        //! GET company roles  by id
        getCompanyRolesById: builder.query(
            {
                query: (id) => (
                    {
                        url: `/company/company-roles/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyRoles']
            }),

        //! GET company roles by company
        getCompanyRolesByCompany: builder.query(
            {
                query: (id) => (
                    {
                        url: `company/company-roles/?company_name=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyRoles']
            }),

        //! DELETE users by id
        deleteCompanyRolesById: builder.mutation({
            query: (id) => {
                return {
                    url: `company/company-roles/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyRoles']
        }),

        //! POST users 
        createCompanyRole: builder.mutation({
            query: (createCompanyRoles) => {
                // 

                return {
                    url: "company/company-roles/",
                    method: 'POST',
                    body: createCompanyRoles,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyRoles']
        }),
        getLowerExecutivebyMyId: builder.mutation({
            query: (createCompanyRoles) => {
                // 

                return {
                    url: "user/get-all-lower-level-users-from-company-user-role-id/",
                    method: 'POST',
                    body: createCompanyRoles,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyRoles']
        }),

        //! Login User

        //! Update company roles data by id
        updateCompanyRoles: builder.mutation({
            query: (updateCompanyRoles) => {
                return {
                    url: `company/company-roles/${updateCompanyRoles.get('id')}/`,
                    method: 'PUT',
                    body: updateCompanyRoles
                }
            },
            invalidatesTags: ['CompanyRoles'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyRoles', id, (draft) => {
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
    useGetAllCompanyRolesQuery,
    useGetCompanyRolesByIdQuery,
    useGetCompanyRolesByCompanyQuery,
    useDeleteCompanyRolesByIdMutation,
    useCreateCompanyRoleMutation,
    useUpdateCompanyRolesMutation,
    useGetLowerExecutivebyMyIdMutation
} = CompanyRolesSlice

//! returns the query result object
export const selectCompanyRoleResult = CompanyRolesSlice.endpoints.getAllCompanyRoles.select()

//!Creates memoized selector
const selectCompanyRolesData = createSelector(
    selectCompanyRoleResult,
    companyRolesResult => companyRolesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyRoles,
    selectById: selectCompanyRolesById,
    // Pass in a selector that returns the posts slice of state
} = companyRolesAdapter.getSelectors(state => selectCompanyRolesData(state) ?? initialState)



