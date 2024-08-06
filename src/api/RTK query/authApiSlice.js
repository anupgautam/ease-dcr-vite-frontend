import { apiSlice } from "../apiSlice";
import { BASE_URL } from '../../baseURL'

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: `${BASE_URL}/account/user-login/`,
                method: 'POST',
                body: { ...credentials }
            })
        }),
    })
})

export const {
    useLoginMutation,
} = authApiSlice