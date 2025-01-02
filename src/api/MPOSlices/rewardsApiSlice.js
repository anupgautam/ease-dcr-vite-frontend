import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const rewardsAdapter = createEntityAdapter();

const initialState = rewardsAdapter.getInitialState();

export const RewardsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET all the rewards
        getAllRewards: builder.query({
            query: (id) => ({
                url: `dcr/rewards/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['Reward']
        }),

        //! GET rewards by id
        getRewardsById: builder.query({
            query: (id) => ({
                url: `dcr/rewards/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Reward']
        }),

        //! DELETE rewards by id
        deleteRewardsById: builder.mutation({
            query: (id) => ({
                url: `dcr/rewards/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Reward']
        }),

        //! POST rewards 
        createRewards: builder.mutation({
            query: (newReward) => {
                return {
                    url: `dcr/rewards/`,
                    method: 'POST',
                    body: newReward,
                }
            },
            invalidatesTags: ['Reward']
        }),

        //! Update rewards data by id
        updateRewards: builder.mutation({
            query: (updateReward) => {
                return {
                    url: `dcr/rewards/${updateReward.id}/`,
                    method: 'PUT',
                    body: updateReward
                }
            },
            invalidatesTags: ['Reward'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllRewards', id, (draft) => {
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
    useGetAllRewardsQuery,
    useGetRewardsByIdQuery,
    useDeleteRewardsByIdMutation,
    useCreateRewardsMutation,
    useUpdateRewardsMutation,
} = RewardsApiSlice

//! returns the query result object
export const selectRewardsResult = RewardsApiSlice.endpoints.getAllRewards.select()

//!Creates memoized selector
const selectRewardsData = createSelector(
    selectRewardsResult,
    rewardsResult => rewardsResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllRewards,
    selectById: selectRewardById,
    // Pass in a selector that returns the posts slice of state
} = rewardsAdapter.getSelectors(state => selectRewardsData(state) ?? initialState)



