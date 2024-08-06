import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";


const noticeAdapter = createEntityAdapter();

const initialState = noticeAdapter.getInitialState();


export const noticeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the Notices
        getAllNotices: builder.query({
            query: () => ({
                url: 'notice/',
                method: 'GET'
            }),
            providesTags: ['Notice']
        }),

        //! GET Notices by id
        getNoticesById: builder.query({
            query: (id) => ({
                url: `product/product/${id}`,
                method: 'GET'
            }),
            providesTags: ['Notice']
        }),

        //! DELETE Notices by id
        deleteNoticesById: builder.mutation({
            query: ({ id }) => ({
                url: `notice/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Notice']
        }),

        //! POST Notices 
        createNotices: builder.mutation({
            query: (newNotice) => {
                return {
                    url: `product/product/`,
                    method: 'POST',
                    body: newNotice,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Notice']
        }),

        //! Update Notices data by id
        updateNotices: builder.mutation({
            query: (updateNotice) => {
                const { id, ...data } = updateNotice;

                return {
                    url: `product/product/${id}`,
                    method: 'PUT',
                    body: data,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Notice']
        })
    })
})

//! Api hooks
export const {
    useGetAllNoticesQuery,
    useGetNoticesByIdQuery,
    useDeleteNoticesByIdMutation,
    useCreateNoticesMutation,
    useUpdateNoticesMutation
} = noticeApiSlice


export const {
    useCreateNoticeMutation
} = noticeApiSlice


export const selectNoticesResult = noticeApiSlice.endpoints.getAllNotices.select()

// Creates memoized selector
const selectNoticessData = createSelector(
    selectNoticesResult,
    NoticesResult => NoticesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotices,
    selectById: selectNoticeById,
    selectIds: selectIds
    // Pass in a selector that returns the posts slice of state
} = noticeAdapter.getSelectors(state => selectNoticessData(state) ?? initialState)