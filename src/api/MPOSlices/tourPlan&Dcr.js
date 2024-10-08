import { apiSlice } from "../apiSlice";


export const NewTourplanSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        addTourplan: builder.mutation({
            query: value => {
                return {
                    url: '/mpo/company-mpo-tour-plan/',
                    method: 'POST',
                    body: value,
                };
            },
            invalidatesTags: ['Tourplan', 'User'],
        }),
        addHigherTourPlan: builder.mutation({
            query: value => {
                return {
                    url: "/other-roles/higher-order-tour-plan/",
                    method: 'POST',
                    body: value,
                }
            },
            invalidatesTags: ['Tourplan', 'User', 'HOTourPlan'],
        }),
        getHigherOrderTourPlanUsingId: builder.query({
            query: (value) => {
                return {
                    url: `/other-roles/higher-order-tour-plan/get_tour_plan/?user_id=${value}`,
                    method: 'GET',
                };
            },
            invalidatesTags: ['PostTourplan'],
        }),
        addHigherOrderDcr: builder.mutation({
            query: value => {
                return {
                    url: '/other-roles/higher-order-dcr/',
                    method: 'POST',
                    body: value,
                };
            },
            invalidatesTags: ['PostTourplan', 'HODCR'],
        }),
        postToGetTheTourPlan: builder.query({
            query: value => {
                return {
                    url: `/mpo/company-mpo-tour-plan-get-tour-plan-mpo/?mpo_name=${value}&year=2081&month=Ashwin`,
                    method: 'GET',
                };
            },
            providesTags: ['PostTourplan'],
        }),

        createDcrWithNullValuesForDoctor: builder.mutation({
            query: value => ({
                url: '/dcr/dcr-for-doctor/',
                method: 'POST',
                body: value,
            }),
            invalidatesTags: ['PostTourplan', 'DoctorDCR'],
        }),
        createDcrForChemistWithNullValues: builder.mutation({
            query: (value) => ({
                url: '/dcr/dcr-for-chemist/',
                method: 'POST',
                body: value
            }),
            invalidatesTags: ['PostTourplan', 'ChemistDCR']
        }),
        createDcrForStockistWithNullValues: builder.mutation({
            query: (value) => {
                return {
                    url: `/dcr/dcr-for-stockist/`,
                    method: 'POST',
                    body: value,
                }
            },
            invalidatesTags: ['PostTourplan', 'StockistDCR']
        }),
        updateDcrForDoctorValues: builder.mutation({
            query: (value) => {
                return {
                    url: `/dcr/dcr-for-doctor-product-reward-role/${value.id}/`,
                    method: 'PATCH',
                    body: value.value,
                }
            },
            invalidatesTags: ['PostTourplan', 'DoctorDCR']
        }),
        updateDcrForChemistValues: builder.mutation({
            query: (value) => {
                return {
                    url: `/dcr/dcr-for-chemist-product-rewards-roles/${value.id}/`,
                    method: 'PATCH',
                    body: value.value,
                }
            },
            invalidatesTags: ['PostTourplan', 'ChemistDCR']
        }),
        createMpoShiftWiseDcrForDoctor: builder.mutation({
            query: value => ({
                url: '/dcr/mpo-shift-wise-dcr-for-doctor/',
                method: 'POST',
                body: value,
            }),
            invalidatesTags: ['PostTourplan', 'DoctorDCR'],
        }),

        createMpoShiftWiseDcrForChemist: builder.mutation({
            query: value => ({
                url: '/dcr/mpo-shift-wise-dcr-for-chemist/',
                method: 'POST',
                body: value,
            }),
            invalidatesTags: ['PostTourplan', 'ChemistDCR'],
        }),


        addOrderedProductInformationChemist: builder.mutation({
            query: (value) =>
            ({
                url: '/dcr/dcr-for-chemist-ordered-product-information/',
                method: 'POST',
                body: value
            }),
            invalidatesTags: ['PostTourplan', 'ChemistDCR']
        }),
        createDcrForChemistwithShiftMpo: builder.mutation({
            query: (value) => ({
                url: '/dcr/mpo-shift-wise-dcr-for-chemist/',
                method: 'POST',
                body: value
            }),
            invalidatesTags: ['PostTourplan', 'ChemistDCR']
        }),
        updateDcrForStockist: builder.mutation({
            query: (IdValue) => {
                return {
                    url: `/dcr/dcr-for-stockist-product-rewards-roles/${IdValue.id}/`,
                    method: 'PATCH',
                    body: IdValue.value,
                }
            },
            invalidatesTags: ['PostTourplan', 'StockistDCR']
        }),
        addDcrForStockistWithShiftMpo: builder.mutation({
            query: (value) => {
                return {
                    url: `/dcr/mpo-shift-wise-dcr-for-stockist/`,
                    method: 'POST',
                    body: value,
                }
            },
            invalidatesTags: ['PostTourplan', 'StockistDCR']
        }),
        getStatDataofDcrByUser: builder.mutation({
            query: (value) => {
                return {
                    url: `/stat/get-mpo-data/`,
                    method: 'POST',
                    body: value,
                }
            },
            invalidatesTags: ['PostTourplan']
        }),
        getStatDataofDcrByHigherUser: builder.mutation({
            query: (value) => {
                return {
                    url: `/stat/get-higher-order-data/`,
                    method: 'POST',
                    body: value,
                }
            },
            invalidatesTags: ['PostTourplan']
        }),
    })
})

export const {
    useAddTourplanMutation,
    useAddHigherTourPlanMutation,
    useGetHigherOrderTourPlanUsingIdQuery,
    useAddHigherOrderDcrMutation,

    usePostToGetTheTourPlanMutation,

    useCreateDcrWithNullValuesForDoctorMutation,
    useCreateDcrForChemistWithNullValuesMutation,
    useCreateDcrForStockistWithNullValuesMutation,

    useUpdateDcrForDoctorValuesMutation,
    useUpdateDcrForChemistValuesMutation,
    useUpdateDcrForStockistMutation,

    useCreateMpoShiftWiseDcrForDoctorMutation,
    useCreateMpoShiftWiseDcrForChemistMutation,

    useAddOrderedProductInformationChemistMutation,
    useCreateDcrForChemistwithShiftMpoMutation,
    useAddDcrForStockistWithShiftMpoMutation,

    usePostToGetTheTourPlanQuery,

    useGetStatDataofDcrByUserMutation,
    useGetStatDataofDcrByHigherUserMutation
} = NewTourplanSlice;
