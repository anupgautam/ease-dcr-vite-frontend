import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const companyRolesAdapter = createEntityAdapter();

const initialState = companyRolesAdapter.getInitialState();

export const CompanyRolesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the users
        getAllCompanyRoles: builder.query({
            query: (page) => ({
                url: `company/company-roles/?company_name=${page}`,
                method: 'GET'
            }),
            providesTags: ['CompanyRoles']
        }),

        getVisitedWithByDcrId: builder.query({
            query: (page) => ({
                url: `dcr/dcr-for-doctor-company-roles-map/?dcr_id=${page}`,
                method: 'GET'
            }),
            providesTags: ['CompanyRoles']
        }),

        //! GET all the users
        getAllRoles: builder.query({
            query: (id) => ({
                url: `company/roles/?company_name=${id}`,
                method: 'GET'
            }),
            providesTags: ['CompanyRoles']
        }),


        //! GET users by id
        getCompanyRolesById: builder.query(
            {
                query: (id) => (
                    {
                        url: `company/company-roles/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyRoles']
            }),

        getCompanyRolesByCompany: builder.query(
            {
                query: (id) => (
                    {
                        url: `company/company-roles/?company_name=${id}`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyRoles']
            }),

        //! DELETE users by id
        deleteCompanyRolesById: builder.mutation({
            query: (id) => {
                return {
                    url: `company/company-roles/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyRoles']
        }),

        //! POST users 
        createCompanyRoles: builder.mutation({
            query: (createCompanyRoles) => {
                // 
                createCompanyRoles.company_id = Cookies.get("company_id")
                return {
                    url: "company/company-roles/",
                    method: 'POST',
                    body: createCompanyRoles,
                    // headers: {
                    //     'Content-type': 'application/json; charset = UTF-8',
                    // }
                }
            },
            invalidatesTags: ['CompanyRoles']
        }),

        //! Login User


        //! Update users data by id
        updateCompanyRoles: builder.mutation({
            query: (updateCompanyRoles) => {

                return {
                    url: `company/company-roles/${updateCompanyRoles.get('id')}/`,
                    method: 'PUT',
                    body: updateCompanyRoles
                };
            },
            invalidatesTags: ['CompanyRoles']
        }),
    })
})

//! Api hooks
export const
    {
        useGetAllCompanyRolesQuery,
        useGetAllRolesQuery,
        useGetCompanyRolesByIdQuery,
        useDeleteCompanyRolesByIdMutation,
        useCreateCompanyRolesMutation,
        useUpdateCompanyRolesMutation,
        useGetCompanyRolesByCompanyQuery,
        useGetVisitedWithByDcrIdQuery,
    } = CompanyRolesApiSlice

//! returns the query result object
export const selectCompanyRolesResult = CompanyRolesApiSlice.endpoints.getAllCompanyRoles.select()

//!Creates memoized selector
const selectCompanyRolesData = createSelector(
    selectCompanyRolesResult,
    CompanyRoleResult => CompanyRoleResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyRoles,
    selectById: selectCompanyRolesById,
    // Pass in a selector that returns the posts slice of state
} = companyRolesAdapter.getSelectors(state => selectCompanyRolesData(state) ?? initialState)