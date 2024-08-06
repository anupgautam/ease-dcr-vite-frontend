import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";


const chemistAdapter = createEntityAdapter();

const initialState = chemistAdapter.getInitialState();

const company_id = Cookies.get('company_id');

export const chemistApiSlice =apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        //! GET all the chemist
        getAllChemists: builder.query({
            query: (page) => ({
                url: `chemist/company-wise-chemist/?page=${page}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist by id
        getChemistsById: builder.query({
            query: (id) => ({
                url: `chemist/company-wise-chemist/?chemist_name__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['Chemist']
        }),

        //! GET chemist by id
        getChemistsWithoutPagination: builder.query({
            query: (id) => ({
                url: `chemist/company-wise-chemist-with-out-pagination/`,
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

        //! GET chemist area
        getChemistsArea: builder.query({
            query: () => ({
                url: `chemist/company-wise-chemist-working-area/`,
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
            query: ({ id }) => {

                return {
                    url: `chemist/company-wise-chemist/${id}`,
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
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
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
                // 
                return {
                    url: `chemist/chemist/${updateChemist.get('id')}/`,
                    method: 'PUT',
                    body: updateChemist,
                }
            },
            invalidatesTags: ['Chemist']
        })
    })
})

//! Api hooks
export const {
    useGetAllChemistsQuery,
    useGetChemistsByIdQuery,
    useGetChemistsAreaQuery,
    useGetChemistsAreaByIdQuery,
    useGetChemistsCategoryQuery,
    useGetChemistsCategoryByIdQuery,
    useDeleteChemistsByIdMutation,
    useCreateChemistsMutation,
    useUpdateChemistsMutation,
    useSearchChemistsMutation,
    useGetChemistsWithoutPaginationQuery
} = chemistApiSlice

// returns the query result object
export const selectChemistsResult = chemistApiSlice.endpoints.getAllChemists.select()

// Creates memoized selector
const selectChemistssData = createSelector(
    selectChemistsResult,
    chemistsResult => chemistsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChemists,
    selectById: selectChemistById,
    selectIds: selectIds
    // Pass in a selector that returns the posts slice of state
} = chemistAdapter.getSelectors(state => selectChemistssData(state) ?? initialState)