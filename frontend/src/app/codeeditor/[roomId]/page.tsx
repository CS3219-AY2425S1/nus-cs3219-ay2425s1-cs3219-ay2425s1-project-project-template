'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import CollaborativeCodingPage from '../components/CollaborativeSpace';
import axios from 'axios';

const CollabRoomPage = ({ params }: {
    params: {roomId:string}
}) => {
    const router = useRouter();
    const roomId = String(params.roomId);
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isValidRoom, setIsValidRoom] = useState(false);

    useEffect(() => {
        const verifyRoom = async () => {
            if (!roomId || !user) return;

            try {
                const response = await axios.post('http://localhost:5003/verify-room', {
                    roomId,
                    userId: user.id,
                });

                if (response.status === 200) {
                    setIsValidRoom(true);
                }
            } catch (error: any) {
                console.error('Error verifying room:', error.response?.data?.message || error.message);
                setIsValidRoom(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyRoom();
    }, [roomId, user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isValidRoom) {
        return <div>Oops! This room either does not exist or you are not authorized to access this room.</div>;
    }

    return (
        <div>
            <p>hello world this is room {roomId}</p>
            <CollaborativeCodingPage
                initialCode='import math'
                language="javascript"
                theme="vs-dark"
                roomId={roomId}
                userName={String(user?.email)}
            />
        </div>
    );
};

export default CollabRoomPage;
