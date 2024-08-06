import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const adminAPI = '/all-users/admin/';

const adminAdapter = createEntityAdapter();

const initialState = adminAdapter.getInitialState();

export const adminSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAdmins: builder.query({
            query: () => adminAPI,
            transformResponse: responseData => {
                return adminAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) =>
                [
                    { type: 'Admins', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'Admins', id }))
                ]
        }),
        addAdmin: builder.mutation({
            query: (admin) => {
                return {
                    url: adminAPI,
                    method: 'POST',
                    body: admin,
                }
            },
            invalidatesTags: ['Admins']
        }),
        updateAdmin: builder.mutation({

            query: (updateAdmin) => {

                return {

                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',

                    },
                    url: `${adminAPI}${updateAdmin['data']['id']}/`,
                    method: 'PATCH',
                    body: updateAdmin['data']
                }
            },
            invalidatesTags: ['Admins'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAdmins', id, (draft) => {
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
        deleteAdmin: builder.mutation({
            query: (id) => {

                return {
                    url: `${adminAPI}${id.id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Admins']
        }),
    })
})

export const {
    useGetAdminsQuery,
    useAddAdminMutation,
    useUpdateAdminMutation,
    useDeleteAdminMutation,
} = adminSlice

// returns the query result object
export const selectAdminsResult = adminSlice.endpoints.getAdmins.select()

// Creates memoized selector
const selectAdminssData = createSelector(
    selectAdminsResult,
    adminsResult => adminsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAdmins,
    selectById: selectAdminById,
    // Pass in a selector that returns the posts slice of state
} = adminAdapter.getSelectors(state => selectAdminssData(state) ?? initialState)



