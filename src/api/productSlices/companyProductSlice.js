import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyProductAdapter = createEntityAdapter();

const initialState = companyProductAdapter.getInitialState();

export const companyProductSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the users
        getAllCompanyProducts: builder.query({
            query: (page) => ({
                url: `/product/company-product/`,
                method: 'GET'
            }),
            providesTags: ['CompanyProducts']
        }),
        //! GET all the users
        getAllCompanyProductsWithoutPagination: builder.query({
            query: (page) => ({
                url: `/product/company-product-without-pagination/?company_name=${page}`,
                method: 'GET'
            }),
            providesTags: ['CompanyProducts']
        }),
        getAllCompanyProductsWithoutPaginationById: builder.query({
            query: (page) => ({
                url: `/product/company-product-without-pagination/${page}/`,
                method: 'GET'
            }),
            providesTags: ['CompanyProducts']
        }),
        //! GET users by id
        getCompanyProductsById: builder.query(
            {
                query: (id) => (
                    {
                        url: `/product/company-product/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyProducts']
            }),

        //! DELETE users by id
        deleteCompanyProductById: builder.mutation({
            query: (id) => {
                return {
                    url: `/product/company-product/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyProducts']
        }),

        //! POST users 
        createCompanyProducts: builder.mutation({
            query: (createCompanyProducts) => {
                // 

                return {
                    url: "/product/company-product/",
                    method: 'POST',
                    body: createCompanyProducts,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyProducts']
        }),

        //! Login User


        //! Update users data by id
        updateCompanyProducts: builder.mutation({
            query: (updateCompanyProducts) => {

                return {
                    url: `/product/company-product/${updateCompanyProducts.id}/`,
                    method: 'PUT',
                    body: updateCompanyProducts
                };
            },
            invalidatesTags: ['CompanyProducts']
        }),
    })
})

//! Api hooks
export const {
    useGetAllCompanyProductsQuery,
    useGetCompanyProductsByIdQuery,
    useGetAllCompanyProductsWithoutPaginationQuery,
    useDeleteCompanyProductByIdMutation,
    useCreateCompanyProductsMutation,
    useUpdateCompanyProductsMutation,
    useGetAllCompanyProductsWithoutPaginationByIdQuery,
} = companyProductSlice;


export const selectCompanyProductsResult = companyProductSlice.endpoints.getAllCompanyProducts.select()

// Creates memoized selector
const selectCompanyProductssData = createSelector(
    selectCompanyProductsResult,
    CompanyProductsResult => CompanyProductsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyProducts,
    selectById: selectCompanyProductById,
    // Pass in a selector that returns the posts slice of state
} = companyProductAdapter.getSelectors(state => selectCompanyProductssData(state) ?? initialState)
