import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const user = useSelector(state => state.auth);
    console.log(user)
    const isAuth = useSelector(state => state.auth.isLoggedIn);
    // console.log(isAuth);
    return isAuth ? children : <Navigate to="/login" />;

}

export default ProtectedRoutes