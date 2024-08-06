import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const ChemistDCRAllAdapter = createEntityAdapter();

const initialState = ChemistDCRAllAdapter.getInitialState();

export const ChemistDCRAllSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all Chemist DCR
        getAllChemistsAllDCR: builder.query({
            query: () => ({
                url: 'dcr/dcr-for-chemist-product-rewards-roles/',
                method: 'GET'
            }),
            providesTags: ['ChemistAllDCR']
        }),

        //! Get all Chemist DCRs by ID 
        getChemistAllDCRById: builder.query({
            query: (id) => ({
                url: `dcr/dcr-for-chemist-product-rewards-roles/${id}/`,
                method: 'GET'
            }),
            providesTags: ['ChemistAllDCR']
        }),
        getChemistAllDCRByIdForMpoId: builder.query({
            query: (id) => ({
                url: `dcr/mpo-shift-wise-dcr-for-chemist/?dcr__dcr__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['ChemistAllDCR']
        }),

        //! CREATE chemist DCR by id
        addChemistsAllDCR: builder.mutation({
            query: (addChemistsDCR) => {

                return {
                    url: `dcr/dcr-for-chemist-product-rewards-roles/`,
                    method: 'POST',
                    body: addChemistsDCR,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['ChemistAllDCR']
        }),


        //! DELETE chemist DCR by id
        deleteChemistsAllDCRById: builder.mutation({
            query: (id) => ({
                url: `dcr/dcr-for-chemist-product-rewards-roles/${id['id']}/`,
                method: 'DELETE',
                body: id,
            }),
            invalidatesTags: ['ChemistAllDCR']
        }),

        //! Update Stockists DCR By ID 
        updateChemistsAllDCR: builder.mutation({

            query: (updateChemistsDCR) => {

                return {
                    url: `dcr/dcr-for-chemist-product-rewards-roles/${updateChemistsDCR['data']['id']}/`,
                    method: 'PATCH',
                    body: updateChemistsDCR['data'],
                }
            },
            invalidatesTags: ['ChemistAllDCR'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllChemistsAllDCR', id, (draft) => {
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
    useGetChemistAllDCRByIdQuery,
    useGetAllChemistsAllDCRQuery,
    useUpdateChemistsAllDCRMutation,
    useDeleteChemistsAllDCRByIdMutation,
    useAddChemistsAllDCRMutation,
    useGetChemistAllDCRByIdForMpoIdQuery,
} = ChemistDCRAllSlice

//! returns the query result object
export const selectChemistDCRAllDCRResult = ChemistDCRAllSlice.endpoints.getAllChemistsAllDCR.select()

//!Creates memoized selector
const selectChemistsDCRAllData = createSelector(
    selectChemistDCRAllDCRResult,
    ChemistDCRAllResult => ChemistDCRAllResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChemistsDCRAll,
    selectById: selectChemistsDCRAllById,
    // Pass in a selector that returns the posts slice of state
} = ChemistDCRAllAdapter.getSelectors(state => selectChemistsDCRAllData(state) ?? initialState)



