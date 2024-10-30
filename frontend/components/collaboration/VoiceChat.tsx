import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Assuming you're using Next.js navigation to get URL params

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let ws: WebSocket | null = null;
let iceCandidateBuffer: RTCIceCandidateInit[] = []; // Buffer ICE candidates here

export default function VoiceChat() {
  const params = useParams();
  const roomID = params?.roomId as string; // Get roomID from the URL
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false); // Flag to track remote description
  const [isWaitingForConnection, setIsWaitingForConnection] = useState(true); // Keep track of whether we're still waiting for the second user

  useEffect(() => {
    if (roomID) {
      startVoiceChat(roomID); // Automatically start when component loads and roomID is available
    }
  }, [roomID]);

  const startVoiceChat = (roomID: string) => {
    // Connect to WebSocket server
    ws = new WebSocket(`ws://localhost:8081/ws?roomID=${roomID}`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received:", message);

      // Start WebRTC signaling when both users are connected (i.e., "ready" message is received)
      if (message.type === "ready") {
        console.log("Both users connected, starting WebRTC signaling...");
        setupPeerConnection(); // Start WebRTC peer connection
        setIsChatStarted(true);
        setIsWaitingForConnection(false); // Stop waiting for connection
      }

      // Handle WebRTC signaling (offer, answer, ICE candidates)
      if (message.type === "offer") {
        console.log("Received offer from peer, setting remote description...");
        peerConnection?.setRemoteDescription(new RTCSessionDescription(message.offer))
          .then(() => {
            setRemoteDescriptionSet(true); // Remote description set, now process buffered ICE candidates
            return peerConnection?.createAnswer();
          })
          .then((answer) => {
            peerConnection?.setLocalDescription(answer);
            console.log("Sending answer to peer...");
            ws?.send(JSON.stringify({ type: "answer", answer: peerConnection?.localDescription }));
          })
          .catch((err) => console.error("Error setting remote description for offer:", err));
      } else if (message.type === "answer") {
        console.log("Received answer from peer, setting remote description...");
        peerConnection?.setRemoteDescription(new RTCSessionDescription(message.answer))
          .then(() => setRemoteDescriptionSet(true))
          .catch((err) => console.error("Error setting remote description for answer:", err));
      } else if (message.type === "ice") {
        console.log("Received ICE candidate from peer...");
        if (remoteDescriptionSet) {
          peerConnection?.addIceCandidate(new RTCIceCandidate(message.candidate))
            .then(() => console.log("ICE candidate successfully added"))
            .catch((err) => console.error("Error adding ICE candidate:", err));
        } else {
          console.log("Buffering ICE candidate until remote description is set...");
          iceCandidateBuffer.push(message.candidate);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Access microphone for voice chat
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localStream = stream;
        console.log("Microphone access granted.");
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  };

  const setupPeerConnection = () => {
    peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // Using public Google STUN server
    });

    // Add local audio stream to peer connection
    localStream?.getTracks().forEach((track) => {
      peerConnection?.addTrack(track, localStream!);
    });

    // Handle negotiation
    peerConnection!.onnegotiationneeded = () => {
      console.log("Negotiation needed, creating offer...");
      peerConnection!.createOffer()
        .then((offer) => {
          console.log("Setting local description with offer...");
          return peerConnection?.setLocalDescription(offer);
        })
        .then(() => {
          console.log("Sending offer to peer...");
          ws?.send(JSON.stringify({ type: "offer", offer: peerConnection!.localDescription }));
        })
        .catch((error) => console.error("Error creating or setting offer:", error));
    };

    // Handle ICE candidates
    peerConnection!.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated, sending to peer:", event.candidate);
        ws?.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
      }
    };

    // Handle remote track (audio from peer)
    peerConnection!.ontrack = (event) => {
      console.log("Received remote audio stream, playing...");
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.play();
    };
  };

  return (
    <div>
      <h2>WebRTC Voice Chat</h2>
      <p>Room: {roomID}</p>
      <p>Chat Started: {isChatStarted ? "Yes" : "No"}</p>
      <p>Waiting for second user: {isWaitingForConnection ? "Yes" : "No"}</p>
      {/* Disable the specific ESLint rule for the audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio autoPlay controls id="remoteAudio" />
    </div>
  );
}
