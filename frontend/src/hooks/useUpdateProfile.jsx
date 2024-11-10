import { useState } from "react";
import { useCookies } from "react-cookie";

const useUpdateProfile = () => {
    const [isLoading, setLoading] = useState(false);
    const [isInvalidUpdate, setIsInvalidUpdate] = useState(false);
    const [cookies, setCookie] = useCookies([ "username", "accessToken", "userId" ]);

    const VITE_USER_SERVICE_API = import.meta.env.VITE_USER_SERVICE_API || 'http://localhost/api/users';

    const handleUpdateProfile = async (username, email, password) => {
        setLoading(true);
        setIsInvalidUpdate(false);
        try {
            const response = await fetch(`${VITE_USER_SERVICE_API}/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register');
            }
            const data = await response.json();
            setCookie( "username", data["data"]["username"], { path: '/' } );
            setCookie( "userId", data["data"]["id"], { path: '/' } );
            console.log(data);
            console.log(`successfully updated ${email}`);
        } catch (error) {
            setIsInvalidUpdate(true);
            setLoading(false);
            console.log(error);
            alert(error); 
        }
    }
    return {
        handleUpdateProfile,
        isLoading,
        isInvalidUpdate,
    };
}

export default useUpdateProfile;