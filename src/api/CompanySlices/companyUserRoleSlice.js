import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyUserRoleAdapter = createEntityAdapter();

const initialState = companyUserRoleAdapter.getInitialState();

export const CompanyUserRoleSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the users
        getAllcompanyUserRoles: builder.query({
            query: (page) => ({
                url: `/user/company-user-role/?company_name__company_id=${page.company_name}&page=${page.page}&user_name__is_active=${page.is_active}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUserRoles'
                ]
        }),

        //! GET all the users
        getAllDefaultUsers: builder.query({
            query: (page) => ({
                url: `user/company-user-role-without-pagination/?company_name=${page.company_name}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUserRoles'
                ]
        }),

        getAllcompanyUserRolesWithoutPagination: builder.query({
            query: (id) => ({
                url: `/user/company-user-role-without-pagination/?company_name=${id.id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUserRoles'
                ]
        }),

        getCompanyUserByUserRole: builder.query({
            query: (id) => ({
                url: `/user/company-user-role-without-pagination/?company_name=${id.company_name}&role_name=${id.role_name}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUserRoles'
                ]
        }),

        getAllCompanyUserRoleByRole: builder.query({
            query: (id) => ({
                url: `/user/company-user-role-without-pagination/?role_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUserRoles'
                ]
        }),

        getAllCompanyUserRoleByRoleName: builder.query({
            query: (id) => ({
                url: `/user/company-user-role-without-pagination/?role_name__role_name__role_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUserRoles'
                ]
        }),


        //! GET users by id
        getcompanyUserRolesById: builder.query(
            {
                query: (id) => (
                    {
                        url: `/user/company-user-role/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyUserRoles', 'PostTourplan']
            }),

        //! DELETE users by id
        deletecompanyUserRolesById: builder.mutation({
            query: (id) => {
                return {
                    url: `/user/company-user-role/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyUserRoles', 'TourPlan']
        }),

        getUpperCompanyRoles: builder.mutation({
            query: (id) => {
                return {
                    url: `/user/get-all-upper-level-user-from-company-user-role/`,
                    method: 'POST',
                    body: id,
                }
            },
            invalidatesTags: ['CompanyUserRoles']

        }),
        postHigherLevelExecutiveGetData: builder.mutation({
            query: (id) => {
                return {
                    url: `/user/get-all-upper-level-user-from-company-user-role/`,
                    method: 'POST',
                    body: id,
                }
            },
            invalidatesTags: ['CompanyUserRoles']

        }),

        //! POST users 
        createCompanyRole: builder.mutation({
            query: (createcompanyUserRoles) => {
                // 

                return {
                    url: "/user/company-user-role/",
                    method: 'POST',
                    body: createcompanyUserRoles,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyUserRoles']
        }),

        //! Login User

        //! Search User wala post
        searchCompanyUserRoles: builder.mutation({
            query: (searchUser) => {
                return {
                    url: 'user/company-user-role/search_user/',
                    method: 'POST',
                    body: searchUser,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['CompanyUserRoles']
        }),

        //! Update company roles data by id
        updatecompanyUserRoles: builder.mutation({
            query: (updatecompanyUserRoles) => {
                return {
                    url: `/user/company-user-role/${updatecompanyUserRoles.get('id')}/update_data/`,
                    method: 'PATCH',
                    body: updatecompanyUserRoles
                }
            },
            invalidatesTags: ['CompanyUserRoles'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllcompanyUserRoles', id, (draft) => {
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
    useGetAllcompanyUserRolesQuery,
    useGetcompanyUserRolesByIdQuery,
    useGetAllCompanyUserRoleByRoleNameQuery,
    useGetUpperCompanyRolesMutation,
    useDeletecompanyUserRolesByIdMutation,
    useCreateCompanyRoleMutation,
    useUpdatecompanyUserRolesMutation,
    useSearchCompanyUserRolesMutation,
    useGetAllcompanyUserRolesWithoutPaginationQuery,
    useGetAllCompanyUserRoleByRoleQuery,
    useGetCompanyUserByUserRoleQuery,
    usePostHigherLevelExecutiveGetDataMutation,
    useGetAllDefaultUsersQuery,
} = CompanyUserRoleSlice

//! returns the query result object
export const selectCompanyUserRoleResult = CompanyUserRoleSlice.endpoints.getAllcompanyUserRoles.select()

//!Creates memoized selector
const selectCompanyUserRoleData = createSelector(
    selectCompanyUserRoleResult,
    companyUserRolesResult => companyUserRolesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyUserRoles,
    selectById: selectCompanyUserRolesById,
    // Pass in a selector that returns the posts slice of state
} = companyUserRoleAdapter.getSelectors(state => selectCompanyUserRoleData(state) ?? initialState)



