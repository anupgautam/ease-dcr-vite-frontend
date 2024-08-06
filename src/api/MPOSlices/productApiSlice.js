import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";


const productAdapter = createEntityAdapter();

const initialState = productAdapter.getInitialState();


export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the products
        getAllProducts: builder.query({
            query: (page) => ({
                url: `product/company-division-product/?page=${page}`,
                method: 'GET'
            }),
            providesTags: ['Product']
        }),

        //! GET all the products without pagination
        getAllProductsOptions: builder.query({
            query: (id) => ({
                url: `product/company-division-product-without-pagination/?company_name=${id}`,
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
            query: () => ({
                url: `/company/company-wise-division/`,
                method: 'GET'
            }),
            providesTags: ['CompanyDivision']
        }),

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


        getAllProductsOptionsWithDivision: builder.query({
            query: (id) =>
            ({
                url: `product/company-division-product-without-pagination/?company_name=${id.company_name}&division_name=${id.division_name}`,
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





        //! DELETE products by id
        deleteProductsById: builder.mutation({
            query: (id) => ({
                url: `product/${id}`,
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
                    url: `product/company-division-product/create_product_with_mpo_and_division/`,
                    method: 'POST',
                    body: newProduct,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Product']
        }),

        //! Search Product wala post
        searchProducts: builder.mutation({
            query: (searchProduct) => {
                return {
                    url: 'product/company-mpowise-product/search_product/',
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
                    method: 'PUT',
                    body: updateProduct,
                }
            },
            invalidatesTags: ['Product']
        }),
        postProductPromotions: builder.mutation({
            query: (updateProduct) => {
                return {
                    url: `dcr/dcr-for-doctor-company-product-map/`,
                    method: 'POST',
                    body: updateProduct,
                }
            },
            invalidatesTags: ['Product']
        }),
        postVisitedWith: builder.mutation({
            query: (updateProduct) => {
                return {
                    url: `dcr/dcr-for-doctor-company-roles-map/`,
                    method: 'POST',
                    body: updateProduct,
                }
            },
            invalidatesTags: ['Product']
        }),
    })
})

//! Api hooks
export const
    {
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
        useGetAllProductsOptionsWithDivisionQuery,
        usePostProductPromotionsMutation,
        usePostVisitedWithMutation,
    } = productApiSlice

export const {
    useCreateProductMutation
} = productApiSlice


export const selectProductsResult = productApiSlice.endpoints.getAllProducts.select()

// Creates memoized selector
const selectProductssData = createSelector(
    selectProductsResult,
    ProductsResult => ProductsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    // Pass in a selector that returns the posts slice of state
} = productAdapter.getSelectors(state => selectProductssData(state) ?? initialState)
