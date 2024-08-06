import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { BASE_URL } from "../../baseURL";

import { apiSlice } from "../apiSlice";

const loginAdapter = createEntityAdapter()
const initialState = loginAdapter.getInitialState()

export const loginSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        loginUser: builder.mutation(
            {
                query: (loginInfo) => {
                    // 
                    return {
                        url: '/account/user-login/',
                        method: 'POST',
                        body: loginInfo
                    }
                },
                invalidatesTags: ['User']
            })
    })
})

export const {
    useLoginUserMutation
} = loginSlice