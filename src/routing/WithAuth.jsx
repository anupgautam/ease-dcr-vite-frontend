import React from "react";
import { Navigate } from "react-router-dom";

const WithAuth = (WrappedComponent, redirectPath = '/login') => {
    const AuthWrapper = (props) => {
        // if(!token){
        //     return <Navigate to={redirectPath}/>
        // }
        return <WrappedComponent {...props} />
    }
    return AuthWrapper;
}
export default WithAuth;
