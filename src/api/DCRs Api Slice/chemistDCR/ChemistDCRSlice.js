import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const chemistDCRAdapter = createEntityAdapter();

const initialState = chemistDCRAdapter.getInitialState();

export const ChemistDCRSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all chemist DCR
        getAllChemistsDCR: builder.query({
            query: (page) => ({
                url: `dcr/mpo-shift-wise-dcr-for-chemist/?dcr__dcr__visited_chemist__company_name=${page.id}&page=${page.page}`,
                method: 'GET'
            }),
            providesTags: ['ChemistDCR']
        }),

        //!! GET Chemist DCR by Id 
        getChemistDCRById: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-chemist/${id}`,
                method: 'GET'
            }),
            providesTags: ['ChemistDCR']
        }),

        //! Search Chemist DCR 
        searchChemistsDCR: builder.query({
            query: (searchChemistsDCR) => {

                return {
                    url: `dcr/mpo-shift-wise-dcr-for-chemist/?dcr__dcr__visited_chemist__company_name=${searchChemistsDCR.company_name}&mpo_name=${searchChemistsDCR.user_id}&dcr__dcr__month=${searchChemistsDCR.month}&dcr__dcr__year=${searchChemistsDCR.date}&dcr__dcr__date=${searchChemistsDCR.fullDate}`,
                    method: 'GET',
                }
            },
            providesTags: ['ChemistDCR']
        }),
        //! DELETE chemist DCR by id
        deleteChemistsDCRById: builder.mutation({
            query: ({ id }) => ({
                url: `dcr/mpo-shift-wise-dcr-for-chemist/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['ChemistDCR']
        }),

        //! Update chemist DCR data by id
        updateChemistsDCR: builder.mutation({
            query: (updateChemistsDCR) => {
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-chemist/${updateChemistsDCR.get('id')}/`,
                    method: 'PUT',
                    body: updateChemistsDCR
                }
            },
            invalidatesTags: ['ChemistDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllChemistsDCR', id, (draft) => {
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
    useGetAllChemistsDCRQuery,
    useGetChemistDCRByIdQuery,
    useUpdateChemistsDCRMutation,
    useSearchChemistsDCRQuery,
    useDeleteChemistsDCRByIdMutation
} = ChemistDCRSlice

//! returns the query result object
export const selectChemistsDCRResult = ChemistDCRSlice.endpoints.getAllChemistsDCR.select()

//!Creates memoized selector
const selectChemistsDCRData = createSelector(
    selectChemistsDCRResult,
    chemistDCRResult => chemistDCRResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChemistsDCR,
    selectById: selectChemistsDCRById,
    // Pass in a selector that returns the posts slice of state
} = chemistDCRAdapter.getSelectors(state => selectChemistsDCRData(state) ?? initialState)



