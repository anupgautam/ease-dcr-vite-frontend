import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";


const contactAdapter = createEntityAdapter();

const initialState = contactAdapter.getInitialState();

const contact = 'contact/'

export const contactApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //! GET all the chemist
        getAllContacts: builder.query({
            query: (page) => ({
                url: `contact/`,
                method: 'GET'
            }),
            providesTags: ['Contact']
        }),
        //! POST the contactus
        createContact: builder.mutation({   
            query: (createContact) => {
                
                return {
                    url: contact,
                    method: 'POST',
                    body: createContact,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Contact']
        })
    })
})

export const {
    useCreateContactMutation
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