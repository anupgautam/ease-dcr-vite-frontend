import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const userApiAdapter = createEntityAdapter();

const initialState = userApiAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the users
        getAllUsers: builder.query({
            query: (page) => ({
                url: `user/company-user-role/?page=${page}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),
        getAllUsersWithoutPagination: builder.query({
            query: (id) => ({
                url: `user/company-user-without-pagination/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),
        getAllUsersWithoutPaginationById: builder.query({
            query: (id) => ({
                url: `user/company-user-without-pagination/${id}/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),
        //! GET all the users
        getUsersMPOWala: builder.query({
            query: (id) => ({
                url: `user/company-user-role/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),

        //! Day Status 
        getAllDayStatus: builder.query({
            query: () => ({
                url: `day/status`,
                method: 'GET'
            }),
            providesTags: ['User']
        }),

        //! GET User role 
        getUsersRole: builder.query({
            query: (id) => ({
                url: `company/company-roles/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),

        //! Get users by company roles with pagination
        getUsersByCompanyRoleWithOutPage: builder.query({
            query: (id) => ({
                url: `chat/chat/get_user/?search=${id.search}&company_name=${id.company_name}&user_id=${id.user_id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
        }),

        getUsersByHigherLevelUser: builder.query({
            query: (id) => ({
                url: `user/company-user-role-without-pagination/?executive_level=${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'User'
                ]
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

        //! GET userprofile by id
        getUserProfileById: builder.query(
            {
                query: (id) => (
                    {
                        url: `user/user-profile-picture/${id}`,
                        method: 'GET'
                    }),
                providesTags: ['User']
            }),

        //! PATCH userprofile by id
        updateUserProfileById: builder.mutation({
            query: (updateProfilePic) => (
                {
                    url: `user/user-profile-picture/${updateProfilePic.get('id')}`,
                    method: 'PATCH',
                    body: updateProfilePic
                }),
            invalidateTags: ['User']
        }),

        //!GET users by company role
        getUsersByCompanyRoleIdExecutativeLevel: builder.query(
            {
                query: (id) => (
                    {
                        // url: `user/company-user-role-without-pagination/?company_name__company_id=${id.id}&executive_level=${id.page}&user_name__is_active=true`,
                        url: `user/get-all-lower-level-users-from-company-user-role-id/?company_name__company_id=${id.id}&executive_level=${id.page}&is_active=true`,
                        method: 'GET'
                    }),
                providesTags: ['User']
            }),
        getUsersByCompanyRoleId: builder.query(
            {
                query: (id) => (
                    {
                        url: `user/company-user-role-without-pagination/?company_name=${id.id}&role_name=${id.page}&is_active=true`,
                        method: 'GET'
                    }),
                providesTags: ['User']
            }),

        getUsersByCompanyUserById: builder.query(
            {
                query: (id) => (
                    {
                        url: `user/company-user-role-without-pagination/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['User']
            }),

        // ! Get Executive Level
        getAllExecutiveLevels: builder.query({
            query: (id) => (
                {
                    url: `user/company-user-without-pagination/?company_name=${id}`,
                    method: 'GET',
                }),
            providesTags: ['CompanyUserRoles', 'User', "CompanyUsers"],
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
        //! Post to Get Lower Level Executive Level 
        postUserIdToGetLowerLevelExecutive: builder.mutation({
            query: (value) => {
                return {
                    url: 'user/get-all-lower-level-users-from-company-user-role-id/',
                    method: 'POST',
                    body: value,
                }
            },
            invalidatesTags: ['User'],
        }),
        //! POST users 
        createUsers: builder.mutation({
            query: (createUsers) => {
                return {
                    url: "user/company-user-role/create_role_user_and_company_user_role/",
                    method: 'POST',
                    body: createUsers,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['CompanyUserRoles', 'User', "CompanyUsers"],
        }),

        //! POST users 
        unlockUsers: builder.mutation({
            query: (unlockUsers) => {
                return {
                    url: `user/company-user-role/${unlockUsers.id}/`,
                    method: 'PATCH',
                    body: unlockUsers,
                }
            },
            invalidatesTags: ['CompanyUserRoles'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userApiSlice.endpoints.getAllExecutiveLevels.initiate(arg.company_id));
                } catch (error) {
                    console.error("Error creating user:", error);
                }
            },
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
        //admin user login query
        loginUserByAdmin: builder.mutation({
            query: (loginInfo) => {
                // 
                return {
                    url: '/account/user-login-by-id/',
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
                    url: `user/company-user-role/${updateUser.id}/`,
                    method: 'PATCH',
                    body: updateUser.data
                }
            },
            invalidatesTags: ['CompanyUserRoles'],
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
                }
            },
        }),
    })
})

export const {
    useGetAllUsersQuery,
    useGetUsersMPOWalaQuery,
    useGetUsersByCompanyRoleWithOutPageQuery,
    useGetUsersByIdQuery,
    useGetUsersRoleQuery,
    useDeleteUsersByIdMutation,
    useCreateUsersMutation,
    useLoginUserMutation,
    useUpdateUsersMutation,
    useUnlockUsersMutation,
    useSearchUsersMutation,
    useGetUsersByCompanyRoleIdQuery,
    useGetAllUsersWithoutPaginationQuery,
    useGetUsersByCompanyRoleIdExecutativeLevelQuery,
    useGetUsersByHigherLevelUserQuery,
    useGetUsersByCompanyUserByIdQuery,
    useLoginUserByAdminMutation,
    usePostUserIdToGetLowerLevelExecutiveMutation,
    useGetAllUsersWithoutPaginationByIdQuery,
    // useGetAllExecutiveLevelsQuery,
    useGetUserProfileByIdQuery,
    useUpdateUserProfileByIdMutation,
    useGetAllDayStatusQuery,
    useGetAllExecutiveLevelsQuery,
} = userApiSlice


export const selectUserApisResult = userApiSlice.endpoints.getAllUsers.select()

// Creates memoized selector
const selectUserApissData = createSelector(
    selectUserApisResult,
    UserApisResult => UserApisResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUserApis,
    selectById: selectUserApiById,
    // Pass in a selector that returns the posts slice of state
} = userApiAdapter.getSelectors(state => selectUserApissData(state) ?? initialState)






