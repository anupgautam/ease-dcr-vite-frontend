import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const statAdapter = createEntityAdapter();

const initialState = statAdapter.getInitialState();

export const StatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get STats 
        getAllStats: builder.query({
            query: (newStat) => {
                return {
                    url: `stat/get-stat/?company_name=${newStat.company_id}&month=${newStat.month}&year=${newStat.year}`,
                    method: 'GET',
                }
            },
            providesTags: ['Stat']
        }),

    })
})

export const {
    useGetAllStatsQuery,
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



