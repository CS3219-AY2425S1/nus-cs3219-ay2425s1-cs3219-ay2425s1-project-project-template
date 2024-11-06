'use client';

import React, { useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import SimplePeer, { Instance } from 'simple-peer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';

const AudioSharing = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Instance | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const initializedRef = useRef(false); // To track initialization

  const SERVER_URL =
    process.env.NEXT_PUBLIC_AUDIO_SERVER_URL || 'http://localhost:5555';

  const cleanupAudio = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      audioStreamRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setIsAudioEnabled(false);
  };

  const createPeer = (stream: MediaStream, initiator: boolean) => {
    console.log('Creating peer as initiator:', initiator);

    const peer = new SimplePeer({
      initiator,
      stream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
      },
    });

    peer.on('signal', (data: any) => {
      console.log('Sending signal data:', data);
      socketRef.current?.emit('signal', data);
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      console.log('Received remote stream');
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error));
    });

    peer.on('error', (err: any) => {
      console.error('Peer connection error:', err);
      cleanupAudio();
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      cleanupAudio();
    });

    return peer;
  };

  const initializeSocketAndPeer = () => {
    if (initializedRef.current) return; // Prevent re-initialization
    initializedRef.current = true;

    socketRef.current = io(SERVER_URL, {
      transports: ['websocket'],
      path: '/socket.io/',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
      cleanupAudio();
    });

    socketRef.current.on('signal', async (data: any) => {
      console.log('Received signal data:', data);

      if (data.type === 'offer' && !peerRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
          // Initially muted
          stream.getTracks().forEach((track) => {
            track.enabled = false;
          });
          audioStreamRef.current = stream;
          peerRef.current = createPeer(stream, false);
        } catch (error) {
          console.error('Error accessing audio devices:', error);
          cleanupAudio();
        }
      }

      if (peerRef.current) {
        try {
          peerRef.current.signal(data);
        } catch (error) {
          console.error('Error signaling peer:', error);
          cleanupAudio();
        }
      }
    });
  };

  const toggleAudio = async () => {
    initializeSocketAndPeer(); // Ensure initialization happens once

    try {
      if (!audioStreamRef.current) {
        // First time enabling audio - need to set up the stream and peer
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        audioStreamRef.current = stream;
        if (!peerRef.current) {
          peerRef.current = createPeer(stream, true);
        }
        stream.getTracks().forEach((track) => {
          track.enabled = true;
        });
        setIsAudioEnabled(true);
      } else {
        // Just toggle the existing stream
        const newEnabledState = !isAudioEnabled;
        audioStreamRef.current.getTracks().forEach((track) => {
          track.enabled = newEnabledState;
        });
        setIsAudioEnabled(newEnabledState);
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
      cleanupAudio();
    }
  };

  return (
    <div>
      <button onClick={toggleAudio}>
        <FontAwesomeIcon
          icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash}
        />
        {isAudioEnabled ? ' Mute' : ' Unmute'}
      </button>
    </div>
  );
};

export default AudioSharing;
