import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const StockistOrderedProductSlice = createEntityAdapter();

const initialState = StockistOrderedProductSlice.getInitialState();

export const StockistOrderedProductSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all StockistOrderedProducts
        getStockistOrderedProducts: builder.query({
            query: (page) => ({
                url: `product/get-chemist-ordered-product/`,
                method: 'GET'
            }),
            providesTags: ['StockistOrderedProducts']
        }),

        //! Get all StockistOrderedProducts By id
        getStockistOrderedProductsById: builder.query({
            query: (id) => ({
                url: `product/get-chemist-ordered-product/${id}`,
                method: 'GET'
            }),
            providesTags: ['StockistOrderedProducts']
        }),

        getStockistOrderedProductsByChemistId: builder.mutation({
            query: (id) => ({
                url: `product/get-stockist-ordered-product/`,
                method: 'POST',
                body: { 'stockist_id': id }
            }),
            providesTag: ['StockistOrderedProducts'],
        }),

        //! Delete StockistOrderedProducts by id
        deleteStockistOrderedProductsById: builder.mutation({
            query: (id) => {

                return {
                    url: `product/get-chemist-ordered-product/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['StockistOrderedProducts']
        }),

        //! Update StockistOrderedProducts data by id
        updateStockistOrderedProducts: builder.mutation({
            query: (updateStockistOrderedProduct) => {
                return {
                    url: `product/get-chemist-ordered-product/${updateStockistOrderedProduct.get('id')}/`,
                    method: 'PATCH',
                    body: updateStockistOrderedProduct,
                }
            },
            invalidatesTags: ['StockistOrderedProducts'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getStockistOrderedProducts', id, (draft) => {
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
    useGetStockistOrderedProductsQuery,
    useGetStockistOrderedProductsByIdQuery,
    useUpdateStockistOrderedProductsMutation,
    useDeleteStockistOrderedProductsByIdMutation,
    useGetStockistOrderedProductsByChemistIdMutation,
} = StockistOrderedProductSlices

//! returns the query result object
export const selectStockistOrderedProductsResult = StockistOrderedProductSlices.endpoints.getStockistOrderedProducts.select()

//!Creates memoized selector
const selectStockistOrderedProductsData = createSelector(
    selectStockistOrderedProductsResult,
    StockistOrderedProductResult => StockistOrderedProductResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStockistOrderedProducts,
    selectById: selectStockistOrderedProductsById,
    // Pass in a selector that returns the posts slice of state
} = StockistOrderedProductSlice.getSelectors(state => selectStockistOrderedProductsData(state) ?? initialState)



