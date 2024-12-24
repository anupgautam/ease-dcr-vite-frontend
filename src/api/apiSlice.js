import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../baseURL";
import { logOut } from "../api/RTK query/authSlice";


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
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        try {
            const refreshResult = await axios.post(`${BASE_URL}account/token/refresh/`, { refresh: Cookies.get('refresh') });
            if (refreshResult?.data) {
                Cookies.set('access', refreshResult.data.access);
                Cookies.set('refresh', refreshResult.data.refresh);

                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut());
                return;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            api.dispatch(logOut());
            return;
        }
    }

    return result;
};


export const apiSlice = createApi({
    reducerPath: "api", // optional
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'HODCR',
        'HOTourPlan',
        'TourPlan',
        'CompanyUsers',
        'CompanyAreas',
        'CompanyRoles',
        'CompanyUserRoles',
        'User',
        'Chemist',
        'Doctor',
        'Stockist',
        'Product',
        'ChemistDCR',
        'DoctorDCR',
        'DoctorAllDCR',
        'StockistDCR',
        'StockistAllDCR',
        'ChemistAllDCR',
        'ShiftWiseChemistDCR',
        'ShiftWiseStockistDCR',
        'ShiftWiseDoctorDCR',
        'Admins',
        'EventProviders',
        'Chats',
        'Groups',
        'Application',
        'Upload',
        'CompanyDivisions',
        'CompanyAreaWiseExpenses',
        'StockistOrderedProduct',
        'LowerLevelUsers',
        'ExpensesType',
        'Holiday',
        'Expense',
        'Sale',
        'Leave',
        'expenseApiSlice',
        'ChemistOrderedProduct',
        'StockistOrderedProducts',
        'Stat',
        'Reward',
        'Notifications',
        'Landing',
        'Account',
        'PrimarySale',
        'SecondarySale',
        'TourPlanValidity',
        'PostTourplan',
        'DoctorCall',
        'SuperAdmin'
    ],
    endpoints: (builder) => ({}),
});