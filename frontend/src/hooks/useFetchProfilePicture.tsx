import { Dispatch, SetStateAction } from 'react';
import apiConfig from '../config/config';

const useFetchProfilePicture = async (userId: string, setImageData: Dispatch<SetStateAction<string>>) => {
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
        setImageData(url);
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};


export default useFetchProfilePicture;
