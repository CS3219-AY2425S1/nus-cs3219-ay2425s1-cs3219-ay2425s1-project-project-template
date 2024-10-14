import React, { useEffect, useState } from "react";
import useFetchProfilePicture from "../hooks/useFetchProfilePicture";

interface ProfileButtonProps {
  userId: string;
}
const ProfileButton: React.FC<ProfileButtonProps> = ({userId}) => {

  const [imageData, setImageData] = useState<string>("");

  useEffect(() => {
    if (userId != "")
      fetchImage();
  }, [userId])




  const fetchImage = () => {
      useFetchProfilePicture(userId, setImageData);
  }

  
  return (
    <>
      <div className="container">
                    {imageData ? (
                        <>
                            <div className=''>
                              <img className="rounded-full" style={{ width: '50px', height: '50px'}} src={imageData} alt="Fetched" />
                            </div>
                    </>
                    ) : (
                        <p>Loading image...</p>
                    )}
      </div>
    </>
  );
};

export default ProfileButton;
