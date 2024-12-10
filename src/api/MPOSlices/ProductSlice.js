import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const productAdapter = createEntityAdapter();

const initialState = productAdapter.getInitialState();

export const ProductSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! GET all the product
        getAllProducts: builder.query({
            query: (page) =>
            ({
                url: `product/company-division-product/?company_name=${page.id}&page=${page.page}&division_name=${page.division_name}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'Product'
                ]
        }),

        //! GET all the products without pagination
        getAllProductsOptions: builder.query({
            query: (page) => ({
                url: `product/company-division-product-without-pagination/?company_name=${page.id}&division_name=${page.division_name}`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! GET company name
        getCompName: builder.query({
            query: () => ({
                url: `company/company/`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! GET company name by id
        getCompNameById: builder.query({
            query: (id) => ({
                url: `company/company/${id}`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! GET division 
        getCompDivision: builder.query({
            query: (id) => ({
                url: `company/company-wise-division/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['CompanyDivision']
        }),

        //! Get Company Division By Company Id 
        getCompanyDivisionByCompanyId: builder.query({
            query: (id) => ({
                url: `/company/company-wise-division/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['CompanyDivision']
        }),

        //! GET company division by id
        getCompDivisionById: builder.query({
            query: (id) => ({
                url: `/product/company-division-product/?product_name__/${id}`,
                method: 'GET'
            }),
            providesTags: ['CompanyDivision']
        }),

        //! GET MPOs 
        getMPOs: builder.query({
            query: () => ({
                url: `/mpo/company-mpo/`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! GET MPOs by id
        getMPOsById: builder.query({
            query: (id) => ({
                url: `/product/company-mpowise-product/?product_name__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! GET products by id
        getProductsById: builder.query({
            query: (id) => ({
                url: `product/company-division-product/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),
        getProductForDcrById: builder.query({
            query: (id) => ({
                url: `product/company-division-product/${id}/`,
                method: 'GET'
            }),
            providesTags: ['Product'],
            invalidatesTags: ['Product']

        }),

        getProductsByDivisionId: builder.query({
            query: (id) =>
            ({
                url: `product/company-division-product/?company_name=${id.company_name}&division_name=${id.division_name}`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        getProductsByDivisionWithoutPagination: builder.query({
            query: (id) => ({
                url: `product/company-division-product-without-pagination/?company_name=${id.company_name}&division_name=${id.division_name}`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! DELETE products by id
        deleteProductsById: builder.mutation({
            query: (id) => ({
                url: `product/company-division-product/${id}/`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Product']
        }),

        //! POST products 
        createProducts: builder.mutation({
            query: (newProduct) => {
                newProduct.company_id = Cookies.get('company_id');

                return {
                    url: `product/company-division-product/`,
                    method: 'POST',
                    body: newProduct,
                }
            },
            invalidatesTags: ['Product']
        }),

        //! Search Product wala post
        searchProducts: builder.mutation({
            query: (searchProduct) => {
                return {
                    url: 'product/company-division-product/search_product/',
                    method: 'POST',
                    body: searchProduct,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Product']
        }),

        //! Update products data by id
        updateProducts: builder.mutation({
            query: (updateProduct) => {
                return {
                    url: `product/company-division-product/${updateProduct.get('product_id')}/`,
                    method: 'PATCH',
                    body: updateProduct
                }
            },
            invalidatesTags: ['Product'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllProducts', id, (draft) => {
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
    useGetAllProductsQuery,
    useGetAllProductsOptionsQuery,
    useGetCompNameQuery,
    useGetCompNameByIdQuery,
    useGetCompDivisionQuery,
    useGetCompDivisionByIdQuery,
    useGetMPOsQuery,
    useGetMPOsByIdQuery,
    useGetProductsByIdQuery,
    useDeleteProductsByIdMutation,
    useCreateProductsMutation,
    useUpdateProductsMutation,
    useSearchProductsMutation,
    useGetCompanyDivisionByCompanyIdQuery,
    useGetProductsByDivisionIdQuery,
    useGetProductForDcrByIdQuery,
    useGetProductsByDivisionWithoutPaginationQuery
} = ProductSlice

//! returns the query result object
export const selectProductsResult = ProductSlice.endpoints.getAllProducts.select()

//!Creates memoized selector
const selectProductsData = createSelector(
    selectProductsResult,
    productResult => productResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProducts,
    selectById: selectProductsById,
    // Pass in a selector that returns the posts slice of state
} = productAdapter.getSelectors(state => selectProductsData(state) ?? initialState)



