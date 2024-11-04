'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const initializedRef = useRef(false);

  const SERVER_URL =
    process.env.NEXT_PUBLIC_AUDIO_SERVER_URL || 'http://localhost:5555';

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const timeoutId = setTimeout(() => {
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

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socketRef.current.on('signal', (data) => {
        if (peerRef.current) {
          peerRef.current.signal(data);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
    };
  }, [SERVER_URL]);

  const enableAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      peerRef.current = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
        config: {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        },
      });

      peerRef.current.on('signal', (data: SimplePeer.SignalData) => {
        console.log('Sending signal data:', data);
        socketRef.current?.emit('signal', data);
      });

      peerRef.current.on('stream', (remoteStream: MediaStream) => {
        const audioElement = document.createElement('audio');
        audioElement.srcObject = remoteStream;
        audioElement.play();
      });

      setIsAudioEnabled(true);
    } catch (error) {
      console.error('Error accessing audio devices:', error);
    }
  };

  return (
    <div>
      <button onClick={enableAudio} disabled={isAudioEnabled}>
        <FontAwesomeIcon
          icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash}
        />
        {isAudioEnabled ? ' Audio Enabled' : ' Enable Audio'}
      </button>
    </div>
  );
};

export default AudioSharing;
