'use client'

import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'

interface VideoChatProps {
  appId: string
  channel: string
  token: string
  userId: string
}

export default function VideoChat({ appId, channel, token, userId }: VideoChatProps) {
  const [client] = useState<IAgoraRTCClient>(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }))
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true)
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true)

  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        setRemoteUsers((prevUsers) => [...prevUsers, user])

        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current)
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play()
        }
      })

      client.on('user-unpublished', (user) => {
        setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid))
      })

      await client.join(appId, channel, token, userId)

      const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
      localTracks[1].play(localVideoRef.current!)
      await client.publish(localTracks)

      return () => {
        localTracks[0].close()
        localTracks[1].close()
        client.leave()
      }
    }

    init()

    return () => {
      client.removeAllListeners()
    }
  }, [appId, channel, token, userId, client])

  const toggleAudio = async () => {
    setLocalAudioEnabled(!localAudioEnabled)
    localAudioEnabled ? await client.unpublish([client.localTracks[0]]) : await client.publish([client.localTracks[0]])
  }

  const toggleVideo = async () => {
    setLocalVideoEnabled(!localVideoEnabled)
    localVideoEnabled ? await client.unpublish([client.localTracks[1]]) : await client.publish([client.localTracks[1]])
  }

  return (
    <div className="video-chat">
      <div className="local-video" ref={localVideoRef}></div>
      <div className="remote-video" ref={remoteVideoRef}></div>

      <div className="controls">
        <button onClick={toggleAudio}>{localAudioEnabled ? 'Mute' : 'Unmute'} Audio</button>
        <button onClick={toggleVideo}>{localVideoEnabled ? 'Turn Off' : 'Turn On'} Video</button>
      </div>
    </div>
  )
}