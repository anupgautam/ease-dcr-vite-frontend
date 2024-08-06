import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const StockistOrderedProductAdapter = createEntityAdapter();

const initialState = StockistOrderedProductAdapter.getInitialState();

export const StockistOrderedProductSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all Stockist DCR
        getStockistOrderedProduct: builder.query({
            query: () => ({
                url: '/dcr/dcr-for-stockist-ordered-product/',
                method: 'GET'
            }),
            providesTags: ['StockistOrderedProduct']
        }),

        //! Get all Stockist DCRs by ID 
        getStockistOrderedProductById: builder.query({
            query: (id) => ({
                url: `/dcr/dcr-for-stockist-ordered-product/${id}/`,
                method: 'GET'
            }),
            providesTags: ['StockistOrderedProduct']
        }),

        //! Get all Dcotor DCRs by DCRId
        getStockistOrderedProductByDCRId: builder.query({
            query: (id) => ({
                url: `/dcr/dcr-for-stockist-ordered-product/?dcr_id=${id}`,
                method: 'GET'
            }),
            providesTags: ['StockistOrderedProduct']
        }),

        //! CREATE chemist DCR by id
        addStockistOrderedProduct: builder.mutation({
            query: (add) => {

                return {
                    url: `/dcr/dcr-for-stockist-ordered-product/`,
                    method: 'POST',
                    body: add,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['StockistOrderedProduct']
        }),


        //! DELETE chemist DCR by id
        deleteStockistOrderedProductById: builder.mutation({
            query: (id ) => ({
                url: `/dcr/dcr-for-stockist-ordered-product/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['StockistOrderedProduct']
        }),

        //! Update Stockists DCR By ID 
        updateStockistOrderedProduct: builder.mutation({

            query: (StockistOrderedProduct) => {
                
                return {
                    url: `/dcr/dcr-for-stockist-ordered-product/${StockistOrderedProduct['id']}/`,
                    method: 'PATCH',
                    body: StockistOrderedProduct,
                }
            },
            invalidatesTags: ['StockistOrderedProduct'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getStockistOrderedProduct', id, (draft) => {
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
    useGetStockistOrderedProductQuery,
    useGetStockistOrderedProductByIdQuery,
    useUpdateStockistOrderedProductMutation,
    useDeleteStockistOrderedProductByIdMutation,
    useAddStockistOrderedProductMutation,
    useGetStockistOrderedProductByDCRIdQuery
} = StockistOrderedProductSlice

//! returns the query result object
export const selectStockistOrderedProductResult = StockistOrderedProductSlice.endpoints.getStockistOrderedProduct.select()

//!Creates memoized selector
const selectStockistOrderedProductData = createSelector(
    selectStockistOrderedProductResult,
    selectStockistOrderedProductResult => selectStockistOrderedProductResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStockistOrderedProduct,
    selectById: selectStockistOrderedProductById,
    // Pass in a selector that returns the posts slice of state
} = StockistOrderedProductAdapter.getSelectors(state => selectStockistOrderedProductData(state) ?? initialState)



