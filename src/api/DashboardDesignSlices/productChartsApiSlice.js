import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';
import { BASE_URL } from '../../baseURL'

export const productChartsApiSlice = createApi({
    reducerPath: 'productChartsApiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['ProductChart'],
    endpoints: (builder) => ({

        //! GET products Chart
        getAllProdutsNoOrderChart: builder.query({
            query: () => (
                {
                    url: 'productpiechart/',
                    method: 'GET'
                }),
            providesTags: ['ProductChart']
        }),

        //! GET products Chart
        getAllProdutsChart: builder.query({
            query: () => (
                {
                    url: 'wcwins/',
                    method: 'GET'
                }),
            providesTags: ['ProductChart']
        }),

        // ! GET Expenses Chart
        getAllExpensesChart: builder.query({
            query: () => (
                {
                    url: 'expenses/',
                    method: 'GET'
                }),
            providesTags: ['ProductChart']
        }),

        // ! GET Expenses Chart
        getAllOrderListChart: builder.query({
            query: () => (
                {
                    url: 'tabledata/',
                    method: 'GET'
                }),
            providesTags: ['ProductChart']
        })


    })
})

//! Api hooks
export const {
    useGetAllProdutsNoOrderChartQuery,
    useGetAllProdutsChartQuery,
    useGetAllExpensesChartQuery,
    useGetAllOrderListChartQuery
} = productChartsApiSlice;