import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const ChemistOrderedProductSlice = createEntityAdapter();

const initialState = ChemistOrderedProductSlice.getInitialState();

export const ChemistOrderedProductSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all ChemistOrderedProducts
        getChemistOrderedProducts: builder.query({
            query: (page) => ({
                url: `product/get-chemist-ordered-product/`,
                method: 'GET'
            }),
            providesTags: ['ChemistOrderedProduct']
        }),

        //! Get all ChemistOrderedProducts By id
        getChemistOrderedProductsById: builder.query({
            query: (id) => ({
                url: `product/get-chemist-ordered-product/${id}`,
                method: 'GET'
            }),
            providesTags: ['ChemistOrderedProduct']
        }),

        //! Get Secondary Sales by Company Id
        getSecondarySalesByCompanyId: builder.query({
            query: (id) => ({
                url: `dcr/chemist-ordered-products-map/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['ChemistOrderedProduct']
        }),

        getChemistOrderedProductsByChemistId: builder.mutation({
            query: (id) =>
            ({
                url: `product/get-chemist-ordered-product/`,
                method: 'POST',
                body: { 'chemist_id': id }
            }),
            providesTag: ['ChemistOrderedProduct'],
        }),

        //! Delete ChemistOrderedProducts by id
        deleteChemistOrderedProductsById: builder.mutation({
            query: (id) => {

                return {
                    url: `product/get-chemist-ordered-product/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['ChemistOrderedProduct']
        }),

        //! Update ChemistOrderedProducts data by id
        updateChemistOrderedProducts: builder.mutation({
            query: (updateChemistOrderedProduct) => {
                return {
                    url: `product/get-chemist-ordered-product/${updateChemistOrderedProduct.get('id')}/`,
                    method: 'PATCH',
                    body: updateChemistOrderedProduct,
                }
            },
            invalidatesTags: ['ChemistOrderedProduct'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getChemistOrderedProducts', id, (draft) => {
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
    useGetChemistOrderedProductsQuery,
    useGetChemistOrderedProductsByIdQuery,
    useUpdateChemistOrderedProductsMutation,
    useDeleteChemistOrderedProductsByIdMutation,
    useGetChemistOrderedProductsByChemistIdMutation,
    useGetSecondarySalesByCompanyIdQuery
} = ChemistOrderedProductSlices

//! returns the query result object
export const selectChemistOrderedProductsResult = ChemistOrderedProductSlices.endpoints.getChemistOrderedProducts.select()

//!Creates memoized selector
const selectChemistOrderedProductsData = createSelector(
    selectChemistOrderedProductsResult,
    ChemistOrderedProductResult => ChemistOrderedProductResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChemistOrderedProducts,
    selectById: selectChemistOrderedProductsById,
    // Pass in a selector that returns the posts slice of state
} = ChemistOrderedProductSlice.getSelectors(state => selectChemistOrderedProductsData(state) ?? initialState)



