import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { io } from "socket.io-client";
import SimplePeer, { SignalData } from "simple-peer";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import Draggable from "react-draggable";


export default function VideoCall() {
    const { roomId } = useParams();
    const { commSocket } = useSocket();
    const { user } = useContext(AuthContext);
    const [isReceivingCall, setIsReceivingCall] = useState(false);
    const [isShowVideo, setIsShowVideo] = useState(false);
    const peerInstance = useRef<SimplePeer.Instance | null>(null);
    const stream = useRef<MediaStream | null>(null);
    const myVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    useEffect(() => {

        if (!commSocket) {
            console.log("Communication socket error.");
            navigate("/");
            return;
        }

        commSocket.on("incoming-call", () => {
            console.log("incoming call");
            setIsReceivingCall(true);
        })
        
        // socket receives answer from other side
        commSocket.on("call-response", (isAnswer: boolean) => {
            if (isAnswer) {
                setMediaDevices();
                setIsShowVideo(true);
                initiatePeerConnection(roomId!, true); // true because this socket is the caller
            } else {
                console.log("call declined");
                setIsShowVideo(false);
                // implement logic when the other side declines the call

            }
        })

        commSocket.on("signal", (signal: SignalData) => {
            peerInstance.current?.signal(signal);
        })
        
        return () => {
            if (commSocket && commSocket.connected) {
                    commSocket.removeAllListeners();
                    commSocket.disconnect();
                }     
        } 

    }, [commSocket])
    
    const initiateCall = () => {
        commSocket!.emit("initiate-call", roomId, user);
    }

    const acceptCall = () => {
        commSocket!.emit("call-response", true, roomId);
        setMediaDevices();
        setIsReceivingCall(false);
        initiatePeerConnection(roomId!, false);
        setIsShowVideo(true);
    }

    const rejectCall = () => {
        commSocket!.emit("call-response", false, roomId)
        setIsReceivingCall(false);
    }

    const initiatePeerConnection = (roomId: string, isInitiator: boolean) => {
        peerInstance.current = new SimplePeer({
            initiator: isInitiator,
            trickle: false,
            stream: stream.current!
        });

        peerInstance.current.on('signal', (signal) => {
            commSocket!.emit('signal', roomId, signal);
        });

        peerInstance.current.on('stream', (remoteStream) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteStream;
            }
        });    
    }
    
    const setMediaDevices = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
            stream.current = mediaStream;
            if (myVideo.current) {
                myVideo.current.srcObject = mediaStream;
            }
        });
    }

    return (
    <div>
        <Draggable bounds="">
            <div className="min-w-full min-h-full flex items-center justify-center z-50 absolute">
                {
                isShowVideo ?
                <div className="flex min-w-full min-h-full justify-center items-center ">

                    <video className="w-1/2 h-1/2" ref={myVideo} autoPlay>

                    </video>
                    <video className="w-1/2 h-1/2" ref={remoteVideo} autoPlay muted>

                    </video> 
                </div> : 
                <div className="w-20 h-20 bg-green-500">

                </div>
                }
            </div>
        </Draggable>
    </div>
  )
}
