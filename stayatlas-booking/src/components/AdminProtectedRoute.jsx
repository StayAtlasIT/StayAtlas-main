import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({children}) => {
    const user = useSelector(state => state.auth);
    console.log(user)
    const isAuth = useSelector(state => state.auth.role);
    // console.log(isAuth);
    return isAuth === "admin" ? children : <Navigate to="/" />;

}

export default AdminProtectedRoute