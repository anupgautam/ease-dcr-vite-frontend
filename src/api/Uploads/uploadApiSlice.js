import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const uploadSlice = createEntityAdapter();

const initialState = uploadSlice.getInitialState();

export const UploadSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all Upload
        getUpload: builder.query({
            query: (page) => ({
                url: `expenses/uploads/?company_name=${page.id}&page=${page.page}`,
                method: 'GET'
            }),
            providesTags: ['Upload']
        }),

        //! Get all Upload By id
        getUploadById: builder.query({
            query: (id) => ({
                url: `expenses/uploads/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Upload']
        }),

        //! Delete Upload by id
        deleteUploadById: builder.mutation({
            query: (id) => {

                return {
                    url: `expenses/uploads/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Upload']
        }),

        postUploadData: builder.mutation({
            query: (id) => {

                return {
                    url: `expenses/uploads/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Upload']
        }),


        //! Search upload  post
        searchUpload: builder.mutation({
            query: (searchUploads) => {
                return {
                    url: `expenses/uploads/search_uploads/`,
                    method: 'POST',
                    body: searchUploads,
                    // body: { ...searchUploads, company_id },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['Upload']
        }),

    })
})

export const {
    useGetUploadQuery,
    useGetUploadByIdQuery,
    useDeleteUploadByIdMutation,
    useSearchUploadMutation,
    usePostUploadDataMutation,
} = UploadSlice

//! returns the query result object
export const selectUploadResult = UploadSlice.endpoints.getUpload.select()

//!Creates memoized selector
const selectUploadData = createSelector(
    selectUploadResult,
    uploadResult => uploadResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUpload,
    selectById: selectUploadById,
    // Pass in a selector that returns the posts slice of state
} = uploadSlice.getSelectors(state => selectUploadData(state) ?? initialState)



