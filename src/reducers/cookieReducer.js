// userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getCookieData = (cookieName, defaultValue = '') => {
    return Cookies.get(cookieName) || defaultValue;
};

const initialState = {
    User_id: getCookieData('User_id'),
    access: getCookieData('access'),
    refresh: getCookieData('refresh'),
    company_division_name: getCookieData('company_division_name'),
    company_id: getCookieData('company_id'),
    company_user_id: getCookieData('company_user_id'),
    company_user_role_id: getCookieData('company_user_role_id'),
    email: getCookieData('email'),
    is_highest_priority: getCookieData('is_highest_priority'),
    user_role: getCookieData('user_role'),
    role: getCookieData('role'),
    other: getCookieData('other'),
    otherRoles: getCookieData('otherRoles'),
    OTPgmail: getCookieData('OTPgmail'),
    otp: getCookieData('otp'),
};

export const cookieSlice = createSlice({
    name: 'cookie',
    initialState,
    reducers: {
        setCookie: (state, action) => {
            state.User_id = action.payload.User_id;
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
            state.company_division_name = action.payload.company_division_name;
            state.company_id = action.payload.company_id;
            state.company_user_id = action.payload.company_user_id;
            state.company_user_role_id = action.payload.company_user_role_id;
            state.email = action.payload.email;
            state.is_highest_priority = action.payload.is_highest_priority;
            state.user_role = action.payload.user_role;
            state.role = action.payload.role;
            state.other = action.payload.other;
            state.otherRoles = action.payload.otherRoles;
            state.OTPgmail = action.payload.OTPgmail;
            state.otp = action.payload.otp;
        },
        clearCookie: (state) => {
            state.User_id = ''
            state.access = ''
            state.refresh = ''
            state.company_division_name = ''
            state.company_id = ''
            state.company_user_id = ''
            state.company_user_role_id = ''
            state.email = action.payload.email;
            state.is_highest_priority = ''
            state.user_role = ''
            state.role = ''
            state.other = ''
            state.otherRoles = ''
            state.OTPgmail = ''
            state.otp = ''
        },
    },
});

export const { setCookie, clearCookie } = cookieSlice.actions;
export default cookieSlice.reducer;
