import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

// import { Jsonconfig } from "../../constant/header";

const eventProviderAdapter = createEntityAdapter()

const eventProviderURL = '/all-users/event-service-provider/'

const initialState = eventProviderAdapter.getInitialState()

export const eventProviderSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getEventProviders: builder.query({
            query: () => eventProviderURL,
            transformResponse: responseData => {
                return eventProviderAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) =>
                [
                    { type: 'EventProviders', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'EventProviders', id }))
                ]
        }),
        getEventProvidersById: builder.query({
            query: (id) => ({
                url: `${eventProviderURL}${id}/`,
                method: 'GET',
            }),
            providesTags: ['EventProviders']
        }),
        addEventProvider: builder.mutation({
            query: (eventProvider) => {
                return {
                    url: eventProviderURL,
                    method: 'POST',
                    body: eventProvider,
                }
            },
            invalidatesTags: ['EventProviders']
        }),
        updateEventProvider: builder.mutation({

            query: (updateEventProvider) => {
                return {
                    url: `${eventProviderURL}${updateEventProvider.get('id')}/`,
                    method: 'PATCH',
                    body: updateEventProvider
                }
            },
            invalidatesTags: ['EventProviders']
        }),
        deleteEventProvider: builder.mutation({
            query: (id) => {
                return {
                    url: `${eventProviderURL}${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['EventProviders']
        }),
    })
})

export const {
    useGetEventProvidersQuery,
    useAddEventProviderMutation,
    useUpdateEventProviderMutation,
    useDeleteEventProviderMutation,
    useGetEventProvidersByIdQuery
} = eventProviderSlice

// returns the query result object
export const selectEventProvidersResult = eventProviderSlice.endpoints.getEventProviders.select()

// Creates memoized selector
const selectEventProviderssData = createSelector(
    selectEventProvidersResult,
    eventProvidersResult => eventProvidersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllEventProviders,
    selectById: selectEventProviderById,
    // Pass in a selector that returns the posts slice of state
} = eventProviderAdapter.getSelectors(state => selectEventProviderssData(state) ?? initialState)
