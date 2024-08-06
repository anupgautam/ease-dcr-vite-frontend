import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";

const notificationAPI = '/chat/notification/';

const notificationAdapter = createEntityAdapter();

const initialState = notificationAdapter.getInitialState();

export const notificationSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get Notifications 
        getNotifications: builder.query({
            query: () => notificationAPI,
            transformResponse: responseData => {
                return notificationAdapter.setAll(initialState, responseData)
            },
            providesTags: (result, error, arg) =>
                [
                    { type: 'Notifications', id: "LIST" },
                    ...result.ids.map(id => ({ type: 'Notifications', id }))
                ]
        }),

        //! Get paginated notifications 
        getNotificationsPaginated: builder.query({
            query: (page) => `/chat/notification-paginated/?page=${page}`,
            providesTags: ['Notifications']
        }),

        //! Get Notifications by Id 
        getNotificationsById: builder.query({
            query: (id) => ({
                url: `${notificationAPI}${id}/`,
                method: 'GET',
            }),
            providesTags: ['Notifications']
        }),

        //! Get Notifications By User Id 
        getNotificationsByUserId: builder.query({
            query: (id) => ({
                url: `${notificationAPI}?picnic_service_provider_id=${id}`,
                method: 'GET',
            }),
            transformResponse: responseData => {
                return notificationAdapter.setAll(initialState, responseData)
            },
            providesTags: ['Notifications']
        }),

        //! Get Picnic Date By User 
        getPicnicDateByUser: builder.mutation({
            query: (id) => {

                return {
                    url: `/picnic/picnic-date/user_picnic_package_date/`,
                    method: 'POST',
                    body: { 'user': id },
                }
            },
            // transformResponse: responseData => {
            //     return miscRentAdapter.setAll(initialState, responseData)
            // },
            // providesTags: ['']
        }),

        //! Add Notification 
        addNotification: builder.mutation({
            query: (notification) => {
                return {
                    url: notificationAPI,
                    method: 'POST',
                    body: notification,
                }
            },
            invalidatesTags: ['Notifications']
        }),

        //! Update Notification 
        updateNotification: builder.mutation({
            query: (updateNotification) => {

                return {

                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',

                    },
                    url: `${notificationAPI}${updateNotification['data']['id']}/`,
                    method: 'PATCH',
                    body: updateNotification['data']
                }
            },
            invalidatesTags: ['Notifications'],
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getNotifications', id, (draft) => {
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

        //! Delete Notification 
        deleteNotification: builder.mutation({
            query: (id) => {

                return {
                    url: `${notificationAPI}${id.id}/`,
                    method: 'DELETE',
                    body: id
                }
            },
            invalidatesTags: ['Notifications']
        }),

        //! Get Notification List by id 
        getNotificationListById: builder.query({
            query: (id) => ({
                url: `/chat/general-notification/?general_notification_receiver=${id}`,
                method: "GET"
            }),
            providesTags: ['Notifications']
        }),

        //! patch notification List by Id
        patchNotificationListById: builder.mutation({
            query: (id) => {
                return {
                    url: `/chat/general-notification/${id.id}/`,
                    method: 'PATCH',
                    body: id,
                }
            },
            invalidatesTags: ['Notifications']
        })
    })
})

export const {
    useGetNotificationsQuery,
    useGetPicnicDateByUserMutation,
    useAddNotificationMutation,
    useUpdateNotificationMutation,
    useDeleteNotificationMutation,
    useGetNotificationsByIdQuery,
    useGetNotificationsByUserIdQuery,
    useGetNotificationListByIdQuery,
    useGetNotificationsPaginatedQuery,
    usePatchNotificationListByIdMutation,
} = notificationSlice

// returns the query result object
export const selectNotificationsResult = notificationSlice.endpoints.getNotifications.select()

// Creates memoized selector
const selectNotificationssData = createSelector(
    selectNotificationsResult,
    notificationsResult => notificationsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotifications,
    selectById: selectNotificationById,
    // Pass in a selector that returns the posts slice of state
} = notificationAdapter.getSelectors(state => selectNotificationssData(state) ?? initialState)



