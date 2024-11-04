"use client";

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { ILocalVideoTrack, ILocalAudioTrack, IRemoteVideoTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/api-user';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

export default function VideoDisplay() {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | null>(null);
  const [remoteTracks, setRemoteTracks] = useState<Map<string, IRemoteVideoTrack>>(new Map());
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);
  const [remoteUsername, setRemoteUsername] = useState('');
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string>('');
  const clientRef = useRef(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await verifyToken(token);
        setUserId(res.data.username);
      } catch (error) {
        console.error('Error verifying token:', error);
        router.push('/login');
      }
    };

    fetchUserId();
  }, [router]);

  const playTracks = () => {
    if (localVideoTrack && localVideoRef.current && localVideoEnabled) {
      try {
        localVideoTrack.play(localVideoRef.current);
      } catch (error) {
        console.error('Error playing local video:', error);
      }
    }

    remoteTracks.forEach((track) => {
      if (remoteVideoRef.current && remoteVideoEnabled) {
        try {
          track.play(remoteVideoRef.current);
        } catch (error) {
          console.error('Error playing remote video:', error);
        }
      }
    });
  };

  useEffect(() => {
    playTracks();
  }, [localVideoTrack, remoteTracks, localVideoEnabled, remoteVideoEnabled]);

  useEffect(() => {
    if (!userId) return;

    let mounted = true;

    const initAgora = async () => {
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      if (!appId) {
        console.error('Agora App ID not found');
        return;
      }

      try {
        if (clientRef.current.connectionState === 'CONNECTED') {
          await clientRef.current.leave();
        }

        await clientRef.current.join(appId, 'channel-name', null, userId);
        console.log('Successfully joined channel');

        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: {
            width: 640,
            height: 480,
            frameRate: 30,
            bitrateMin: 400,
            bitrateMax: 1000,
          }
        });
        
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

        if (mounted) {
          setLocalVideoTrack(videoTrack);
          setLocalAudioTrack(audioTrack);
          
          await clientRef.current.publish([videoTrack, audioTrack]);
          console.log('Local tracks published successfully');
        }

        clientRef.current.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
          console.log('Remote user published:', user.uid, mediaType);
          await clientRef.current.subscribe(user, mediaType);
          
          if (mediaType === 'video') {
            if (mounted) {
              if (user.videoTrack) {
                setRemoteTracks(prev => new Map(prev.set(user.uid.toString(), user.videoTrack)));
                setRemoteVideoEnabled(true);
              } else {
                setRemoteVideoEnabled(false);
              }
              // Set remote username from user metadata if available
              setRemoteUsername(user.uid.toString());
            }
          } else if (mediaType === 'audio') {
            setRemoteAudioEnabled(true);
          }
        });

        clientRef.current.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
          console.log('Remote user unpublished:', user.uid, mediaType);
          if (mediaType === 'video' && mounted) {
            setRemoteTracks(prev => {
              const newTracks = new Map(prev);
              newTracks.delete(user.uid.toString());
              return newTracks;
            });
            setRemoteVideoEnabled(false);
          } else if (mediaType === 'audio') {
            setRemoteAudioEnabled(false);
          }
        });

        clientRef.current.on('user-left', (user: IAgoraRTCRemoteUser) => {
          console.log('Remote user left:', user.uid);
          if (mounted) {
            setRemoteTracks(prev => {
              const newTracks = new Map(prev);
              newTracks.delete(user.uid.toString());
              return newTracks;
            });
            setRemoteVideoEnabled(false);
            setRemoteAudioEnabled(false);
            setRemoteUsername('');
          }
        });

      } catch (error) {
        console.error('Error initializing Agora:', error);
      }
    };

    initAgora();

    return () => {
      mounted = false;
      
      const cleanup = async () => {
        if (localVideoTrack) {
          localVideoTrack.stop();
          localVideoTrack.close();
        }
        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
        }

        remoteTracks.forEach(track => {
          track.stop();
          track.close();
        });
        setRemoteTracks(new Map());

        if (clientRef.current.connectionState === 'CONNECTED') {
          await clientRef.current.leave();
        }
      };
      
      cleanup();
    };
  }, [userId]);

  const toggleVideo = async () => {
    if (localVideoTrack) {
      try {
        await localVideoTrack.setEnabled(!localVideoEnabled);
        setLocalVideoEnabled(!localVideoEnabled);
      } catch (error) {
        console.error('Error toggling video:', error);
      }
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      try {
        await localAudioTrack.setEnabled(!localAudioEnabled);
        setLocalAudioEnabled(!localAudioEnabled);
      } catch (error) {
        console.error('Error toggling audio:', error);
      }
    }
  };

  const VideoContainer = ({ isLocal = false }) => {
    const [showControls, setShowControls] = useState(false);
    const isVideoEnabled = isLocal ? localVideoEnabled : remoteVideoEnabled;
    const isAudioEnabled = isLocal ? localAudioEnabled : remoteAudioEnabled;
    const username = isLocal ? userId : remoteUsername;
    const videoRef = isLocal ? localVideoRef : remoteVideoRef;

    return (
      <div
        className="relative w-48 h-36 rounded-lg shadow-md overflow-hidden bg-gray-900"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div 
          ref={videoRef} 
          className={`w-full h-full ${!isVideoEnabled ? 'hidden' : ''}`} 
        />
        {!isVideoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-2xl font-bold">
            {getInitials(username || 'Remote User')}
          </div>
        )}
        
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 flex justify-center space-x-2 z-10">
            {isLocal ? (
              <>
                <button
                  onClick={toggleVideo}
                  className="p-1 rounded-full hover:bg-gray-700 text-white"
                >
                  {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                <button
                  onClick={toggleAudio}
                  className="p-1 rounded-full hover:bg-gray-700 text-white"
                >
                  {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <span className={`p-1 text-white ${isVideoEnabled ? 'opacity-100' : 'opacity-50'}`}>
                  {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                </span>
                <span className={`p-1 text-white ${isAudioEnabled ? 'opacity-100' : 'opacity-50'}`}>
                  {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
      <div className="fixed bottom-4 left-4 flex space-x-4 mx-3">
        <VideoContainer isLocal={true} />
        <VideoContainer isLocal={false} />
      </div>
  );
}