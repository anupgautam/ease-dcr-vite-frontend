import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const leaveSlice = createEntityAdapter();

const initialState = leaveSlice.getInitialState();

export const LeaveSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Leaves
        getLeaves: builder.query({
            query: (UserRole) => (
                {
                    url: `expenses/get-leave-user${UserRole}`,
                    method: 'GET',
                    body: UserRole
                }
            ),
            providesTags: ['Leave']
        }),

        //! Get leaves by id 
        getLeavesById: builder.query({
            query: (id) => ({
                url: `expenses/get-leave-user/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Leave']
        }),


        //! Search MPO filter wala
        searchLeave: builder.mutation({
            query: (FilteredData) => {
                return {
                    url: `expenses/get-leave-user/`,
                    body: FilteredData,
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    },
                }
            },
            invalidatesTags: ['Leave']
        }),

    })
})

export const {
    useGetLeavesQuery,
    useGetLeavesByIdQuery,
    useSearchLeaveMutation,
} = LeaveSlices

//! returns the query result object
export const selectLeavesResult = LeaveSlices.endpoints.getLeaves.select()

//!Creates memoized selector
const selectLeavesData = createSelector(
    selectLeavesResult,
    leaveResult => leaveResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllLeaves,
    // selectById: selectLeavesById,
    // Pass in a selector that returns the posts slice of state
} = leaveSlice.getSelectors(state => selectLeavesData(state) ?? initialState)



