import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    User_id: '',
    access: '',
    refresh: '',
    company_division_name: '',
    company_id: '',
    company_user_id: '',
    company_user_role_id: '',
    email: '',
    is_highest_priority: '',
    user_role: '',
    role: '',
    other: '',
    otherRoles: '',
    OTPgmail: '',
    otp: '',
    roles: "",
    company_area_id: "",
};

export const cookieSlice = createSlice({
    name: 'cookie',
    initialState,
    reducers: {
        setCookie: (state, action) => {
            return { ...state, ...action.payload };
        },
        setUserRole: (state, action) => {
            state.roles = action.payload;
        },
        clearCookie: () => initialState,
    },
});

export const { setCookie, clearCookie, setUserRole } = cookieSlice.actions;
export default cookieSlice.reducer;