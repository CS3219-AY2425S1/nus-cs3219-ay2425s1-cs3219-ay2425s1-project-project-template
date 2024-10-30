import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Socket, io } from "socket.io-client";
import SimplePeer, { SignalData } from "simple-peer";
import { useParams } from "react-router-dom";

export default function VideoCall() {
    const {roomId} = useParams();
    const {user} = useContext(AuthContext);
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [isShowVideo, setIsShowVideo] = useState(false);
    const peerInstance = useRef<SimplePeer.Instance | null>(null);
    const stream = useRef<MediaStream | null>(null);
    const myVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const socketRef = useRef<Socket>();


    useEffect(() => {
        console.log(user.username);
        console.log(roomId)
    }, [])

    useEffect(() => {
        socketRef.current = io("http://localhost:4005", {
            auth: {
                userId: user.id,
                username: user.username,
            }
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
            stream.current = mediaStream;
            if (myVideo.current) {
                myVideo.current.srcObject = mediaStream;
            }
        });


        socketRef.current.on("connect", () => {
            
            console.log(`${user.username} is connected to communication server`);
            socketRef.current!.emit("join-comms-room", roomId);
        });

        socketRef.current.on("incoming-call", () => {
            console.log("incoming call");
            setIsReceivingCall(true);
        })
        
        // socket receives answer from other side
        socketRef.current.on("call-response", (isAnswer: boolean) => {
            if (isAnswer) {
                setIsShowVideo(true);
                initiatePeerConnection(roomId!, true); // true because this socket is the caller
            } else {
                console.log("call declined");
                setIsShowVideo(false);
                // implement logic when the other side declines the call

            }
        })

        socketRef.current.on("signal", (signal: SignalData) => {
            peerInstance.current?.signal(signal);
        })


        return () => {
            console.log("disconnected");
            socketRef.current?.disconnect();
        }
    }, [])
    
    const initiateCall = () => {
        socketRef.current!.emit("initiate-call", roomId);
    }

    const acceptCall = () => {
        socketRef.current!.emit("call-response", true, roomId)
        setIsReceivingCall(false);
        initiatePeerConnection(roomId!, false);
        setIsShowVideo(true);
    }

    const rejectCall = () => {
        socketRef.current!.emit("call-response", false, roomId)
        setIsReceivingCall(false);
    }

    const initiatePeerConnection = (roomId: string, isInitiator: boolean) => {
        peerInstance.current = new SimplePeer({
            initiator: isInitiator,
            trickle: false,
            stream: stream.current!
        });

        peerInstance.current.on('signal', (signal) => {
            socketRef.current!.emit('signal', roomId, signal);
        });

        peerInstance.current.on('stream', (remoteStream) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteStream;
            }
        });

        
    }

    return (
    <div className="w-screen h-screen">
        <div className="min-w-full min-h-full flex items-center justify-center">
            {isShowVideo ? null
            : <button className="flex border border-blue-600  text-blue-600" onClick={initiateCall}>
                Call match
            </button>
            }
            {isReceivingCall? <div>
                    <button className="flex border border-green-600  text-green-600" onClick={acceptCall}> Accept</button>
                    <button className="flex border border-red-600  text-red-600" onClick={rejectCall}> Reject</button>
                </div>
                    : null }

            {
            isShowVideo ?
            <div className="flex min-w-full min-h-full justify-center items-center ">

                <video className="w-1/2 h-1/2" ref={myVideo} autoPlay muted>

                </video>
                <video className="w-1/2 h-1/2" ref={remoteVideo} autoPlay muted>

                </video> 
            </div> 
            : null
            }
        </div>
    </div>
  )
}
