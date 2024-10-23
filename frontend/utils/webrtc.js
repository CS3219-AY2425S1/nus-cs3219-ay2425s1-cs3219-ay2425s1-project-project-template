let localStream;
let peerConnection;
let ws;
let iceCandidateQueue = []; // Queue to hold ICE candidates until SDP is set
let remoteDescriptionSet = false; // Flag to check if remote SDP is set

export function startVoiceChat(roomID, remoteAudioElement) {
    // Open a WebSocket connection to the signaling server
    ws = new WebSocket(`ws://localhost:8080/ws?roomID=${roomID}&userID=user1`);

    // Get the user's audio stream
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            localStream = stream;
            setupPeerConnection(remoteAudioElement);
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
        });

    // Handle incoming WebSocket messages (signaling)
    ws.onmessage = event => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'offer') {
            peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer))
                .then(() => {
                    remoteDescriptionSet = true;  // Set the flag
                    peerConnection.createAnswer()
                        .then(answer => peerConnection.setLocalDescription(answer))
                        .then(() => {
                            ws.send(JSON.stringify({ type: 'answer', answer: peerConnection.localDescription }));
                        });

                    // Process any queued ICE candidates
                    processIceCandidateQueue();
                });
        } else if (message.type === 'answer') {
            peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer))
                .then(() => {
                    remoteDescriptionSet = true;  // Set the flag
                    processIceCandidateQueue();  // Process queued ICE candidates
                });
        } else if (message.type === 'ice') {
            if (remoteDescriptionSet) {
                // If SDP is already set, add the ICE candidate immediately
                peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate))
                    .catch(error => console.error('Error adding ICE candidate:', error));
            } else {
                // Queue the ICE candidate until SDP is set
                iceCandidateQueue.push(message.candidate);
            }
        }
    };

    // Handle WebSocket connection close
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
}

// Set up the peer connection and handle WebRTC events
function setupPeerConnection(remoteAudioElement) {
    peerConnection = new RTCPeerConnection();

    // Add local audio stream to the peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Handle ICE candidates and send them over WebSocket
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            ws.send(JSON.stringify({
                type: 'ice',
                candidate: {
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex
                }
            }));
        }
    };

    // Receive the remote audio stream
    peerConnection.ontrack = event => {
        remoteAudioElement.srcObject = event.streams[0];  // Attach the remote stream to the audio element
        remoteAudioElement.play();  // Play the remote audio
    };

    // Create an offer and send it via WebSocket
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            ws.send(JSON.stringify({ type: 'offer', offer: peerConnection.localDescription }));
        });
}

// Function to process ICE candidates once SDP is set
function processIceCandidateQueue() {
    iceCandidateQueue.forEach(candidate => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            .catch(error => console.error('Error adding queued ICE candidate:', error));
    });
    iceCandidateQueue = []; // Clear the queue
}
