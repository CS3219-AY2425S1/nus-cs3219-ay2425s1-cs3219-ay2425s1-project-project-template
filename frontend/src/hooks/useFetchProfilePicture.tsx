import { Dispatch, SetStateAction } from 'react';
import apiConfig from '../config/config';
import { User } from '../types/User';

const useFetchProfilePicture = async (userId: string, setUser: Dispatch<SetStateAction<User | undefined>>) => {
    if (userId == "") {
        console.error("UserId is empty, likely not logged in");
        return;
    }
    try {
        const response = await fetch(`${apiConfig.profilePictureServiceUserUrl}/${userId}/profile-picture`, {
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": `${apiConfig.profilePictureServiceUserUrl}`,
            },
        });

        if (!response.ok) {
        throw new Error('Failed to fetch image');
        }

        const result = await response.json();
        const url : string = result.imageUrl;
        setUser((prevUser) => {
            if (!prevUser) {
                return prevUser; 
            }
        
            return {
                ...prevUser,
                profilePictureUrl: url, 
            };
        });
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};


export default useFetchProfilePicture;
