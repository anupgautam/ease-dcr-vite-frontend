import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyUserAdapter = createEntityAdapter();

const initialState = companyUserAdapter.getInitialState();

export const CompanyUserSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the users
        getAllCompanyUsers: builder.query({
            query: (page) => ({
                url: `/user/company-user/?page=${page}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUsers'
                ]
        }),
        getAllCompanyUsersWithoutPagination: builder.query({
            query: () => ({
                url: `/user/company-user/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyUsers'
                ]
        }),


        //! GET users by id
        getCompanyUsersById: builder.query(
            {
                query: (id) => (
                    {
                        url: `/user/company-user/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyUsers']
            }),

        //! DELETE users by id
        deleteCompanyUsersById: builder.mutation({
            query: (id) => {
                return {
                    url: `/user/company-user/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyUsers']
        }),

        //! POST users 
        createCompanyRole: builder.mutation({
            query: (createCompanyUsers) => {
                // 

                return {
                    url: "/user/company-user/",
                    method: 'POST',
                    body: createCompanyUsers,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyUsers']
        }),

        //! Login User
        //! Update company roles data by id
        updateCompanyUsers: builder.mutation({
            query: (updateCompanyUsers) => {
                return {
                    url: `/user/company-user/${updateCompanyUsers.get('id')}/`,
                    method: 'PUT',
                    body: updateCompanyUsers
                }
            },
            invalidatesTags: ['CompanyUsers'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyUsers', id, (draft) => {
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

        //! Update company roles data by id
        getHigherUserList: builder.mutation({
            query: (companyRoleId) => {
                return {
                    url: `/user/get-upper-level-user-from-company-role/`,
                    method: 'POST',
                    body: companyRoleId
                }
            },
            invalidatesTags: ['CompanyUsers'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyUsers', id, (draft) => {
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

        getAllLowerLevelUsers: builder.mutation({
            query: (id) => ({
                url: `/user/get-all-lower-level-users-from-company-user-role-id/`,
                method: 'POST',
                body: id
            }),
            providesTags: ['CompanyUsers']
        }),

        getAllExecutiveLevels: builder.mutation({
            query: (id) => (
                {
                    url: `user/company-user-without-pagination/?company_name=${id}`,
                    method: 'GET',
                }),
            invalidatesTags: ['CompanyUsers'],
            providesTags: ['Users']
        }),
        getAllUserAttendance: builder.query({
            query: (id) => ({
                url: `user/company-user-attendance/?company_name=${id.company_name}&user_id=${id.user_id}&attendance_date=${id.date}&month=${id.month}`,
                method: 'get',
            }),
            providesTags: ['CompanyUsers']
        }),
        postingAllUserAttendance: builder.mutation({
            query: (id) => ({
                url: '/expenses/get-user-attendance/',
                method: "POST",
                body: id,
            }),
            providesTags: ['CompanyUsers']
        })
    })
})

export const {
    useGetAllCompanyUsersQuery,
    useGetCompanyUsersByIdQuery,
    useDeleteCompanyUsersByIdMutation,
    useCreateCompanyRoleMutation,
    useUpdateCompanyUsersMutation,
    useGetHigherUserListMutation,
    useGetAllLowerLevelUsersMutation,
    useGetAllExecutiveLevelsMutation,
    useGetAllCompanyUsersWithoutPaginationQuery,
    useGetAllUserAttendanceQuery,
    usePostingAllUserAttendanceMutation,
} = CompanyUserSlice

//! returns the query result object
export const selectCompanyUserResult = CompanyUserSlice.endpoints.getAllCompanyUsers.select()

//!Creates memoized selector
const selectCompanyUserData = createSelector(
    selectCompanyUserResult,
    companyUserResult => companyUserResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyUser,
    selectById: selectCompanyUserById,
    // Pass in a selector that returns the posts slice of state
} = companyUserAdapter.getSelectors(state => selectCompanyUserData(state) ?? initialState)



