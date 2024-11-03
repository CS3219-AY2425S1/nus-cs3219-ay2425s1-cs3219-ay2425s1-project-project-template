"use client";

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { ILocalVideoTrack, IRemoteVideoTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/api-user';

export default function CollaborationPage() {
  const [localTrack, setLocalTrack] = useState<ILocalVideoTrack | null>(null);
  const [remoteTracks, setRemoteTracks] = useState<IRemoteVideoTrack[]>([]);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string>('');
  const client = useRef(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));

  const router = useRouter();

  useEffect(() => {
    // Fetch user data and assign userId
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await verifyToken(token);
      setUserId(res.data.username);
    };

    fetchUserId();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const initAgora = async () => {
      const uid = userId || 'user-' + Math.floor(Math.random() * 10000); // Placeholder if userId isn't set
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;

      if (!appId) {
        console.error('Agora App ID not found. Please check your .env.local file.');
        return;
      }

      client.current.join(appId, 'channel-name', null, uid)
        .then(async () => {
          const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
          const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

          setLocalTrack(localVideoTrack);

          localVideoTrack.play(localVideoRef.current || '');
          client.current.publish([localVideoTrack, localAudioTrack]);

          client.current.on('user-published', async (user, mediaType) => {
            await client.current.subscribe(user, mediaType);
            if (mediaType === 'video') {
              const remoteVideoTrack = user.videoTrack;
              if (remoteVideoTrack) {
                setRemoteTracks(prev => [...prev, remoteVideoTrack]);
                remoteVideoTrack.play(remoteVideoRef.current || '');
              }
            }
          });
        });
    };

    initAgora();

    return () => {
      client.current.leave();
      if (localTrack) localTrack.stop();
      setRemoteTracks([]);
    };
  }, [userId]);

  const toggleVideo = () => {
    if (localTrack) {
      localTrack.setEnabled(!localTrack.enabled);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Session</CardTitle>
        </CardHeader>
      </Card>

      <div style={{ position: 'fixed', bottom: '10px', left: '10px', display: 'flex' }}>
        <div ref={localVideoRef} style={{ width: '120px', height: '90px', backgroundColor: 'black', marginRight: '10px' }}>
          {/* Local video display */}
        </div>
        <div ref={remoteVideoRef} style={{ width: '120px', height: '90px', backgroundColor: 'black' }}>
          {/* Remote video display */}
        </div>
      </div>

      <button onClick={toggleVideo}>Toggle Video</button>
    </div>
  );
}
