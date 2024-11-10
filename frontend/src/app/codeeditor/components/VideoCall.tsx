"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Camera,
    CameraOff,
    Mic,
    MicOff,
    Maximize2,
    Minimize2,
    RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/authContext';

interface VideoCallProps {
    userName: string;
    roomId: string;
}

interface PeerConnection {
    connection: RTCPeerConnection;
    username: string;
    stream?: MediaStream;
}

const VideoCall: React.FC<VideoCallProps> = ({ userName, roomId }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [connections, setConnections] = useState(new Set<string>());
    const [isConnectedToServer, setIsConnectedToServer] = useState(false);
    const [peerStreams, setPeerStreams] = useState<Map<string, MediaStream>>(new Map());
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();

    const myVideo = useRef<HTMLVideoElement>(null);
    const peerConnections = useRef<Record<string, PeerConnection>>({});
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const createPeerConnection = useCallback(async (peerId: string, username: string) => {
        console.log(`Creating peer connection for ${username} (${peerId})`);

        // Clean up any existing connection for this user
        for (const [existingPeerId, connection] of Object.entries(peerConnections.current)) {
            if (connection.username === username && existingPeerId !== peerId) {
                console.log(`Cleaning up existing connection for ${username}`);
                connection.connection.close();
                delete peerConnections.current[existingPeerId];
                setPeerStreams(prev => {
                    const newStreams = new Map(prev);
                    newStreams.delete(existingPeerId);
                    return newStreams;
                });
                setConnections(prev => {
                    const newConnections = new Set(prev);
                    newConnections.delete(existingPeerId);
                    return newConnections;
                });
            }
        }

        if (peerConnections.current[peerId]) {
            console.log(`Connection already exists for ${username} with peerId ${peerId}, cleaning up`);
            peerConnections.current[peerId].connection.close();
            delete peerConnections.current[peerId];
            setPeerStreams(prev => {
                const newStreams = new Map(prev);
                newStreams.delete(peerId);
                return newStreams;
            });
        }


        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        };

        const peerConnection = new RTCPeerConnection(configuration);
        console.log('RTCPeerConnection created');

        // Handle incoming streams
        peerConnection.ontrack = (event) => {
            console.log(`Received tracks from ${username}:`, event.streams);
            const [remoteStream] = event.streams;

            setPeerStreams(prev => {
                // Clean up any existing streams for this username
                const newStreams = new Map(prev);
                for (const [existingPeerId, _] of newStreams) {
                    if (peerConnections.current[existingPeerId]?.username === username && existingPeerId !== peerId) {
                        newStreams.delete(existingPeerId);
                    }
                }
                newStreams.set(peerId, remoteStream);
                console.log(`Added stream for ${username} to peer streams`);
                return newStreams;
            });

            setConnections(prev => new Set([...prev].filter(id =>
                peerConnections.current[id]?.username !== username || id === peerId
            )).add(peerId));
        };

        // Add local stream tracks
        if (stream) {
            console.log(`Adding ${stream.getTracks().length} local tracks to connection for ${username}`);
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });
        }

        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socket) {
                console.log(`Sending ICE candidate to ${username}`);
                socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    peerId,
                    roomId
                });
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log(`ICE connection state for ${username}:`, peerConnection.iceConnectionState);
            if (peerConnection.iceConnectionState === 'failed') {
                peerConnection.restartIce();
            }
        };

        peerConnections.current[peerId] = { connection: peerConnection, username };
        console.log(`Stored peer connection for ${username}`);

        return peerConnections.current[peerId];
    }, [stream, socket, roomId]);

    const initializeMedia = useCallback(async () => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            console.log('Got user media stream');
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
            return currentStream;
        } catch (error) {
            console.error('Media error:', error);
            toast({
                variant: "destructive",
                title: "Camera/Microphone Error",
                description: error instanceof Error ? error.message : 'Failed to access media devices',
            });
            return null;
        }
    }, []);

    // Handle socket events
    useEffect(() => {
        if (!socket || !stream) return; // Don't set up events until we have both socket and stream

        socket.on('connect', async () => {
            console.log('Connected to signaling server with socket ID:', socket.id);
            setIsConnectedToServer(true);
            reconnectAttempts.current = 0;
            socket.emit('join-room', { roomId, username: userName, userId: user?.id || '' });
        });

        socket.on('existing-users', async (users) => {
            console.log('Received existing users:', users);
            for (const { peerId, username } of users) {
                try {
                    console.log(`Setting up connection for existing user: ${username}`);
                    const peerConnection = await createPeerConnection(peerId, username);

                    // Create and send offer
                    const offer = await peerConnection.connection.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true,
                    });
                    await peerConnection.connection.setLocalDescription(offer);
                    socket.emit('offer', { offer, peerId, roomId, username: userName });
                    console.log(`Sent offer to ${username}`);
                } catch (error) {
                    console.error(`Error setting up connection with ${username}:`, error);
                }
            }
        });

        socket.on('user-joined', async ({ peerId, username }) => {
            console.log('New user joined:', username);
            await createPeerConnection(peerId, username);
        });

        socket.on('user-disconnected', async ({ socketId, disconnectedUser }) => {
            console.log(`Cleaning up disconnected user ${disconnectedUser} from socket ${socketId}`)
            for (const [peerId, connection] of Object.entries(peerConnections.current)) {
                if (connection.username === disconnectedUser?.username || peerId === socketId) {
                    console.log(`Cleaning up connection for ${connection.username} (${peerId})`);
                    connection.connection.close();
                    delete peerConnections.current[peerId];
                    setPeerStreams(prev => {
                        const newStreams = new Map(prev);
                        newStreams.delete(peerId);
                        return newStreams;
                    });
                    setConnections(prev => {
                        const newConnections = new Set(prev);
                        newConnections.delete(peerId);
                        return newConnections;
                    });
                }
            }
        })

        socket.on('offer', async ({ offer, peerId, username }) => {
            try {
                console.log('Received offer from:', username);
                const peerConnection = await createPeerConnection(peerId, username);
                await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(offer));

                // Create and send answer
                const answer = await peerConnection.connection.createAnswer();
                await peerConnection.connection.setLocalDescription(answer);
                socket.emit('answer', { answer, peerId, roomId });
                console.log(`Sent answer to ${username}`);
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        socket.on('answer', async ({ answer, peerId }) => {
            try {
                console.log('Received answer from peer:', peerId);
                const peerConnection = peerConnections.current[peerId];
                if (peerConnection && peerConnection.connection.signalingState !== 'stable') {
                    await peerConnection.connection.setRemoteDescription(new RTCSessionDescription(answer));
                    console.log('Successfully set remote description from answer');
                }
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        });

        socket.on('ice-candidate', async ({ candidate, peerId }) => {
            try {
                console.log('Received ICE candidate from peer:', peerId);
                const peerConnection = peerConnections.current[peerId];
                if (peerConnection && peerConnection.connection.remoteDescription) {
                    await peerConnection.connection.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('Successfully added ICE candidate');
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        return () => {
            socket.off('connect');
            socket.off('existing-users');
            socket.off('user-disconnected');
            socket.off('user-joined');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    }, [socket, stream, createPeerConnection, roomId, userName]);

    // Initialize socket and media
    useEffect(() => {
        let currentStream: MediaStream | null = null;

        const init = async () => {
            // First get media stream
            currentStream = await initializeMedia();
            if (!currentStream) return;

            setStream(currentStream);

            // Then connect socket
            const newSocket = io(process.env.NEXT_PUBLIC_COLLAB_SERVICE_HOST || 'ws://localhost:5003', {
                path: '/video-call',
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            setSocket(newSocket);

            return () => {
                console.log('Cleaning up...');
                currentStream?.getTracks().forEach(track => track.stop());
                Object.values(peerConnections.current).forEach(({ connection }) => {
                    connection.close();
                });
                setPeerStreams(new Map());
                setConnections(new Set());
                newSocket.close();
            };
        };

        init();
    }, []);

    return (
        <Card className='h-full flex flex-col'>
            <CardHeader className="p-2 flex-shrink-0">
                <CardTitle className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <span>Video Call ({connections.size + 1} connected)</span>
                        <div
                            className={`w-2 h-2 rounded-full ${isConnectedToServer ? 'bg-green-500' : 'bg-red-500'}`}
                            title={isConnectedToServer ? 'Connected' : 'Disconnected'}
                        />
                        {!isConnectedToServer && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { }}
                                className="h-6 w-6 p-0"
                            >
                                <RefreshCw className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow flex flex-col">
                <div className='grid grid-cols-2 gap-2 flex-grow overflow-auto'>
                    <div className="relative rounded-lg overflow-hidden bg-secondary aspect-video">
                        <video
                            ref={myVideo}
                            muted
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
                            {userName} (You)
                        </div>
                    </div>

                    {Array.from(peerStreams.entries()).map(([peerId, peerStream]) => (
                        <div key={peerId} className="relative rounded-lg overflow-hidden bg-secondary aspect-video">
                            <video
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                ref={el => {
                                    if (el) {
                                        el.srcObject = peerStream;
                                    }
                                }}
                            />
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
                                {peerConnections.current[peerId]?.username || `User ${peerId}`}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-2 mt-2 flex-shrink-0">
                    <Button
                        variant={isAudioEnabled ? "outline" : "destructive"}
                        size="sm"
                        onClick={() => {
                            if (stream) {
                                stream.getAudioTracks().forEach(track => {
                                    track.enabled = !isAudioEnabled;
                                });
                                setIsAudioEnabled(!isAudioEnabled);
                                toast({
                                    title: isAudioEnabled ? "Microphone Muted" : "Microphone Unmuted",
                                });
                            }
                        }}
                    >
                        {isAudioEnabled ?
                            <Mic className="h-3 w-3" /> :
                            <MicOff className="h-3 w-3" />
                        }
                    </Button>
                    <Button
                        variant={isVideoEnabled ? "outline" : "destructive"}
                        size="sm"
                        onClick={() => {
                            if (stream) {
                                stream.getVideoTracks().forEach(track => {
                                    track.enabled = !isVideoEnabled;
                                });
                                setIsVideoEnabled(!isVideoEnabled);
                                toast({
                                    title: isVideoEnabled ? "Camera Turned Off" : "Camera Turned On",
                                });
                            }
                        }}
                    >
                        {isVideoEnabled ?
                            <Camera className="h-3 w-3" /> :
                            <CameraOff className="h-3 w-3" />
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
};

export default VideoCall;