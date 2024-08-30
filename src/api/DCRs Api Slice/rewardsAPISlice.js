import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const rewardDCRAdapter = createEntityAdapter();

const initialState = rewardDCRAdapter.getInitialState();

export const RewardsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //! GET all the users
        getAllRewards: builder.query({
            query: (id) => ({
                url: `/dcr/rewards/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['Rewards']
        }),
        getAllRewardsByCompanyId: builder.query({
            query: (id) => ({
                url: `/dcr/rewards/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['Rewards']
        }),
        //! GET users by id
        getRewardsById: builder.query(
            {
                query: (id) => (
                    {
                        url: `/dcr/rewards/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['Rewards']
            }),
        getRewardsByDcrId: builder.query(
            {
                query: (id) => (
                    {
                        url: `/dcr/dcr-for-doctor-rewards-map/?dcr_id=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['Rewards']
            }),
        getRewardsForChemistByDcrId: builder.query(
            {
                query: (id) => (
                    {
                        url: `/dcr/dcr-for-chemist-rewards-map/?dcr_id=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['Rewards']
            }),
        getRewardsForStockistByDcrId: builder.query(
            {
                query: (id) => (
                    {
                        url: `/dcr/dcr-for-stockist-rewards-map/?dcr_id=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['Rewards']
            }),

        getRewardsForHigherOrderByDcrId: builder.query(
            {
                query: (id) => (
                    {
                        url: `/dcr/dcr-for-ho-rewards-map/?dcr_id=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['Rewards']
            }),

        //! DELETE users by id
        deleteRewardById: builder.mutation({
            query: (id) => {
                return {
                    url: `/dcr/rewards/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Rewards']
        }),

        //! POST users 
        createRewards: builder.mutation({
            query: (createRewards) => {
                // 

                return {
                    url: "/dcr/rewards/",
                    method: 'POST',
                    body: createRewards,
                }
            },
            invalidatesTags: ['Rewards']
        }),

        //! Login User


        //! Update users data by id
        updateRewards: builder.mutation({
            query: (updateRewards) => {

                return {
                    url: `/dcr/rewards/${updateRewards.get('id')}/`,
                    method: 'PUT',
                    body: updateRewards
                };
            },
            invalidatesTags: ['Rewards']
        }),
        postRewardForDcr: builder.mutation({
            query: (data) => {

                return {
                    url: `/dcr/dcr-for-doctor-rewards-map/`,
                    method: 'POST',
                    body: data
                };
            },
            invalidatesTags: ['Rewards']
        }),
    })
})

//! Api hooks
export const {
    useGetAllRewardsQuery,
    useGetRewardsByIdQuery,
    useDeleteRewardByIdMutation,
    useCreateRewardsMutation,
    useUpdateRewardsMutation,
    useGetRewardsByDcrIdQuery,
    usePostRewardForDcrMutation,

    useGetAllRewardsByCompanyIdQuery,
    useGetRewardsForChemistByDcrIdQuery,
    useGetRewardsForStockistByDcrIdQuery,
    useGetRewardsForHigherOrderByDcrIdQuery,
} = RewardsApiSlice;

//! returns the query result object
export const selectRewardsDCRResult = RewardsApiSlice.endpoints.getAllRewards.select()

//!Creates memoized selector
const selectRewardsDCRData = createSelector(
    selectRewardsDCRResult,
    RewardDCRResult => RewardDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllRewardsDCR,
    selectById: selectRewardsDCRById,
    // Pass in a selector that returns the posts slice of state
} = rewardDCRAdapter.getSelectors(state => selectRewardsDCRData(state) ?? initialState)
