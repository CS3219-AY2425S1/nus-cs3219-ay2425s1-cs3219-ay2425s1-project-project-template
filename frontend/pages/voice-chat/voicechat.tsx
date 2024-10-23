import { useState } from 'react';

let localStream: MediaStream | null = null;
let peerConnection: RTCPeerConnection | null = null;
let ws: WebSocket | null = null;

export default function VoiceChat() {
    const [roomID, setRoomID] = useState('');
    const [isChatStarted, setIsChatStarted] = useState(false);

    const handleCreateRoom = async () => {
        const backendURL = 'http://localhost:3000/api/create-room?user1=user1&user2=user2';
        const response = await fetch(backendURL);
        const data = await response.json();
        setRoomID(data.roomID);
        console.log('Room created:', data.roomID);
    };

    const handleStartChat = () => {
        if (roomID) {
            startVoiceChat(roomID);
            setIsChatStarted(true);
        } else {
            alert('Please create or enter a room ID');
        }
    };

    const startVoiceChat = (roomID: string) => {
        ws = new WebSocket(`ws://localhost:3000/api/ws?roomID=${roomID}&userID=user1`);
        
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            localStream = stream;
            setupPeerConnection();
        }).catch(err => console.error('Error accessing microphone:', err));

        ws.onmessage = event => {
            const message = JSON.parse(event.data);
            if (message.type === 'offer') {
                peerConnection?.setRemoteDescription(new RTCSessionDescription(message.offer)).then(() => {
                    peerConnection?.createAnswer().then(answer => {
                        peerConnection?.setLocalDescription(answer);
                        ws?.send(JSON.stringify({ type: 'answer', answer: peerConnection!.localDescription }));
                    });
                });
            } else if (message.type === 'answer') {
                peerConnection?.setRemoteDescription(new RTCSessionDescription(message.answer));
            } else if (message.type === 'ice') {
                peerConnection?.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
        };
    };

    const setupPeerConnection = () => {
        peerConnection = new RTCPeerConnection();
        localStream?.getTracks().forEach(track => peerConnection?.addTrack(track, localStream!));

        peerConnection!.onicecandidate = event => {
            if (event.candidate) {
                ws?.send(JSON.stringify({
                    type: 'ice',
                    candidate: event.candidate
                }));
            }
        };

        peerConnection!.ontrack = event => {
            const remoteAudio = new Audio();
            remoteAudio.srcObject = event.streams[0];
            remoteAudio.play();
        };

        peerConnection!.createOffer().then(offer => {
            peerConnection?.setLocalDescription(offer);
            ws?.send(JSON.stringify({ type: 'offer', offer: peerConnection!.localDescription }));
        });
    };

    return (
        <div>
            <h2>WebRTC Voice Chat</h2>
            <div>
                <label htmlFor="roomID">Room ID:</label>
                <input type="text" id="roomID" value={roomID} onChange={(e) => setRoomID(e.target.value)} placeholder="Enter Room ID" />
                <button onClick={handleCreateRoom}>Create Room</button>
            </div>
            <button onClick={handleStartChat} disabled={isChatStarted}>Start Voice Chat</button>
            {/* Disable the specific ESLint rule for the audio element */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio id="remoteAudio" autoPlay controls />
        </div>
    );
}
