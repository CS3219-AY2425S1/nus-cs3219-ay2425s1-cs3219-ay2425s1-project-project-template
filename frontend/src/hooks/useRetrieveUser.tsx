import { Dispatch, SetStateAction, useEffect } from "react";
import { User } from "../types/User";
import { UserResponse } from "../types/UserResponse";
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
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDEwNDZhNWUwZGFhODQzNmEyMjRlNSIsImlhdCI6MTcyODc5MDAxMSwiZXhwIjoxNzI4ODc2NDExfQ.NZWc0oAtk540XI4nIjytHto4oDceitRYiuE_GZnAcZg`
                },
            });
            const result: UserResponse = await response.json();
            const userData = result.data;
            if (userData == undefined) {
                console.log("User data undefined, API response:", result);
            }
            setUser(userData);
        } catch (error) {
            console.log("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return fetchUserData;
};

export default useRetrieveUser;
