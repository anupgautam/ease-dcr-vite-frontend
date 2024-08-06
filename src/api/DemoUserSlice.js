import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "./apiSlice";

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState();

export const DemoUserSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET all the users
        getAllUsers: builder.query({
            query: () => ({
                url: `user/company-user-role/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),

        //! GET all the users
        getUsersMPOWala: builder.query({
            query: () => ({
                url: `user/company-user-role/`,
                method: 'GET'
            }),
            providesTags: ['User']
        }),

        //! GET User role 
        getUsersRole: builder.query({
            query: () => ({
                url: `company/company-roles/`,
                method: 'GET'
            }),
            providesTags: ['User']
        }),

        //! GET users by id
        getUsersById: builder.query(
            {
                query: (id) => (
                    {
                        url: `user/company-user-role/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['User']
            }),

        //!GET users by company role
        getUsersByCompanyRoleId: builder.query(
            {
                query: (id) => (
                    {
                        url: `user/company-user-role-without-pagination/?role_name=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['User']
            }),

        //! DELETE users by id
        deleteUsersById: builder.mutation({
            query: (id) => {
                return {
                    url: `user/company-user-role/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['User']
        }),

        //! POST users 
        createUsers: builder.mutation({
            query: (createUsers) => {
                // 
                createUsers.company_id = Cookies.get("company_id")
                return {
                    url: "user/company-user-role/create_role_user_and_company_user_role/",
                    method: 'POST',
                    body: createUsers,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['User']
        }),

        //! Login User
        loginUser: builder.mutation({
            query: (loginInfo) => {
                // 
                return {
                    url: '/account/user-login/',
                    method: 'POST',
                    body: loginInfo
                }
            },
            invalidatesTags: ['User']
        }),


        //! Search User wala post
        searchUsers: builder.mutation({
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
            invalidatesTags: ['User']
        }),

        //! Update users data by id
        updateUsers: builder.mutation({
            query: (updateUser) => {
                return {
                    url: `user/company-user-role/${updateUser.get('id')}/update_data/`,
                    method: 'PUT',
                    body: updateUser
                }
            },
            invalidatesTags: ['User'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllUsers', id, (draft) => {
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
    useGetAllUsersQuery,
    useGetUsersMPOWalaQuery,
    useGetUsersByIdQuery,
    useGetUsersRoleQuery,
    useDeleteUsersByIdMutation,
    useCreateUsersMutation,
    useLoginUserMutation,
    useUpdateUsersMutation,
    useSearchUsersMutation,
    useGetUsersByCompanyRoleIdQuery
} = DemoUserSlice

//! returns the query result object
export const selectUsersResult = DemoUserSlice.endpoints.getAllUsers.select()

//!Creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUsersById,
    // Pass in a selector that returns the posts slice of state
} = userAdapter.getSelectors(state => selectUsersData(state) ?? initialState)



