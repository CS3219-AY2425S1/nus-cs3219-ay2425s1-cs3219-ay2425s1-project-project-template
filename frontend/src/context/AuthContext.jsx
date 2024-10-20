// // src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authTokens, setAuthTokens] = useState(() =>
//     localStorage.getItem("authTokens")
//       ? JSON.parse(localStorage.getItem("authTokens"))
//       : null
//   );
//   const [user, setUser] = useState(() =>
//     localStorage.getItem("authTokens")
//       ? jwt_decode(localStorage.getItem("authTokens"))
//       : null
//   );
//   const navigate = useNavigate();

//   const loginUser = async (username, password) => {
//     // Implement your login logic here
//     // On successful login:
//     // setAuthTokens(response.data);
//     // setUser(jwt_decode(response.data.access));
//     // localStorage.setItem("authTokens", JSON.stringify(response.data));
//   };

//   const logoutUser = () => {
//     setAuthTokens(null);
//     setUser(null);
//     localStorage.removeItem("authTokens");
//     navigate("/login");
//   };

//   useEffect(() => {
//     if (authTokens) {
//       setUser(jwt_decode(authTokens.access));
//     }
//   }, [authTokens]);

//   return (
//     <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
