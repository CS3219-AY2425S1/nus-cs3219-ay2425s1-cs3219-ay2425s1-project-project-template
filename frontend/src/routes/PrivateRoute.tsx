import { useContext, useEffect } from "react";
import {Outlet, Navigate} from "react-router-dom"
import { AuthContext, authState } from "../hooks/AuthContext";

export default function PrivateRoute() {
    const {isAuthenticated} = useContext(AuthContext);
    if (isAuthenticated == authState.LOADING) return null
    return isAuthenticated == authState.TRUE? <Outlet/> : <Navigate to="/login" replace/>
}