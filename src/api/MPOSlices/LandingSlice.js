

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

//! returns the query result object
// export const selectLandingsResult = LandingSlice.endpoints.getAllLandings.select()

//!Creates memoized selector
// const selectLandingsData = createSelector(
//     selectLandingsResult,
//     landingResult => landingResult.data // normalized state object with ids & entities
// )

//!getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllLandings,
//     selectById: selectLandingsById,
//     selectIds: selectIds
//     // Pass in a selector that returns the posts slice of state
// } = landingAdapter.getSelectors(state => selectLandingsData(state) ?? initialState)



