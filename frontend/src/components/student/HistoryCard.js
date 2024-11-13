import React from "react";
import defaultProfilePicture from "../../assets/default-profile-picture.jpg";
import { useNavigate } from "react-router-dom";

const HistoryCard = ({ sessionData, userImage }) => {
  const navigate = useNavigate();
  
  // To render viewHistory page
  const handleSessionClick = () => {
    navigate(`/history/${sessionData?.roomId}`, { state: { sessionData } });
  };

  return (
    <div 
      onClick={handleSessionClick} // Wrap the function call in an arrow function
      className="cursor-pointer relative flex items-center bg-gray-800 rounded-lg p-4 my-2 hover:bg-opacity-80 transition duration-200"
    >
      {/* Background Image */}
      <div
        className="w-full h-32 rounded-lg bg-cover bg-center flex justify-between items-center text-white p-4"
        // style={{
        //   backgroundImage: `url(${questionImage || defaultBackground})`,
        //   backgroundSize: "cover", // Ensures the image covers the container
        //   backgroundPosition: "center", // Centers the imagie
        // }}
      >
        {/* Topic and Difficulty */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white"> {sessionData?.question?.title}</h1>
          <h2 className="text-xl">{sessionData?.question?.category.join(", ") || "-"}</h2>
          <p className="text-lg">{sessionData?.question?.complexity || "-"}</p>
        </div>
        
        {/* Date */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 text-md text-center">
          <p>Date: {sessionData?.startDate ? new Date(sessionData?.startDate).toLocaleDateString() : "-"}</p>
        </div>
        
        {/* User Image */}
        <div className="w-16 h-16 rounded-full bg-white overflow-hidden ml-4">
          <img src={userImage || defaultProfilePicture} alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
