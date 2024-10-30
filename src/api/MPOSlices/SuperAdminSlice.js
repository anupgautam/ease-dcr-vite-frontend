import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const superAdminAdapter = createEntityAdapter();

const initialState = superAdminAdapter.getInitialState();

export const SuperAdminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET All Company
        getAllCompany: builder.query({
            query: () => ({
                url: `company/company`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! GET All Company Users
        getAllCompanyUser: builder.query({
            query: () => ({
                url: `user/get-admin-list`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! GET All Roles
        getAllRole: builder.query({
            query: () => ({
                url: `company/roles`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! GET All Company Roles
        getAllCompanyRole: builder.query({
            query: ({ company_name }) => ({
                url: `company/company-roles/?company_name${company_name}`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! GET Company By id
        getCompanyById: builder.query({
            query: (id) => ({
                url: `company/company/${id}`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        // //! GET Company User By id
        getCompanyUserById: builder.query({
            query: (id) => ({
                url: `company/company-user/${id}`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! GET Company Roles By id
        getCompanyRoleById: builder.query({
            query: (id) => ({
                url: `company/company-roles/${id}`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! GET Roles By id
        getRoleById: builder.query({
            query: (id) => ({
                url: `company/roles/${id}`,
                method: 'GET'
            }),
            providesTags: ['SuperAdmin']
        }),

        //! POST company 
        createCompany: builder.mutation({
            query: (createCompany) => {
                return {
                    url: "company/company/",
                    method: 'POST',
                    body: createCompany,
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! POST Roles 
        createRoles: builder.mutation({
            query: (createRole) => {
                return {
                    url: "company/roles/",
                    method: 'POST',
                    body: createRole,
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! POST company Users
        createCompanyUser: builder.mutation({
            query: (createCompanyUser) => {
                return {
                    url: "user/company-user-role/create_role_user_and_company_user_role/",
                    method: 'POST',
                    body: createCompanyUser,
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),
        //! POST company Users
        createCompanyRole: builder.mutation({
            query: (createcompanyRole) => {
                console.log("Company Roles wala")
                return {
                    url: "company/company-roles/",
                    method: 'POST',
                    body: createcompanyRole,
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! Company Roles filter
        filterCompanyRoles: builder.mutation({
            query: (FilteredData) => {
                const { selectedOption } = FilteredData;
                return {
                    url: `company/company-roles/?company_name${selectedOption}`,
                    // url: `expenses/mpo-leave-application/?mpo_name=${selectedOption}&application_id__company_name=${companyId}&application_id__submission_date=${dateData}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! DELETE Company By Id
        deleteCompanyById: builder.mutation({
            query: (id) => {
                return {
                    url: `company/company/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! DELETE Company User  By Id
        deleteCompanyUserById: builder.mutation({
            query: (id) => {
                return {
                    url: `company/company-user/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! Update Company
        updateCompany: builder.mutation({
            query: (updatecompany) => {
                return {
                    url: `company/company/${updatecompany.id}/`,
                    method: 'PATCH',
                    body: updatecompany
                };
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! Update Roles
        updateRoles: builder.mutation({
            query: (updateRoles) => {
                return {
                    url: `company/roles/${updateRoles.id}/`,
                    method: 'PATCH',
                    body: updateRoles
                };
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! Update Company User
        updateCompanyUser: builder.mutation({
            query: (updateCompanyUser) => {
                return {
                    url: `company/company-user/${updateCompanyUser.id}/`,
                    method: 'PATCH',
                    body: updateCompanyUser
                };
            },
            invalidatesTags: ['SuperAdmin']
        }),

        //! Update Company User
        updateCompanyRole: builder.mutation({
            query: (updateCompanyRole) => {
                return {
                    url: `company/company-roles/${updateCompanyRole.id}/`,
                    method: 'PATCH',
                    body: updateCompanyRole
                };
            },
            invalidatesTags: ['SuperAdmin']
        }),

    })
})

//! Api hooks
export const
    {
        useGetAllCompanyQuery,
        useGetCompanyByIdQuery,
        useCreateCompanyMutation,
        useDeleteCompanyByIdMutation,
        useUpdateCompanyMutation,

        useGetAllCompanyUserQuery,
        useGetCompanyUserByIdQuery,
        useDeleteCompanyUserByIdMutation,
        useUpdateCompanyUserMutation,
        useCreateCompanyUserMutation,

        useGetAllRoleQuery,
        useGetRoleByIdQuery,
        useCreateRolesMutation,
        useUpdateRolesMutation,

        useGetAllCompanyRoleQuery,
        useGetCompanyRoleByIdQuery,
        useCreateCompanyRoleMutation,
        useUpdateCompanyRoleMutation,
        useFilterCompanyRolesMutation,
    } = SuperAdminSlice

//! returns the query result object
export const selectCompanyRolesResult = SuperAdminSlice.endpoints.getAllCompanyRoles.select()

//!Creates memoized selector
const selectCompanyRolesData = createSelector(
    selectCompanyRolesResult,
    CompanyRoleResult => CompanyRoleResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyRoles,
    selectById: selectCompanyRolesById,
    // Pass in a selector that returns the posts slice of state
} = superAdminAdapter.getSelectors(state => selectCompanyRolesData(state) ?? initialState)