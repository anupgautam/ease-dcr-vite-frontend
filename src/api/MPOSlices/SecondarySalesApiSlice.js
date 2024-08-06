import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const secondarySalesAdapter = createEntityAdapter();

const initialState = secondarySalesAdapter.getInitialState();

export const SecondarySalesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the secondarysales
        getAllSecondarySales: builder.query({
            query: (page) => ({
                url: `sales/secondary-sales/`,
                method: 'GET'
            }),
            providesTags: ['SecondarySale']
        }),

        //! GET primary sale by id
        getSecondarySalesById: builder.query({
            query: (id) => ({
                url: `sales/secondary-sales/${id}/`,
                method: 'GET'
            }),
            providesTags: ['SecondarySale']
        }),

        //! DELETE secondarysales by id
        deleteSecondarySalesById: builder.mutation({
            query: (id) => {
                return {
                    url: `sales/secondary-sales/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['SecondarySale']
        }),

        //! POST secondarysales 
        createSecondarySales: builder.mutation({
            query: (newSecondarySale) => {
                // newSecondarySale.company_id = Cookies.get("company_id")
                return {
                    url: `sales/secondary-sales/`,
                    method: 'POST',
                    body: newSecondarySale,
                }
            },
            invalidatesTags: ['SecondarySale']
        }),

        //! Search SecondarySale wala post
        searchSecondarySales: builder.mutation({
            query: (FilteredData) => {
                const { selectedOption, companyId, selectedMonth, dateData } = FilteredData;
                return {
                    url: `sales/secondary-sales/?id=${companyId}&stockist=${selectedOption}&year=${dateData}&month=${selectedMonth}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['SecondarySale']
        }),

        //! Search SecondarySale wala post
        searchSecondarySalesCSV: builder.mutation({
            query: (FilteredData) => {
                const { companyId, selectedMonth, dateData } = FilteredData;
                return {
                    url: `sales/secondary-sales/?company_name=${companyId}&year=${dateData}&month=${selectedMonth}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['SecondarySale']
        }),

        //! Update secondarysales data by id
        updateSecondarySales: builder.mutation({
            query: (updateSecondarySale) => {
                return {
                    url: `sales/secondary-sales/${updateSecondarySale.get('id')}/`,
                    method: 'PUT',
                    body: updateSecondarySale
                }
            },
            invalidatesTags: ['SecondarySale'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllSecondarySales', id, (draft) => {
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
    useGetAllSecondarySalesQuery,
    useGetSecondarySalesByIdQuery,
    useDeleteSecondarySalesByIdMutation,
    useCreateSecondarySalesMutation,
    useUpdateSecondarySalesMutation,
    useSearchSecondarySalesMutation,
    useSearchSecondarySalesCSVMutation,
} = SecondarySalesApiSlice

//! returns the query result object
export const selectSecondarySalesResult = SecondarySalesApiSlice.endpoints.getAllSecondarySales.select()

//!Creates memoized selector
const selectSecondarySalesData = createSelector(
    selectSecondarySalesResult,
    secondarysalesResult => secondarysalesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllSecondarySales,
    selectById: selectSecondarySalesById,
    // Pass in a selector that returns the posts slice of state
} = secondarySalesAdapter.getSelectors(state => selectSecondarySalesData(state) ?? initialState)



