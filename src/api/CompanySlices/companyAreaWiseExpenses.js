import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyAreaWiseExpensesAdapter = createEntityAdapter();

const initialState = companyAreaWiseExpensesAdapter.getInitialState();

export const CompanyAreaWiseExpenses = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the users
        getAllCompanyAreaWiseExpenses: builder.query({
            query: (page) => ({
                url: `expenses/company-area-wise-expenses/?company_name=${page.id}&page=${page.page}`,
                method: 'GET'
            }),
            providesTags: ['CompanyAreaWiseExpenses']
        }),


        //! GET daily allowances by id
        getCompanyAreaWiseExpensesById: builder.query(
            {
                query: (id) => (
                    {
                        url: `expenses/company-area-wise-expenses/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyAreaWiseExpenses']
            }),

        //! GET travel allowances  by id
        getTravelAllowancesById: builder.query(
            {
                query: (id) => (
                    {
                        url: `expenses/company-area-wise-expenses/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyAreaWiseExpenses']
            }),

        //! DELETE users by id
        deleteCompanyAreaWiseExpensesById: builder.mutation({
            query: (id) => {
                return {
                    url: `expenses/company-area-wise-expenses/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyAreaWiseExpenses']
        }),

        //! Delete Travel Allowances by id
        deleteTravelAllowancesById: builder.mutation({
            query: (id) => {
                return {
                    url: `expenses/company-area-wise-expenses/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyAreaWiseExpenses']
        }),

        //! POST users 
        createCompanyAreaWiseExpenses: builder.mutation({
            query: (createCompanyAreaWiseExpenses) => {
                return {
                    url: "expenses/expenses/",
                    method: 'POST',
                    body: createCompanyAreaWiseExpenses,

                }
            },
            invalidatesTags: ['CompanyAreaWiseExpenses']
        }),

        //! Search Daily Allowances
        searchCompanyAreaWiseExpenses: builder.mutation({
            query: (FilteredData) => {
                const { area_name, company_name } = FilteredData;
                return {
                    url: `expenses/company-area-wise-expenses/?area_name=${area_name}&company_name=${company_name}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['CompanyAreaWiseExpenses']
        }),

        //! Search Travel Allowances
        searchTravelAllowances: builder.query({
            query: (id) => ({
                url: `expenses/expenses/?company_name=${id.company_name}&user_id=${id.user_id}&year=${id.year}&month=${id.month}`
            }),
            providesTags: ['CompanyAreaWiseExpenses']
        }),

        getExpenseByTheId: builder.query({
            query: (id) => ({
                url: `expenses/expenses/${id}/`
            }),
            providesTags: ['CompanyAreaWiseExpenses']
        }),


        //! Update company users data by id
        updateCompanyAreaWiseExpenses: builder.mutation({
            query: (updateCompanyAreaWiseExpenses) => {
                //! FormData console 
                var formDataObject = Array.from(updateCompanyAreaWiseExpenses.entries()).reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});
                return {
                    url: `expenses/expenses/${updateCompanyAreaWiseExpenses.get('id')}/`,
                    method: 'PUT',
                    body: updateCompanyAreaWiseExpenses
                }
            },
            invalidatesTags: ['CompanyAreaWiseExpenses'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyAreaWiseExpense', id, (draft) => {
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

        //! Update travel allowances
        updateTravelAllowances: builder.mutation({
            query: (updateTravelAllowances) => {
                return {
                    url: `expenses/expenses/${updateTravelAllowances.get('id')}/`,
                    method: 'PUT',
                    body: updateTravelAllowances,
                }
            },
            invalidatesTags: ['CompanyAreaWiseExpenses'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyAreaWiseExpense', id, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),
    })
})

export const {
    useGetAllCompanyAreaWiseExpensesQuery,
    useGetCompanyAreaWiseExpensesByIdQuery,
    useGetTravelAllowancesByIdQuery,
    useDeleteCompanyAreaWiseExpensesByIdMutation,
    useDeleteTravelAllowancesByIdMutation,
    useCreateCompanyAreaWiseExpensesMutation,
    useUpdateCompanyAreaWiseExpensesMutation,
    useSearchCompanyAreaWiseExpensesMutation,
    useSearchTravelAllowancesQuery,
    useUpdateTravelAllowancesMutation,
    useGetExpenseByTheIdQuery,
} = CompanyAreaWiseExpenses

//! returns the query result object
export const selectCompanyAreaWiseExpenses = CompanyAreaWiseExpenses.endpoints.getAllCompanyAreaWiseExpenses.select()

//!Creates memoized selector
const selectCompanyAreaWiseExpensesData = createSelector(
    selectCompanyAreaWiseExpenses,
    companyAreaWiseExpensesResult => companyAreaWiseExpensesResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyAreaWiseExpenses,
    selectById: selectCompanyAreaWiseExpensesById,
    // Pass in a selector that returns the posts slice of state
} = companyAreaWiseExpensesAdapter.getSelectors(state => selectCompanyAreaWiseExpensesData(state) ?? initialState)



