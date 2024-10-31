import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let ws: WebSocket | null = null;
let iceCandidateBuffer: RTCIceCandidateInit[] = []; // Buffer ICE candidates here

export default function VoiceChat() {
  const params = useParams();
  const roomID = params?.roomId as string; // Automatically get roomID from the URL
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false); // Flag to track remote description
  const [isWaitingForConnection, setIsWaitingForConnection] = useState(true); // Track if we're still waiting for the second user
  const [userID, setUserID] = useState(""); // Track userID assigned by backend

  useEffect(() => {
    if (roomID) {
      // Start WebSocket connection automatically
      initializeWebSocket(roomID);
    }
  }, [roomID]);

  const initializeWebSocket = (roomID: string) => {
    ws = new WebSocket(`ws://localhost:8081/ws?roomID=${roomID}`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received:", message);

      // Handle user ID assignment
      if (message.type === "userIDAssignment") {
        setUserID(message.userID); // Set user ID when received from backend
        console.log(`Assigned User ID: ${message.userID}`);
        // Start voice chat only after userID is assigned
        startVoiceChat(roomID, message.userID);
      }

      // Handle "ready" message when both users are connected
      if (message.type === "ready") {
        console.log("Both users connected, starting WebRTC signaling...");
        setIsChatStarted(true);
        setIsWaitingForConnection(false);
      }

      // Handle WebRTC signaling messages (offer, answer, ICE candidates)
      handleWebRTCSignaling(message);
    };
  };

  const startVoiceChat = (roomID: string, userID: string) => {
    // Request access to the user's microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        localStream = stream;
        setupPeerConnection(userID); // Setup WebRTC after media access granted
      })
      .catch((err) => console.error("Error accessing microphone:", err));
  };

  const handleWebRTCSignaling = (message: any) => {
    // Handle offers from user1 to user2
    if (message.type === "offer" && userID === "user2") {
      console.log("Received offer from user1, setting remote description and creating an answer.");
      peerConnection
        ?.setRemoteDescription(new RTCSessionDescription(message.offer))
        .then(() => {
          setRemoteDescriptionSet(true); // Remote description set
          processBufferedICECandidates(); // Process any buffered ICE candidates
          return peerConnection?.createAnswer();
        })
        .then((answer) => {
          console.log("Answer created, setting local description...");
          return peerConnection?.setLocalDescription(answer);
        })
        .then(() => {
          console.log("Sending answer via WebSocket...");
          ws?.send(JSON.stringify({ type: "answer", answer: peerConnection?.localDescription }));
        })
        .catch((err) => console.error("Error setting remote description for offer:", err));
    }

    // Handle answers from user2 to user1
    else if (message.type === "answer" && userID === "user1") {
      console.log("Received answer from user2, setting remote description.");
      peerConnection
        ?.setRemoteDescription(new RTCSessionDescription(message.answer))
        .then(() => {
          setRemoteDescriptionSet(true);
          processBufferedICECandidates(); // Process buffered ICE candidates
        })
        .catch((err) => console.error("Error setting remote description for answer:", err));
    }

    // Handle ICE candidates
    else if (message.type === "ice") {
      console.log("Received ICE candidate, adding or buffering.");
      if (remoteDescriptionSet) {
        peerConnection
          ?.addIceCandidate(new RTCIceCandidate(message.candidate))
          .catch((err) => console.error("Error adding ICE candidate:", err));
      } else {
        iceCandidateBuffer.push(message.candidate); // Buffer the ICE candidate if remote description isn't set yet
      }
    }
  };

  const processBufferedICECandidates = () => {
    console.log("Processing buffered ICE candidates...");
    iceCandidateBuffer.forEach((candidate) => {
      peerConnection
        ?.addIceCandidate(new RTCIceCandidate(candidate))
        .catch((err) => console.error("Error adding buffered ICE candidate:", err));
    });
    iceCandidateBuffer = []; // Clear the buffer after processing
  };

  const setupPeerConnection = (userID: string) => {
    peerConnection = new RTCPeerConnection();

    // Add local audio stream to peer connection
    localStream?.getTracks().forEach((track) => {
      peerConnection?.addTrack(track, localStream!);
    });

    // Handle negotiation needed for user1 to send an offer
    peerConnection!.onnegotiationneeded = () => {
      if (userID === "user1") {
        console.log("User1 creating offer...");
        peerConnection!
          .createOffer()
          .then((offer) => peerConnection?.setLocalDescription(offer))
          .then(() => {
            console.log("Sending offer via WebSocket...");
            if (peerConnection!.localDescription) {
              ws?.send(JSON.stringify({ type: "offer", offer: peerConnection!.localDescription }));
            }
          })
          .catch((error) => console.error("Error creating or setting offer:", error));
      }
    };

    // Handle ICE candidates
    peerConnection!.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
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
      <p>User ID: {userID}</p>
      <p>Chat Started: {isChatStarted ? "Yes" : "No"}</p>
      <p>Waiting for second user: {isWaitingForConnection ? "Yes" : "No"}</p>
      {/* Disable the specific ESLint rule for the audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio autoPlay controls id="remoteAudio" />
    </div>
  );
}
