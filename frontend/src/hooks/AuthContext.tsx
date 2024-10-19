import axios from "axios"
import { SetStateAction, Dispatch, createContext, useState, ReactNode, useEffect } from "react"

export type User = {
    name: String
}

export enum authState{
    LOADING,
    FALSE,
    TRUE
}

export interface AuthContextInterface {
    user: User,
    isAuthenticated : authState,
    setUser: Dispatch<SetStateAction<User>>,
    setIsAuthenticated: Dispatch<SetStateAction<authState>>
}

const defaultState = {
    user : {
        name: ""
    },
    isAuthenticated: authState.LOADING,
    setUser: (user : User) => {},
    setIsAuthenticated: (isAuth: authState) => {}
} as AuthContextInterface

export const AuthContext = createContext(defaultState)

type ContextProviderNode = {
    children: ReactNode
}

export default function AuthContextProvider({children} : ContextProviderNode) {
    const [user, setUser] = useState<User>({name: ""});
    const [isAuthenticated, setIsAuthenticated] = useState(authState.LOADING)

    useEffect(() => {
        axios.get(`http://localhost:${process.env.REACT_APP_USER_SVC_PORT}/auth/verify-token`, {
            withCredentials: true   
        })
        .then((response) => {
            setIsAuthenticated(authState.TRUE);
            setUser({name: response.data.data.username});
        })
        .catch((error) => {
            setIsAuthenticated(authState.FALSE);
            setUser({name: ""})
        });
    }, [])

    return (    
        <AuthContext.Provider value={{user, isAuthenticated, setUser, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}