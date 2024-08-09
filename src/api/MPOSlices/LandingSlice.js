import { apiSlice } from "../apiSlice";

export const LandingSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! POST landing   
        createLandings: builder.mutation({
            query: (newLanding) => {
                return {
                    url: `support/contact-us/`,
                    method: 'POST',
                    body: newLanding,
                }
            },
            invalidatesTags: ['Landing']
        }),
    })
})

export const {
    useCreateLandingsMutation,
} = LandingSlice



