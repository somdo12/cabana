import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
    const user = JSON.parse(localStorage.getItem("user")); 

    
    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children; 
}

export default PrivateRoute;
