import React, { useState, useEffect } from 'react';
import useFetchProfilePicture from '../../hooks/useFetchProfilePicture';
interface ProfilePictureProps {
    userId: string;
    openProfilePicModal : () => void
  }
const ProfilePicture: React.FC<ProfilePictureProps> = ({userId}, openProfilePicModal) => {
    const [imageData, setImageData] = useState<string>("");
    const [uid, setUid] = useState("");

    useEffect(() => {
        if (uid == "") {
            setUid(userId);
        }
    })

    useEffect(() => {
        fetchImage();
    }, [uid]);

    const fetchImage = () => {
        useFetchProfilePicture(uid, setImageData);
    }


    return (
    <div>
        {imageData ? (
        <div className='grid justify-center'>
            <img className="rounded-full" style={{ width: '250px', height: '250px', objectFit: 'cover' }} src={imageData} alt="Fetched" />
        </div>
        ) : (
        <p>Loading image...</p>
        )}

        <button
            onClick={() => openProfilePicModal()}
            className="bg-gray-500 rounded-lg p-4 text-2xl hover:bg-gray-300 col-span-1"
            >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 3.732z" />
            </svg>
        </button>
        
    </div>
    );
}

export default ProfilePicture;