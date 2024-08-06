import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const companyAreaAdapter = createEntityAdapter();

const initialState = companyAreaAdapter.getInitialState();

export const CompanyAreaSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the users
        getAllCompanyAreas: builder.query({
            query: (page) => ({
                url: `company/company-area/?company_name=${page}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyAreas'
                ]
        }),
        getAllCompanyAreasWithoutPagination: builder.query({
            query: (page) => ({
                url: `company/company-area-without-to-representation/?company_name=${page}`,
                method: 'GET'
            }),
            providesTags: (result, error, arg) =>
                [
                    'CompanyAreas'
                ]
        }),

        //! GET users by id
        getCompanyAreasById: builder.query(
            {
                query: (id) => (
                    {
                        url: `company/company-area/${id}/`,
                        method: 'GET'
                    }),
                providesTags: ['CompanyAreas']
            }),

        //! DELETE users by id
        deleteCompanyAreaById: builder.mutation({
            query: (id) => {
                return {
                    url: `company/company-area/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['CompanyAreas']
        }),

        //! POST users 
        createCompanyAreas: builder.mutation({
            query: (createCompanyAreas) => {
                return {
                    url: "company/company-area/",
                    method: 'POST',
                    body: createCompanyAreas,
                }
            },
            invalidatesTags: ['CompanyAreas']
        }),

        updateMpoAreas: builder.mutation({
            query: (createCompanyAreas) => {
                return {
                    url: `mpo/company-mpo-area/${createCompanyAreas.id}/`,
                    method: 'PATCH',
                    body: createCompanyAreas.data,
                }
            },
            invalidatesTags: ['CompanyAreas']
        }),

        //! Login User


        //! Update company users data by id
        updateCompanyAreas: builder.mutation({
            query: (updateCompanyAreas) => {
                //! FormData console 
                var formDataObject = Array.from(updateCompanyAreas.entries()).reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});
                return {
                    url: `company/company-area/${updateCompanyAreas.get('id')}/`,
                    method: 'PUT',
                    body: updateCompanyAreas
                }
            },
            invalidatesTags: ['CompanyAreas'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCompanyAreas', id, (draft) => {
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
    useGetAllCompanyAreasQuery,
    useGetCompanyAreasByIdQuery,
    useDeleteCompanyAreaByIdMutation,
    useCreateCompanyAreasMutation,
    useUpdateCompanyAreasMutation,
    useGetAllCompanyAreasWithoutPaginationQuery,
    useUpdateMpoAreasMutation,
} = CompanyAreaSlice

//! returns the query result object
export const selectCompanyAreaResult = CompanyAreaSlice.endpoints.getAllCompanyAreas.select()

//!Creates memoized selector
const selectCompanyAreasData = createSelector(
    selectCompanyAreaResult,
    companyAreaResult => companyAreaResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCompanyAreas,
    selectById: selectCompanyAreasById,
    // Pass in a selector that returns the posts slice of state
} = companyAreaAdapter.getSelectors(state => selectCompanyAreasData(state) ?? initialState)



