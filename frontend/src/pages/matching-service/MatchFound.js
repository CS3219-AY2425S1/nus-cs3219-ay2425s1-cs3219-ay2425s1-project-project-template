// Author(s): Andrew, Xinyi
import React, { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { apiGatewaySocket } from "../../config/socket";

function MatchFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    apiGatewaySocket.on("readyForCollab", (data) => {
      navigate("/collaboration", { state: { data: data } });
    });

    return () => {
      apiGatewaySocket.off("readyForCollab");
    };
  }, [navigate]);

  // if match data does not exist
  if (!location.state) {
    console.log("Unauthorized access to match found page, redirecting to criteria selection");
    return (
      <Navigate to="/matching/select" />
    );
  }
  // if match data exists
  // Destructure the matchedData object from location.state
  const { data } = location.state || { data: { email: "No email", token: "No token", username: "No username" } };

  // check for refresh, allow user to stay on page regardless if refresh is cancelled or confirmed
  // window.onbeforeunload = (event) => {
  //   return ""; // random string to allow window alert to come up
  // }

  // check for backtrack, navigate back to criteria selection if user confirms action,
  // otherwise stay on page
  // window.onpopstate = (event) => {
  //   var confirmation = window.confirm("You are exiting the current collaboration session, continue?");
  //   if (confirmation) {
  //     location.state = undefined;
  //     navigate("/matching/select");
  //   } else {
  //     event.stopImmediatePropagation();
  //     event.preventDefault();
  //   }
  // }

  console.log("MatchFoundPage", data); // Log to confirm the data is received correctly

  return (
    <div>
      <NavBar />
      <div id="MatchFoundController">
        <h1>Match Found</h1>
        {/* <p>You have been matched with {data.data.username}!</p> */}
        <p>We're preparing your room...</p>
      </div>
    </div>
  );
}

export default MatchFound;
