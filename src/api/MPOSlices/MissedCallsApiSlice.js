

import { apiSlice } from "../apiSlice";


export const MissedCallSlices = apiSlice.injectEndpoints({
    endpoints: builder => ({

        //! Get all MissedCalls
        // getAllMissedCalls: builder.query({
        //     query: (page) => ({
        //         url: `mpo/company-mpo-tour-plan/get_missed_calls/`,
        //         method: 'GET'
        //     }),
        //     providesTags: ['MissedCall']
        // }),

        //! Search MPO filter wala
        searchMPOMissedCall: builder.mutation({
            query: (FilteredData) => {
                const { roleId, monthData } = FilteredData;
                return {
                    // url: `mpo/company-mpo-tour-plan/get_missed_calls/?month=${monthData}&company_id=${companyId}&role_id=${roleId}`,
                    url: `/mpo/company-mpo-tour-plan/?id=${roleId}&tour_plan__tour_plan__select_the_month=${monthData}&tour_plan__tour_plan__is_dcr_added=false&is_approved=true`,
                    method: 'POST',
                    // body: FilteredData
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['MissedCall']
        }),

        //! Search Higher Order filter wala
        searchHighterOrderMissedCall: builder.mutation({
            query: (FilteredData) => {
                return {
                    url: `other-roles/higher-order-tour-plan/get_higher_order_missed_tourplans/`,
                    method: 'POST',
                    // body: FilteredData
                    // body: { ...FilteredData },
                }
            },
            invalidatesTags: ['MissedCall']
        }),
        getMissedDataByMpo: builder.query({
            query: (id) => ({
                url: `/stat/mpo-missed-call/?mpo_name=${id.mpo_name}&company_name=${id.company_name}&month=${id.month}&year=${id.year}`,
                method: 'GET',
            }),
            providesTags: ['MissedCall'],
        }),
    })
})

export const {
    // useGetAllMissedCallsQuery,
    useSearchMPOMissedCallMutation,
    useSearchHighterOrderMissedCallMutation,
    useGetMissedDataByMpoQuery
} = MissedCallSlices

// //! returns the query result object
// export const selectMissedCallsResult = MissedCallSlices.endpoints.getAllMissedCalls.select()

// //!Creates memoized selector
// const selectMissedCallsData = createSelector(
//     selectMissedCallsResult,
//     missedcallsResult => missedcallsResult.data
// )

// //!getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllMissedCalls,
//     selectById: selectMissedCallsById,
//     selectIds: selectIds
// } = missedcallsSlice.getSelectors(state => selectMissedCallsData(state) ?? initialState)



