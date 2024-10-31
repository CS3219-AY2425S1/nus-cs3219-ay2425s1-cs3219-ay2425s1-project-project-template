import React, { useState, useEffect } from "react";
import Peer from "peerjs";
import { useParams } from "next/navigation";

export default function VoiceChat() {
  const params = useParams();
  const roomID = params?.roomId as string;

  // Define `peer` as a state that can be either `Peer` or `null`
  const [peer, setPeer] = useState<Peer | null>(null);
  const [call, setCall] = useState(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerID, setPeerID] = useState("");
  const [connectionPeerID, setConnectionPeerID] = useState("");

  useEffect(() => {
    if (roomID) {
      // Fetch peer ID and connection ID from backend (assuming this setup)
      console.log("fetching peer id")
      fetch(`http://localhost:8085/join/${roomID}`)
        .then((response) => response.json())
        .then((data) => {
          setPeerID(data.peerID);
          console.log(connectionPeerID)
          setConnectionPeerID(data.connectionPeerID || "");
        })
        .catch((err) => console.error("Error fetching peer IDs:", err));
    }
  }, [roomID]);

  useEffect(() => {
    if (peerID) {
      // Initialize PeerJS with peerID
      const peerInstance = new Peer(peerID, {
        host: "localhost",
        port: 9000,
        path: "/"
      });

      setPeer(peerInstance); // Assign peer instance to state
      peerInstance.on("call", (incomingCall) => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          incomingCall.answer(stream);
          incomingCall.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        });
      });

      return () => {
        peerInstance.destroy();
      };
    }
  }, [peerID]);

  useEffect(() => {
    if (peer && connectionPeerID) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const outgoingCall = peer.call(connectionPeerID, stream);
        setCall(outgoingCall);

        outgoingCall.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      });
    }
  }, [peer, connectionPeerID]);

  return (
    <div>
      <h2>PeerJS Voice Chat</h2>
      <p>Room: {roomID}</p>
      <p>Your Peer ID: {peerID}</p>
      <p>Connected to: {connectionPeerID || "Waiting for peer..."}</p>

      {remoteStream && (
        <audio autoPlay controls srcObject={remoteStream} />
      )}
    </div>
  );
}
