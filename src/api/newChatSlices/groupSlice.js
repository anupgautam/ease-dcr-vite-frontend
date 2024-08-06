import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

// import { Jsonconfig } from "../../constant/header";
import { checkDataType } from "../../reusable/utils/checkDataType";

const groupAdapter = createEntityAdapter()

const groupURL = '/chat/group/'

const initialState = groupAdapter.getInitialState()

export const groupSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getGroups: builder.query({
            query: () => groupURL,
            transformResponse: responseData => {
                return groupAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) =>
                [
                    { type: 'Groups', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'Groups', id }))
                ]
        }),
        getGroupsById: builder.query({
            query: (id) => ({
                url: `${groupURL}${id}/`,
                method: 'GET',
            }),
            providesTags: ['Groups']
        }),
        addGroup: builder.mutation({
            query: (group) => {

                return {
                    url: groupURL,
                    method: 'POST',
                    body: group,
                }
            },
            transformResponse: responseData => {
                if (checkDataType(responseData) === "object") {
                    return responseData;
                }
                else if (checkDataType(responseData) === "array") {

                    return responseData[0];
                }
                else {
                    return responseData;
                }
            },
            invalidatesTags: ['Groups']
        }),
        getGroupList: builder.mutation({
            query: (group) => {
                return {
                    url: `/chat/user-group/`,
                    method: 'POST',
                    body: group,
                }
            }
        }),
        getGroupWsConnection: builder.mutation({
            query: (group) => {
                return {
                    url: `/chat/user-ws/`,
                    method: 'POST',
                    body: group,
                }
            }
        }),
        updateGroup: builder.mutation({

            query: (updateGroup) => {
                return {
                    url: `${groupURL}${updateGroup.get('id')}/`,
                    method: 'PATCH',
                    body: updateGroup
                }
            },
            invalidatesTags: ['Groups']
        }),
        deleteGroup: builder.mutation({
            query: (id) => {
                return {
                    url: `${groupURL}${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Groups']
        }),
    })
})

export const {
    useGetGroupsQuery,
    useAddGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
    useGetGroupsByIdQuery,
    useGetGroupListMutation,
    useGetGroupWsConnectionMutation,

} = groupSlice

// returns the query result object
export const selectGroupsResult = groupSlice.endpoints.getGroups.select()

// Creates memoized selector
const selectGroupssData = createSelector(
    selectGroupsResult,
    groupsResult => groupsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllGroups,
    selectById: selectGroupById,
    // Pass in a selector that returns the posts slice of state
} = groupAdapter.getSelectors(state => selectGroupssData(state) ?? initialState)
