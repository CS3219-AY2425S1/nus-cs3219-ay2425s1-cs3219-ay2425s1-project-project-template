import React, { useState, useEffect } from "react";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import io from "socket.io-client";
import axios from "axios";
import { TokenRounded } from "@mui/icons-material";

const socket = io("http://localhost:8081");

const MatchComponent = () => {
    const [waitingTime, setWaitingTime] = useState(0);
    const [isWaiting, setIsWaiting] = useState(false);
    const [matchedUserId, setMatchedUserId] = useState(null);

    useEffect(() => {
        let timer;
        socket.on("connect", () => {
            console.log("Connected to the server"); // This runs when the client successfully connects
        });

        // Listen for match-found event from the server
        socket.on("match_found", (data) => {
            console.log("USER FOUND!! ", data)
            setMatchedUserId(data.matchedUser.id);
            setIsWaiting(false); // Stop the timer when matched
        });

        // Start the timer when waiting for a match
        if (isWaiting) {
            timer = setInterval(() => {
                setWaitingTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            setWaitingTime(0); // Reset timer if not waiting
        }

        return () => {
            clearInterval(timer);
        };
    }, [isWaiting]);

    // Function to request a match
    const requestMatch = async () => {
        try {
            setIsWaiting(true); // Start waiting for a match
            setMatchedUserId(null); // Reset previous match info
            const token = localStorage.getItem("authorization");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Authorization header
                },
            };

            const body = {
                socketId: socket.id,
                complexity: "medium",
                category: "algorithms",
            };

            // Send a request to the server to find a match
            await axios.post("http://localhost:8081/match/match-request", body, config);
        } catch (error) {
            console.error("Error requesting match:", error);
            setIsWaiting(false); // Stop waiting if there was an error
        }
    };

    return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4">User Matching Service</Typography>

            {/* Show timer or match info */}
            {isWaiting ? (
                <Box>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Waiting for a match... {waitingTime} seconds
                    </Typography>
                </Box>
            ) : matchedUserId ? (
                <Typography variant="h6" color="green">
                    Matched with User ID: {matchedUserId}
                </Typography>
            ) : (
                <Typography variant="h6">Click to start searching for a match!</Typography>
            )}

            {/* Request match button */}
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={requestMatch} disabled={isWaiting}>
                {isWaiting ? "Searching..." : "Find a Match"}
            </Button>
        </Box>
    );
};

export default MatchComponent;
