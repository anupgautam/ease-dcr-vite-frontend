import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const ShiftAdapter = createEntityAdapter();

const initialState = ShiftAdapter.getInitialState();

export const ShiftSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the Shift
        getAllShifts: builder.query({
            query: (page) => ({
                url: `/mpo/shift/`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Shift'
                ]
        }),

        //! GET Shift by id
        getShiftsById: builder.query({
            query: (id) => ({
                url: `/mpo/shift/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Shift']
        }),

        //! DELETE Shift by id
        deleteShiftsById: builder.mutation({
            query: ({ id }) => ({
                url: `/mpo/shift/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Shift']
        }),

        //! POST Shift   
        createShifts: builder.mutation({
            query: (newShift) => {
                newShift.company_id = Cookies.get("company_id")
                return {
                    url: `/mpo/shift/`,
                    method: 'POST',
                    body: newShift,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Shift']
        }),


        //! Update Shift data by id
        updateShifts: builder.mutation({
            query: (updateShift) => {
                return {
                    url: `/mpo/shift/${updateShift.get('id')}/`,
                    method: 'PUT',
                    body: updateShift
                }
            },
            invalidatesTags: ['Shift'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllShifts', id, (draft) => {
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
    useGetAllShiftsQuery,
    useGetShiftsByIdQuery,
    useDeleteShiftsByIdMutation,
    useCreateShiftsMutation,
    useUpdateShiftsMutation,
    useSearchShiftsMutation
} = ShiftSlice

//! returns the query result object
export const selectShiftsResult = ShiftSlice.endpoints.getAllShifts.select()

//!Creates memoized selector
const selectShiftsData = createSelector(
    selectShiftsResult,
    ShiftResult => ShiftResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllShifts,
    selectById: selectShiftsById,
    // Pass in a selector that returns the posts slice of state
} = ShiftAdapter.getSelectors(state => selectShiftsData(state) ?? initialState)



