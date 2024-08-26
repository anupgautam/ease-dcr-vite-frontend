import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import WithAuth from "./WithAuth";

const Authentication = WithAuth(({ component: Component, allowRoles, ...rest }) => {
    const userRole = Cookies.get('user_role');

    if (allowRoles && !allowRoles.includes(userRole)) {
        return <Navigate to='/login' />
    }
    return <Component {...rest} />
})


export default Authentication;