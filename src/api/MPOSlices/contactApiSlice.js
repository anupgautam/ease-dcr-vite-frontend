import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";


const contactAdapter = createEntityAdapter();

const initialState = contactAdapter.getInitialState();

// const contact = 'contact/'

export const contactApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //! GET all the chemist
        getAllContacts: builder.query({
            query: () => ({
                url: `support/contact-us`,
                method: 'GET'
            }),
            providesTags: ['Contact']
        }),

        //! Get Analytics By MPO
        getAnalyticsByMPO: builder.query({
            query: (id) => ({
                url: `analytics/?user_id=${id.selectedOption}&year_from=${id.selectedYearFrom}&month_from=${id.selectedMonthFrom}&year_to=${id.selectedYearTo}&month_to=${id.selectedMonthTo}`,
                method: 'GET'
            }),
            providesTags: ['Contact']
        }),

        //! Get Analytics By Other Role 
        getAnalyticsByOtherRole: builder.query({
            query: (id) => ({
                url: `analytics/?user_id=${id.selectedOption}&year_from=${id.selectedYearFrom}&month_from=${id.selectedMonthFrom}&year_to=${id.selectedYearTo}&month_to=${id.selectedMonthTo}`,
                method: 'GET'
            }),
            providesTags: ['Contact']
        }),

        //! DELETE doctor DCR by id
        deleteContactById: builder.mutation({
            query: (id) => {
                // console.log('Deleting contact with ID:', id); // Log ID here
                return {
                    url: `support/contact-us/${id}`,
                    method: 'DELETE',
                    body: id,
                };
            },
            invalidatesTags: ['Contact'],
        }),


        //! POST the contactus
        createContact: builder.mutation({
            query: (createContact) => {

                return {
                    url: "support/contact-us/",
                    method: 'POST',
                    body: createContact,
                }
            },
            invalidatesTags: ['Contact']
        })
    })
})

export const {
    useGetAllContactsQuery,
    useDeleteContactByIdMutation,
    useCreateContactMutation,
    useGetAnalyticsByMPOQuery,
    useGetAnalyticsByOtherRoleQuery,
} = contactApiSlice


export const selectContactsResult = contactApiSlice.endpoints.getAllContacts.select()

// Creates memoized selector
const selectContactssData = createSelector(
    selectContactsResult,
    ContactsResult => ContactsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllContacts,
    selectById: selectContactById,
    selectIds: selectIds
    // Pass in a selector that returns the posts slice of state
} = contactAdapter.getSelectors(state => selectContactssData(state) ?? initialState)