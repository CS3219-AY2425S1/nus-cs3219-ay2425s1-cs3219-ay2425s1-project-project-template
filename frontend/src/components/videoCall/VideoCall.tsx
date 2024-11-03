import { useEffect, useRef, useState } from 'react';
import { Button, Group, Paper } from '@mantine/core';
import { Socket } from 'socket.io-client';

interface VideoCallSectionProps {
  communicationSocket: Socket | null;
  roomId: string;
}

function VideoCall({ communicationSocket, roomId }: VideoCallSectionProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isCallStarted, setIsCallStarted] = useState(false);

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
    setPeerConnection(newPeerConnection);

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

    return () => {
      newPeerConnection.close();
      communicationSocket.off('offer');
      communicationSocket.off('answer');
      communicationSocket.off('candidate');
    };
  }, [localStream, communicationSocket]);

  const startCall = async () => {
    if (peerConnection && communicationSocket) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      communicationSocket.emit('offer', offer);
      setIsCallStarted(true);
    }
  };

  return (
    <Paper>
    <Group justify="center" gap="10px" grow>
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
    </Group>
    <Group justify="center">
        <Button onClick={startCall} disabled={isCallStarted} color="blue">
        {isCallStarted ? 'Call Started' : 'Start Call'}
        </Button>
    </Group>
    </Paper>
  );
};

export default VideoCall;
