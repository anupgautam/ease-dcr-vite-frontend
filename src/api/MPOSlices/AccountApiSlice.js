
import { apiSlice } from "../apiSlice";



export const AccountApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        forgotPassword: builder.mutation({
            query: (forgotPwd) => {
                // forgotPwd.company_id = Cookies.get("company_id")

                return {
                    url: `account/forgot-password-otp/`,
                    method: 'POST',
                    body: forgotPwd,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Account']
        }),

        otpVerification: builder.mutation({
            query: (otpPackage) => {
                // otpPackage.company_id = Cookies.get("company_id")

                return {
                    url: `account/otp-verification/`,
                    method: 'POST',
                    body: otpPackage,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Account']
        }),

        newPassword: builder.mutation({
            query: (passwordPackage) => {
                // passwordPackage.company_id = Cookies.get("company_id")

                return {
                    url: `account/reset-password-otp/`,
                    method: 'POST',
                    body: passwordPackage,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Account']
        }),

        changePassword: builder.mutation({
            query: (changePass) => {
                // changePass.company_id = Cookies.get("company_id")

                return {
                    url: `account/change-password/`,
                    method: 'POST',
                    body: changePass,
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8',
                    }
                }
            },
            invalidatesTags: ['Account']
        }),
    })
})

//! Api hooks
export const {
    useForgotPasswordMutation,
    useOtpVerificationMutation,
    useNewPasswordMutation,
    useChangePasswordMutation,
} = AccountApiSlice

// returns the query result object
// export const selectAccountResult = AccountApiSlice.endpoints.getAllChemists.select()

// // Creates memoized selector
// const selectAccountData = createSelector(
//     selectAccountResult,
//     accountResult => accountResult.data // normalized state object with ids & entities
// )

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllChemists,
//     selectById: selectChemistById,
//     selectIds: selectIds
//     // Pass in a selector that returns the posts slice of state
// } = accountAdapter.getSelectors(state => selectAccountData(state) ?? initialState)