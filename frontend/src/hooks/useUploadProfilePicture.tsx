import { Dispatch, SetStateAction } from 'react';
import apiConfig from '../config/config';
import useFetchProfilePicture from './useFetchProfilePicture';

const useUploadProfilePicture = async (userId: string, file: File, setImageData: Dispatch<SetStateAction<string>>, setErr: Dispatch<SetStateAction<string | undefined>> ) => {
    if (!file) {
        alert('Please select a file to upload.');
        return;
      }
  
    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data

    try {
        const response = await fetch(`${apiConfig.profilePictureServiceUserUrl}/${userId}/profile-picture`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": `${apiConfig.profilePictureServiceUserUrl}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            setErr(err.message);
            throw new Error('Failed to fetch image');
        }
        useFetchProfilePicture(userId, setImageData);
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};

export default useUploadProfilePicture;
