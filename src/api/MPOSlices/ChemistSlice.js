import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const chemistAdapter = createEntityAdapter();

const initialState = chemistAdapter.getInitialState();

export const ChemistSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the chemist
        getAllChemists: builder.query({
            query: (page) => ({
                url: `chemist/company-wise-chemist/?company_name=${page.id}&page=${page.page}&mpo_name=${page.mpo_name}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist by id
        getChemistsById: builder.query({
            query: (id) => ({
                url: `chemist/company-wise-chemist/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! Get all chemist without pagination
        getAllChemistsWithoutPagination: builder.query({
            query: (page) =>
            ({
                url: `chemist/company-wise-chemist-with-out-pagination/?company_name=${page.company_name}&chemist_name__chemist_territory=${page.company_area}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist by id
        getChemistsWithoutPagination: builder.query({
            query: (id) => ({
                url: `chemist/company-wise-chemist-with-out-pagination/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),


        //! GET chemist category
        getChemistsCategory: builder.query({
            query: () => ({
                url: `chemist/company-wise-chemist-category/`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist category id
        getChemistsCategoryById: builder.query({
            query: (id) => ({
                url: `chemist/company-category-wise-chemist/?chemist_name__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        getChemistsByMpoAreaAndId: builder.query({
            query: (id) =>
            ({
                url: `chemist/company-wise-chemist/?company_name=${id.company_name}&chemist_name__chemist_territory=${id.mpo_area}&mpo_name=${id.mpo_name}&page=${id.page}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist area
        getChemistsArea: builder.query({
            query: (id) => ({
                url: `chemist/company-wise-chemist-working-area/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist area id
        getChemistsAreaById: builder.query({
            query: (id) => ({
                url: `chemist/company-area-wise-chemist/?chemist_name__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),


        //! DELETE chemist by id
        deleteChemistsById: builder.mutation({
            query: (id) => {
                return {
                    url: `chemist/company-wise-chemist/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Chemist']
        }),

        //! DELETE chemist category by id
        deleteChemistsCategoryById: builder.mutation({
            query: (id) => {
                return {
                    url: `chemist/company-wise-chemist-category/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Chemist']
        }),

        //! POST chemist 
        createChemists: builder.mutation({
            query: (newChemist) => {
                newChemist.company_id = Cookies.get("company_id")
                return {
                    url: `chemist/chemist/`,
                    method: 'POST',
                    body: newChemist,
                }
            },
            invalidatesTags: ['Chemist']
        }),

        //! POST chemist category
        createChemistsCategory: builder.mutation({
            query: (newChemist) => {
                newChemist.company_id = Cookies.get("company_id")
                return {
                    url: `chemist/company-wise-chemist-category/`,
                    method: 'POST',
                    body: newChemist,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['Chemist']
        }),

        //! Search Chemist wala post
        searchChemists: builder.mutation({
            query: (searchChemist) => {
                // 
                return {
                    url: `chemist/company-wise-chemist/search_chemist/`,
                    method: 'POST',
                    body: searchChemist,
                    // body: { ...searchChemist, company_id },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['Chemist']
        }),

        //! Update chemist data by id
        updateChemists: builder.mutation({
            query: (updateChemist) => {
                return {
                    url: `chemist/chemist/${updateChemist.get('id')}/`,
                    method: 'PATCH',
                    body: updateChemist
                }
            },
            invalidatesTags: ['Chemist'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllChemists', id, (draft) => {
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

        //! Update chemist category by id
        updateChemistsCategory: builder.mutation({
            query: (updateChemistCategory) => {
                return {
                    url: `chemist/company-wise-chemist-category/${updateChemistCategory.get('id')}/`,
                    method: 'PUT',
                    body: updateChemistCategory
                }
            },
            invalidatesTags: ['Chemist'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllChemists', id, (draft) => {
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
    useGetAllChemistsQuery,
    useGetChemistsByIdQuery,
    useGetChemistsAreaQuery,
    useGetChemistsAreaByIdQuery,
    useGetChemistsCategoryQuery,
    useGetChemistsCategoryByIdQuery,
    useDeleteChemistsByIdMutation,
    useDeleteChemistsCategoryByIdMutation,
    useCreateChemistsMutation,
    useCreateChemistsCategoryMutation,
    useUpdateChemistsMutation,
    useUpdateChemistsCategoryMutation,
    useSearchChemistsMutation,
    useGetChemistsWithoutPaginationQuery,
    useGetChemistsByMpoAreaAndIdQuery,
    useGetAllChemistsWithoutPaginationQuery
} = ChemistSlice

//! returns the query result object
export const selectChemistsResult = ChemistSlice.endpoints.getAllChemists.select()

//!Creates memoized selector
const selectChemistsData = createSelector(
    selectChemistsResult,
    chemistResult => chemistResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChemists,
    selectById: selectChemistsById,
    // Pass in a selector that returns the posts slice of state
} = chemistAdapter.getSelectors(state => selectChemistsData(state) ?? initialState)



