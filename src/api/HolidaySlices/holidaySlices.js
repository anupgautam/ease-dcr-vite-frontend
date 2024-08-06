import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const HolidaySlice = createEntityAdapter();

const initialState = HolidaySlice.getInitialState();

export const HolidaySlices = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! Get all Holidays
        getHolidays: builder.query({
            query: (page) => ({
                url: `mpo/working-day/`,
                method: 'GET'
            }),
            providesTags: ['Holiday']
        }),


        //! Get all Holiday Areas
        getHolidayAreas: builder.query({
            query: () => ({
                url: `company/company-holiday-area/`,
                method: 'GET'
            }),
            providesTags: ['Holiday']
        }),


        filterGetHolidays: builder.query({
            query: (id) => ({
                url: `mpo/working-day/?company=${id}&is_holiday=true`,
                method: 'GET'
            }),
            providesTags: ['Holiday']
        }),

        //! Get all Holidays By id
        getHolidaysById: builder.query({
            query: (id) => ({
                url: `company/company-holiday-area/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Holiday']
        }),

        //! Get all Holidays Areas By id
        getHolidaysAreaById: builder.query({
            query: (id) => ({
                url: `mpo/working-day/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Holiday']
        }),


        getHolidayByMonthAndYear: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/working-day/monthly_holiday/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Holiday']
        }),
        //! Create Holidays by id
        createHolidays: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/working-day/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Holiday']
        }),

        //! Create Holiday Areas
        createHolidayAreas: builder.mutation({
            query: (id) => {
                return {
                    // url: `company/bulk-create-company-holiday-area/`,
                    url: `company/company-holiday-area/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Holiday']
        }),


        //! Delete Holidays by id
        deleteHolidaysById: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/working-day/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Holiday']
        }),

        //! Delete Holiday Areas by id
        deleteHolidayAreasById: builder.mutation({
            query: (id) => ({
                url: `company/company-holiday-area/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Holiday']
        }),

        bulkHolidayAdd: builder.mutation({
            query: (id) => {

                return {
                    url: `mpo/working-days/`,
                    method: 'POST',
                    body: id
                }
            },
            invalidatesTags: ['Holiday']
        }),

        //! Update Holidays data by id
        updateHolidays: builder.mutation({
            query: (updateHoliday) => {
                return {
                    url: `company/company-holiday-area/${updateHoliday.get('id')}/`,
                    method: 'PATCH',
                    body: updateHoliday,
                }
            },
            invalidatesTags: ['Holiday'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getHolidayAreas', id, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),

        //! Update Holiday Areas by id
        updateHolidayArea: builder.mutation({
            query: (updateHolidayArea) => {
                return {
                    url: `dcr/rewards/${updateHolidayArea.get('id')}/`,
                    method: 'PUT',
                    body: updateHolidayArea
                }
            },
            invalidatesTags: ['Holiday'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllRewards', id, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),

        //! Filter Holiday Area
        searchHolidayAreas: builder.mutation({
            query: (FilteredData) => {
                const { company_area, holiday_type, company_id } = FilteredData;
                return {
                    url: `company/company-holiday-area/?company_area=${company_area}&holiday_type=${holiday_type}&company_area__company_name=${company_id}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['Holiday']
        }),
    })
})

export const {
    useGetHolidaysQuery,
    useGetHolidaysByIdQuery,
    useUpdateHolidaysMutation,
    useDeleteHolidaysByIdMutation,
    useCreateHolidaysMutation,
    useBulkHolidayAddMutation,
    useFilterGetHolidaysQuery,
    useGetHolidayByMonthAndYearMutation,

    useGetHolidayAreasQuery,
    useGetHolidaysAreaByIdQuery,
    useCreateHolidayAreasMutation,
    useUpdateHolidayAreaMutation,
    useDeleteHolidayAreasByIdMutation,
    useSearchHolidayAreasMutation
} = HolidaySlices

//! returns the query result object
export const selectHolidaysResult = HolidaySlices.endpoints.getHolidays.select()

//!Creates memoized selector
const selectHolidaysData = createSelector(
    selectHolidaysResult,
    HolidayResult => HolidayResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllHolidays,
    selectById: selectHolidaysById,
    // Pass in a selector that returns the posts slice of state
} = HolidaySlice.getSelectors(state => selectHolidaysData(state) ?? initialState)



