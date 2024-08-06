import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const statAdapter = createEntityAdapter();

const initialState = statAdapter.getInitialState();

export const StatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! POST chemist 
        getAllStats: builder.mutation({
            query: (newStat) => {
                // newStat.company_id = Cookies.get("company_id")
                return {
                    url: `stat/get-stat/`,
                    method: 'POST',
                    body: newStat,
                }
            },
            invalidatesTags: ['Stat']
        }),

    })
})

export const {
    useGetAllStatsMutation,
} = StatApiSlice

//! returns the query result object
export const selectStatsResult = StatApiSlice.endpoints.getAllStats.select()

//!Creates memoized selector
const selectStatsData = createSelector(
    selectStatsResult,
    statResult => statResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStats,
    selectById: selectStatsById,
    // Pass in a selector that returns the posts slice of state
} = statAdapter.getSelectors(state => selectStatsData(state) ?? initialState)



