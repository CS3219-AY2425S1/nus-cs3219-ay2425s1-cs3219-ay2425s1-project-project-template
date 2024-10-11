import { Dispatch, SetStateAction, useEffect } from "react";
import { User } from "../types/User";
import apiConfig from "../config/config";

const useRetrieveUser = (
    setUser: Dispatch<SetStateAction<User | undefined>>
) => {
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${apiConfig.userServiceAuthUrl}/verify-token`, {
                mode: "cors",
                headers: {
                    "Access-Control-Allow-Origin": `${apiConfig.userServiceBaseUrl}`,
                    // Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDEwNDZhNWUwZGFhODQzNmEyMjRlNSIsImlhdCI6MTcyODYxMjIyNiwiZXhwIjoxNzI4Njk4NjI2fQ.05NJAatEoT0JcwOUtP4UShFxfISuIpnzKIfRFwGqghk`
                },
            });
            const result = await response.json();
            const userData = result.data;
            console.log("Retrieved user data:", userData);
            if (userData == undefined) {
                console.log("User data undefined, API response:", result);
            }
            setUser(userData);
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    // do i need auto fetch the user on mount?
    useEffect(() => {
        console.log("fetching user data");
        fetchUserData();
    }, []);

    return fetchUserData;
};

export default useRetrieveUser;
