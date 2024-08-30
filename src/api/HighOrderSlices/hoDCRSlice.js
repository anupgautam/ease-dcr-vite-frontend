import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const hoDCRAdapter = createEntityAdapter();

const initialState = hoDCRAdapter.getInitialState();

export const HODCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all HODCRs
        getHODCRs: builder.query({
            query: (page) => ({
                url: `other-roles/higher-order-dcr-with-pagination/?company_id=${page.id}&page=${page.page}`,
                method: 'GET'
            }),
            providesTags: ['HODCR']
        }),


        //! Get all HODCRs By id
        getHODCRsById: builder.query({
            query: (id) => ({
                url: `other-roles/higher-order-dcr/${id}/`,
                method: 'GET'
            }),
            providesTags: ['HODCR']
        }),

        //! Get Higher Order DCR by Id query
        getHODCRHaruById: builder.query({
            query: (id) => ({
                url: `other-roles/higher-order-dcr/${id}`,
                method: 'GET'
            }),
            providesTags:['HODCR']
        }),
        
        //! Delete HODCRs by id
        deleteHODCRsById: builder.mutation({
            query: (id) => {

                return {
                    url: `other-roles/higher-order-dcr/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['HODCR']
        }),

        //! POST Tour Plan
        createHODCR: builder.mutation({
            query: (newDCR) => {
                newDCR.access = Cookies.get("access")
                newDCR.refresh = Cookies.get("refresh")

                return {
                    url: `other-roles/higher-order-dcr/`,
                    method: 'POST',
                    body: newDCR,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['HODCR', 'PostTourplan']
        }),

        //! Search MPO filter wala
        searchHODCR: builder.query({
            query: (FilteredData) => {
                // 
                const { user_id, month, date, company_name } = FilteredData;
                return {
                    url: `other-roles/higher-order-dcr-with-pagination/?user_id=${user_id}&month=${month}&date=${date}&company_id=${company_name}`,
                    method: 'GET',
                    // body: { ...FilteredData },
                }
            },
            providesTags: ['HODCR']
        }),

        //! Update HODCRs data by id
        updateHODCRs: builder.mutation({
            query: (updateDCR) => {
                return {
                    url: `other-roles/higher-order-dcr/${updateDCR['id']}/`,
                    method: 'PATCH',
                    body: updateDCR,
                }
            },
            invalidatesTags: ['HODCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getHODCRs', id, (draft) => {
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
    })
})

export const {
    useGetHODCRsByIdQuery,
    useGetHODCRsQuery,
    useGetHODCRHaruByIdQuery,
    useCreateHODCRsMutation,
    useUpdateHODCRsMutation,
    useDeleteHODCRsByIdMutation,
    useSearchHODCRQuery,
} = HODCRSlice

//! returns the query result object
export const selectHODCRsResult = HODCRSlice.endpoints.getHODCRs.select()

//!Creates memoized selector
const selectHODCRsData = createSelector(
    selectHODCRsResult,
    hoDCRResult => hoDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllHODCRs,
    selectById: selectHODCRsById,
    // Pass in a selector that returns the posts slice of state
} = hoDCRAdapter.getSelectors(state => selectHODCRsData(state) ?? initialState)



