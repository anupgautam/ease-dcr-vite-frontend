import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

// import { Jsonconfig } from "../../constant/header";
import { checkDataType } from "../../reusable/utils/checkDataType";

const chatAdapter = createEntityAdapter()

const chatURL = 'chat/chat/'

const initialState = chatAdapter.getInitialState()

export const chatSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getChats: builder.query({
            query: () => chatURL,
            transformResponse: responseData => {
                return chatAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) =>
                [
                    { type: 'Chats', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'Chats', id }))
                ]
        }),
        getChatsById: builder.query({
            query: () => chatURL,
            transformResponse: responseData => {
                return chatAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) =>
                [
                    { type: 'Chats', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'Chats', id }))
                ]
        }),
        getChatsByUser: builder.mutation({
            query: (chat) => {
                return {
                    url: `/chat/chat/get_my_chat/`,
                    method: 'POST',
                    body: chat,
                }
            },

            providesTags: (result, error, arg) =>
                [
                    { type: 'Chats', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'Chats', id }))
                ]
        }),
        addChat: builder.mutation({
            query: (chat) => {

                return {
                    url: chatURL,
                    method: 'POST',
                    body: chat,
                }
            },
            transformResponse: responseData => {
                if (checkDataType(responseData) === "object") {
                    return responseData;
                }
                else if (checkDataType(responseData) === "array") {

                    return responseData[0];
                }
                else {
                    return responseData;
                }
            },
            invalidatesTags: ['Chats']
        }),
        getChatList: builder.mutation({
            query: (chat) => {
                return {
                    url: `/chat/user-chat/`,
                    method: 'POST',
                    body: chat,
                }
            }
        }),

        updateChat: builder.mutation({

            query: (updateChat) => {
                return {
                    url: `${chatURL}${updateChat.get('id')}/`,
                    method: 'PATCH',
                    body: updateChat
                }
            },
            invalidatesTags: ['Chats']
        }),
        deleteChat: builder.mutation({
            query: (id) => {
                return {
                    url: `${chatURL}${id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Chats']
        }),
    })
})

export const {
    useGetChatsQuery,
    useAddChatMutation,
    useUpdateChatMutation,
    useDeleteChatMutation,
    useGetChatsByIdQuery,
    useGetChatListMutation,
    useGetChatsByUserMutation
} = chatSlice

// returns the query result object
export const selectChatsResult = chatSlice.endpoints.getChats.select()

// Creates memoized selector
const selectChatssData = createSelector(
    selectChatsResult,
    chatsResult => chatsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChats,
    selectById: selectChatById,
    // Pass in a selector that returns the posts slice of state
} = chatAdapter.getSelectors(state => selectChatssData(state) ?? initialState)
