import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import WithAuth from "./WithAuth";
import { CookieContext } from '@/App'


const Authentication = WithAuth(({ component: Component, allowRoles, ...rest }) => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const userRole = user_role;

    // if (!token) {
    //     return <Navigate to='/login' />;
    // }
    if (allowRoles && !allowRoles.includes(userRole)) {
        return <Navigate to='/login' />
    }
    return <Component {...rest} />
})


export default Authentication;