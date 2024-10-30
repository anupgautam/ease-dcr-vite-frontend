import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const primarySalesAdapter = createEntityAdapter();

const initialState = primarySalesAdapter.getInitialState();

export const PrimarySalesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the primarysales
        getAllPrimarySales: builder.query({
            query: (page) => ({
                url: `sales/primary-sales/`,
                method: 'GET'
            }),
            providesTags: ['PrimarySale']
        }),

        //! GET primary sale by id
        getPrimarySalesById: builder.query({
            query: (id) => ({
                url: `sales/primary-sales/${id}/`,
                method: 'GET'
            }),
            providesTags: ['PrimarySale']
        }),

        //! DELETE primarysales by id
        deletePrimarySalesById: builder.mutation({
            query: (id) => {
                return {
                    url: `sales/primary-sales/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['PrimarySale']
        }),

        //! POST primarysales 
        createPrimarySales: builder.mutation({
            query: (newPrimarySale) => {
                // newPrimarySale.company_id = Cookies.get("company_id")
                return {
                    url: `sales/primary-sales/`,
                    method: 'POST',
                    body: newPrimarySale,
                }
            },
            invalidatesTags: ['PrimarySale']
        }),

        //! Search PrimarySale wala post
        searchPrimarySales: builder.mutation({
            query: (FilteredData) => {
                const { selectedOption, companyId, selectedMonth, dateData } = FilteredData;
                return {
                    url: `sales/primary-sales/?id=${companyId}&stockist=${selectedOption}&year=${dateData}&month=${selectedMonth}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['PrimarySale']
        }),

        //! Excel CSV Files
        searchPrimarySalesCSV: builder.mutation({
            query: (FilteredData) => {
                const { companyId, selectedMonth, dateData } = FilteredData;
                return {
                    url: `sales/primary-sales/?company_name=${companyId}&year=${dateData}&month=${selectedMonth}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['PrimarySale']
        }),

        //! Update primarysales data by id
        updatePrimarySales: builder.mutation({
            query: (updatePrimarySale) => {
                return {
                    url: `sales/primary-sales/${updatePrimarySale.id}/`,
                    method: 'PATCH',
                    body: updatePrimarySale
                }
            },
            invalidatesTags: ['PrimarySale'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllPrimarySales', id, (draft) => {
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
    useGetAllPrimarySalesQuery,
    useGetPrimarySalesByIdQuery,
    useDeletePrimarySalesByIdMutation,
    useCreatePrimarySalesMutation,
    useUpdatePrimarySalesMutation,
    useSearchPrimarySalesMutation,
    useSearchPrimarySalesCSVMutation,
} = PrimarySalesApiSlice

//! returns the query result object
export const selectPrimarySalesResult = PrimarySalesApiSlice.endpoints.getAllPrimarySales.select()

//!Creates memoized selector
const selectPrimarySalesData = createSelector(
    selectPrimarySalesResult,
    primarysalesResult => primarysalesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPrimarySales,
    selectById: selectPrimarySalesById,
    // Pass in a selector that returns the posts slice of state
} = primarySalesAdapter.getSelectors(state => selectPrimarySalesData(state) ?? initialState)



