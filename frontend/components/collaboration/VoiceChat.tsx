import React, { useState, useEffect, useRef } from "react";
import Peer, { MediaConnection } from "peerjs";
import { useParams } from "next/navigation";

export default function VoiceChat() {
  const params = useParams();
  const roomID = params?.roomId as string;

  const [peer, setPeer] = useState<Peer | null>(null);
  const [call, setCall] = useState<MediaConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerID, setPeerID] = useState("");
  const [connectionPeerID, setConnectionPeerID] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (roomID) {
      console.log("Fetching peer IDs for room:", roomID);
      fetch(`http://localhost:8085/join/${roomID}`)
        .then((response) => response.json())
        .then((data) => {
          setPeerID(data.peerID);
          setConnectionPeerID(data.connectionPeerID || "");
          console.log("Received peer IDs:", data);
        })
        .catch((err) => console.error("Error fetching peer IDs:", err));
    }
  }, [roomID]);

  useEffect(() => {
    // Only initialize if there's no existing peer
    if (peerID && !peer) {
      console.log("Initializing PeerJS instance with peerID:", peerID);
      const peerInstance = new Peer(peerID, {
        host: "localhost",
        port: 9000,
        path: "/"
      });

      setPeer(peerInstance);

      // Listen for incoming calls
      peerInstance.on("call", (incomingCall) => {
        console.log("Incoming call received");
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          incomingCall.answer(stream);
          incomingCall.on("stream", (remoteStream) => {
            console.log("Remote stream received from caller");
            setRemoteStream(remoteStream);
          });
        }).catch((err) => console.error("Error accessing local media:", err));
      });

      peerInstance.on("open", (id) => {
        console.log("Peer connection open with ID:", id);
      });

      peerInstance.on("error", (err) => {
        console.error("PeerJS error:", err);
      });

      // Cleanup on component unmount or peerID change
      return () => {
        console.log("Destroying PeerJS instance");
        peerInstance.destroy();
        setPeer(null);
      };
    }
  }, [peerID]);

  useEffect(() => {
    if (peer && connectionPeerID) {
      console.log("Attempting to call connectionPeerID:", connectionPeerID);
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const outgoingCall: MediaConnection = peer.call(connectionPeerID, stream);
        setCall(outgoingCall);

        outgoingCall.on("stream", (remoteStream) => {
          console.log("Remote stream received from outgoing call");
          setRemoteStream(remoteStream);
        });

        outgoingCall.on("error", (err) => {
          console.error("Error in outgoing call:", err);
        });
      }).catch((err) => console.error("Error accessing local media:", err));
    }
  }, [peer, connectionPeerID]);

  // Set `srcObject` on the audio element directly through the ref
  useEffect(() => {
    if (audioRef.current && remoteStream) {
      console.log("Setting remote stream to audio element");
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <h2>PeerJS Voice Chat</h2>
      <p>Room: {roomID}</p>
      <p>Your Peer ID: {peerID}</p>
      <p>Connected to: {connectionPeerID || "Waiting for peer..."}</p>

      <audio ref={audioRef} autoPlay controls />
    </div>
  );
}
