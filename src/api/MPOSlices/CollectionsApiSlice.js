import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

import { apiSlice } from "../apiSlice";

const collectionsAdapter = createEntityAdapter();

const initialState = collectionsAdapter.getInitialState();

export const CollectionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        //! GET all the Collection
        getAllCollections: builder.query({
            query: (page) => ({
                url: `collection/company-wise-Collection/?page=${page}`,
                method: 'GET'
            }),
            providesTags: ['Collection']
        }),

        //! GET primary sale by id
        getCollectionsById: builder.query({
            query: (id) => ({
                url: `collection/company-wise-Collection/?collection_name__id=${id}`,
                method: 'GET'
            }),
            providesTags: ['Collection']
        }),

        //! DELETE Collection by id
        deleteCollectionsById: builder.mutation({
            query: (id) => {
                return {
                    url: `Collection/company-wise-Collection/${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Collection']
        }),

        //! POST Collection 
        createCollections: builder.mutation({
            query: (newCollection) => {
                newCollection.company_id = Cookies.get("company_id")
                return {
                    url: `Collection/Collection/`,
                    method: 'POST',
                    body: newCollection,
                }
            },
            invalidatesTags: ['Collection']
        }),

        //! Search Collection wala post
        searchCollections: builder.mutation({
            query: (searchCollection) => {
                // 
                return {
                    url: `collection/company-wise-Collection/search_Collection/`,
                    method: 'POST',
                    body: searchCollection,
                    // body: { ...searchCollection, company_id },
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    }
                }
            },
            invalidatesTags: ['Collection']
        }),

        //! Update Collection data by id
        updateCollections: builder.mutation({
            query: (updateCollection) => {
                return {
                    url: `Collection/Collection/${updateCollection.get('id')}/`,
                    method: 'PATCH',
                    body: updateCollection
                }
            },
            invalidatesTags: ['Collection'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getAllCollections', id, (draft) => {
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
    useGetAllCollectionsQuery,
    useGetCollectionsByIdQuery,
    useDeleteCollectionsByIdMutation,
    useCreateCollectionsMutation,
    useUpdateCollectionsMutation,
    useSearchCollectionsMutation,
} = CollectionsApiSlice

//! returns the query result object
export const selectCollectionsResult = CollectionsApiSlice.endpoints.getAllCollections.select()

//!Creates memoized selector
const selectCollectionsData = createSelector(
    selectCollectionsResult,
    collectionResult => collectionResult.data // normalized state object with ids & entities
)

//!getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCollections,
    selectById: selectCollectionsById,
    // Pass in a selector that returns the posts slice of state
} = collectionsAdapter.getSelectors(state => selectCollectionsData(state) ?? initialState)



