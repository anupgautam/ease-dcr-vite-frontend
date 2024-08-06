import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from "axios";
import Cookies from "js-cookie";
import { setCredentials, logOut } from './authSlice'
import { BASE_URL } from '../../baseURL'

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = Cookies.get('access')
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.originalStatus === 401) {

        //! sending refresh token to get new access token

        const refreshResult = await axios.post(`${BASE_URL}/account/token/refresh`, { refresh: Cookies.get('refresh') })

        // 
        if (refreshResult?.data?.access) {
            Cookies.set('access', refreshResult.data.access);
            result = await baseQuery(args, api, extraOptions)
        }
        else {
            api.dispatch(logOut())
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'User',
        'HOTourPlan',
        'Target'],
    endpoints: builder => ({})
})