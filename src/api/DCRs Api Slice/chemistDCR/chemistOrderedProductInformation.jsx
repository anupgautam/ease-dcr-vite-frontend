import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../apiSlice";

const ChemistOrderedProductAdapter = createEntityAdapter();

const initialState = ChemistOrderedProductAdapter.getInitialState();

export const ChemistOrderedProductSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all Chemist DCR
        getChemistOrderedProduct: builder.query({
            query: () => ({
                url: '/dcr/dcr-for-chemist-ordered-product-information/',
                method: 'GET'
            }),
            providesTags: ['ChemistOrderedProduct']
        }),

        //! Get all Chemist DCRs by ID 
        getChemistOrderedProductById: builder.query({
            query: (id) => {
                return {
                    url: `/dcr/dcr-for-chemist-ordered-product-information/${id}/`,
                    method: 'GET'
                }
            },
            providesTags: ['ChemistOrderedProduct']
        }),

        //! Get all Dcotor DCRs by DCRId
        getChemistOrderedProductByDCRId: builder.query({
            query: (id) => ({
                url: `/dcr/dcr-for-chemist-ordered-product-information/?dcr_id=${id}`,
                method: 'GET'
            }),
            providesTags: ['ChemistOrderedProduct']
        }),

        // //! Get all Dcotor DCRs by DCRId
        // getStockistOrderedProductByDCRId: builder.query({
        //     query: (id) => ({
        //         url: `/dcr/dcr-for-stockist-ordered-product-information/?dcr_id=${id}`,
        //         method: 'GET'
        //     }),
        //     providesTags: ['ChemistOrderedProduct', 'StockistOrderedProduct']
        // }),

        //! Get Chemist Ordered Products by DCRId
        getChemistOrderedProductsByDCRId: builder.query({
            query: (id) => {
                return {
                    url: `/dcr/chemist-ordered-products-map/?dcr_id=${id.dcr_id}&company_name=${id.company_name}`,
                    method: 'GET'
                }
            },
            providesTags: ['ChemistOrderedProduct']
        }),

        //! Get Stockist Ordered Products DCRId
        getStockistOrderedProductsByDCRId: builder.query({
            query: (id) => {
                return {
                    url: `/dcr/stockist-ordered-products-map/?dcr_id=${id.dcr_id}&company_name=${id.company_name}`,
                    method: 'GET',
                }
            },
            providesTags: ['ChemistOrderedProduct']
        }),

        //! DELETE chemist ordered products DCR by id
        deleteChemistOrderedProductByDCRId: builder.mutation({
            query: (id) => ({
                url: `/dcr/chemist-ordered-products-map/${id['id']}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['ChemistOrderedProduct']
        }),

        //! DELETE stockist DCR by id
        deleteStockistOrderedProductById: builder.mutation({
            query: (id) => {
                return {
                    url: `/dcr/stockist-ordered-products-map/${id['id']}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['ChemistOrderedProduct', 'StockistOrderedProduct']
        }),

        //! CREATE chemist DCR by id
        addChemistOrderedProduct: builder.mutation({
            query: (add) => {

                return {
                    url: `/dcr/dcr-for-chemist-ordered-product-information/`,
                    method: 'POST',
                    body: add,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['ChemistOrderedProduct']
        }),


        //! DELETE chemist DCR by id
        deleteChemistOrderedProductById: builder.mutation({
            query: (id) => {
                return {
                    url: `/dcr/dcr-for-chemist-ordered-product-information/${id['id']}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['ChemistOrderedProduct']
        }),



        //! Update Chemists DCR By ID 
        updateChemistOrderedProduct: builder.mutation({

            query: (ChemistOrderedProduct) => {

                return {
                    url: `/dcr/dcr-for-chemist-ordered-product-information/${ChemistOrderedProduct['data']['id']}/`,
                    method: 'PATCH',
                    body: ChemistOrderedProduct['data'],
                }
            },
            invalidatesTags: ['ChemistOrderedProduct'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getChemistOrderedProduct', id, (draft) => {
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
        addChemistOrderedProductById: builder.mutation({
            query: (add) => {

                return {
                    url: `dcr/dcr-for-chemist-product-rewards-roles/`,
                    method: 'POST',
                    body: add,
                    // headers: {
                    //     'Content-type': 'multipart/form-data; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['ChemistOrderedProduct']
        }),
        getChemistOrderProductData: builder.query({
            query: (id) => {
                return {
                    url: `/dcr/dcr-for-chemist-product/?dcr_id=${id.dcr_id}&ordered_product=${id.id}`,
                    method: 'GET',
                }
            },
            providesTags: ['ChemistOrderedProduct', 'PostTourplan']
        })
    })
})

export const {
    useGetChemistOrderedProductQuery,
    useGetChemistOrderedProductByIdQuery,
    useUpdateChemistOrderedProductMutation,
    useDeleteChemistOrderedProductByIdMutation,
    useAddChemistOrderedProductMutation,
    useGetChemistOrderedProductByDCRIdQuery,
    useAddChemistOrderedProductByIdMutation,
    useGetChemistOrderProductDataQuery,
    useGetChemistOrderedProductsByDCRIdQuery,
    useGetStockistOrderedProductsByDCRIdQuery,
    useDeleteChemistOrderedProductByDCRIdMutation,
    useDeleteStockistOrderedProductByIdMutation,
    useGetStockistOrderedProductsByDCRIdMutation,
} = ChemistOrderedProductSlice

//! returns the query result object
export const selectChemistOrderedProductResult = ChemistOrderedProductSlice.endpoints.getChemistOrderedProduct.select()

//!Creates memoized selector
const selectChemistOrderedProductData = createSelector(
    selectChemistOrderedProductResult,
    selectChemistOrderedProductResult => selectChemistOrderedProductResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChemistOrderedProduct,
    selectById: selectChemistOrderedProductById,
    // Pass in a selector that returns the posts slice of state
} = ChemistOrderedProductAdapter.getSelectors(state => selectChemistOrderedProductData(state) ?? initialState)



