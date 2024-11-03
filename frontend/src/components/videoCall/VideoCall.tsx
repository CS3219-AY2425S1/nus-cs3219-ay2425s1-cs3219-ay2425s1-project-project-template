import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface VideoCallSectionProps {
  communicationSocket: Socket | null;
  roomId: string;
}

function VideoCall({ communicationSocket, roomId }: VideoCallSectionProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    if (!communicationSocket || !roomId) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error.message);
      });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [communicationSocket, roomId]);

  useEffect(() => {
    if (!localStream || !communicationSocket) return;

    const newPeerConnection = new RTCPeerConnection(config);

    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        communicationSocket.emit('candidate', event.candidate);
      }
    };

    newPeerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    localStream.getTracks().forEach((track) => newPeerConnection.addTrack(track, localStream));

    communicationSocket.on('offer', async (offer) => {
      await newPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await newPeerConnection.createAnswer();
      await newPeerConnection.setLocalDescription(answer);
      communicationSocket.emit('answer', answer);
    });

    communicationSocket.on('answer', (answer) => {
      newPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    communicationSocket.on('candidate', (candidate) => {
      newPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // Listen for user-joined event to start the call
    communicationSocket.on('user-joined', async () => {
        if (newPeerConnection && communicationSocket) {
            setTimeout(async () => {
                const offer = await newPeerConnection.createOffer();
                await newPeerConnection.setLocalDescription(offer);
                communicationSocket.emit('offer', offer);
            }, 2000);
        }
    });

    // Handle user disconnected event
    communicationSocket.on('user-left', () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null; // Reset remote video
      }
    });

    return () => {
      newPeerConnection.close();
      communicationSocket.off('offer');
      communicationSocket.off('answer');
      communicationSocket.off('candidate');
      communicationSocket.off('user-joined'); // Clean up listener
      communicationSocket.off('user-left'); // Clean up listener
    };
  }, [localStream, communicationSocket]);

  return (
    <>
        <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
            width: '245px',  // Fixed width
            height: '160px', // Fixed height
            borderRadius: '8px',
            objectFit: 'cover', // Maintain aspect ratio and fill the box
            border: '1px solid rgba(0, 0, 0, 0.2)', // Optional faint outline
            }}
        />
        <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
            width: '245px',  // Adjusted to match local video for better alignment
            height: '160px', // Fixed height
            borderRadius: '8px',
            objectFit: 'cover', // Maintain aspect ratio and fill the box
            border: '1px solid rgba(0, 0, 0, 0.2)', // Optional faint outline
            }}
        />
    </>
  );
};

export default VideoCall;
