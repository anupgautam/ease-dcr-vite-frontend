import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { BASE_URL } from "../../baseURL";

export const mpoTourPlanApiSlice = createApi({
    reducerPath: 'mpoTourPlanApiSlice',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['MPO_Plan'],
    endpoints: (builder) => ({


        // ! Get all the MPO Tour data
        getAllMpos: builder.query({
            query: () => ({
                url: 'tourplan/',
                method: 'GET'
            }),
            providesTags: ['MPO_Plan']
        }),

        // ! Get MPOS by id
        getMposById: builder.query({
            query: (id) => {
                // 
                return {
                    url: `tourplan/${id}/`,
                    method: 'GET',
                }
            },
            providesTags: ['MPO_Plan']
        }),

        // ! POST MPOS wala
        createMpos: builder.mutation({
            query: (newMpos) => {
                newMpos.access = Cookies.get("access")
                
                return {
                    url: `tourplan/`,
                    method: 'POST',
                    body: newMpos,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['MPO_Plan']
        }),

        // ! POST calandar wala
        createHolidays: builder.mutation({
            query: (newHolidays) => {
                
                return {
                    url: `date/date/`,
                    method: 'POST',
                    body: newHolidays,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['MPO_Plan']
        }),



        // ! Update MPO data by id
        updateMpos: builder.mutation({
            query: (updateMpos) => {
                
                return {
                    url: `tourplan/${updateMpos.id}/`,
                    method: 'PUT',
                    body: updateMpos,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['MPO_Plan']
        })
    })
})

export const {
    useGetAllMposQuery,
    useGetMposByIdQuery,
    useCreateMposMutation,
    useCreateHolidaysMutation,
    useUpdateMposMutation,
} = mpoTourPlanApiSlice