import React, { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";

type VideoCallProps = {
  provider: WebrtcProvider;
};

const VideoCall = ({ provider }: VideoCallProps) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidate[]>([]);
  const [videoStart, setVideoStart] = useState<boolean>(false);
  const [isLocalMuted, setIsLocalMuted] = useState<boolean>(false);
  const [isLocalVideoOn, setIsLocalVideoOn] = useState<boolean>(true);
  const [isRemoteMuted, setIsRemoteMuted] = useState<boolean>(true);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState<boolean>(true);
  const [remoteVideoSourceObject, setRemoteVideoSourceObject] =
    useState<boolean>(false);
  const [localVideoSourceObject, setLocalVideoSourceObject] =
    useState<boolean>(false);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        provider.awareness.setLocalStateField("webrtc", {
          type: "candidate",
          candidate: event.candidate,
        });
        console.log("Sent ICE candidate:", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track);
      if (remoteStreamRef.current) {
        remoteStreamRef.current.addTrack(event.track);
      } else {
        remoteStreamRef.current = new MediaStream([event.track]);
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        setRemoteVideoSourceObject(true);
      }
    };

    peerConnectionRef.current = pc;
    //startCall();
    return () => {
      if (pc) {
        pc.close();
      }
    };
  }, [provider]);

  useEffect(() => {
    const awarenessListener = ({ added, updated, removed }) => {
      added.concat(updated).forEach((clientId) => {
        if (clientId !== provider.awareness.clientID) {
          const state = provider.awareness.getStates().get(clientId);
          if (state && state.webrtc) {
            handleSignalingMessage(state.webrtc, clientId);
          }
        }
      });

      removed.forEach((clientId) => {
        console.log("Client disconnected:", clientId);
        if (remoteVideoRef.current) {
          if (clientId !== provider.awareness.clientID) {
            remoteVideoRef.current.srcObject = null;
            remoteStreamRef.current = null;
            setRemoteVideoSourceObject(false);
          } else {
            setVideoStart(false);
          }
          console.log("Remote video stopped");
        }
      });
    };

    provider.awareness.on("change", awarenessListener);
    const handleReconnect = async () => {
      if (peerConnectionRef.current) {
        const state = provider.awareness.getLocalState();
        if (state && state.webrtc) {
          handleSignalingMessage(state.webrtc, provider.awareness.clientID);
        }
        if (localStreamRef.current) {
          localStreamRef.current
            .getTracks()
            .forEach((track) =>
              peerConnectionRef.current.addTrack(track, localStreamRef.current)
            );
        }
      }
    };

    provider.on("sync", handleReconnect);

    return () => {
      provider.awareness.off("change", awarenessListener);
      provider.off("sync", handleReconnect);
    };
  }, [provider]);

  const handleSignalingMessage = async (message, from) => {
    if (peerConnectionRef.current) {
      switch (message.type) {
        case "offer":
          console.log("Received offer:", message.offer);
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(message.offer)
          );
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          provider.awareness.setLocalStateField("webrtc", {
            type: "answer",
            answer: answer,
          });
          await processIceCandidatesQueue();
          console.log("Sent answer:", answer);
          break;
        case "answer":
          console.log("Received answer:", message.answer);
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(message.answer)
          );
          await processIceCandidatesQueue();

          break;
        case "candidate":
          console.log("Received ICE candidate:", message.candidate);
          if (peerConnectionRef.current?.remoteDescription) {
            await peerConnectionRef.current?.addIceCandidate(
              new RTCIceCandidate(message.candidate)
            );
          } else {
            iceCandidatesQueue.current.push(
              new RTCIceCandidate(message.candidate)
            );
          }
          break;
        default:
          break;
      }
    }
  };

  const processIceCandidatesQueue = async () => {
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      await peerConnectionRef.current?.addIceCandidate(candidate);
    }
  };

  const startCall = async () => {
    setVideoStart(true);
    console.log(peerConnectionRef.current);
    if (peerConnectionRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnectionRef.current.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        setLocalVideoSourceObject(true);
      }

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      provider.awareness.setLocalStateField("webrtc", {
        type: "offer",
        offer: offer,
      });
      console.log("Sent offer:", offer);
    }
  };

  const toggleLocalMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current?.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalMuted((prev) => !prev);
    }
  };

  const toggleLocalVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current?.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalVideoOn((prev) => !prev);
    }
  };

  const toggleRemoteMute = () => {
    setIsRemoteMuted((prev) => !prev);
  };

  const toggleRemoteVideo = () => {
    if (remoteStreamRef.current) {
      remoteStreamRef.current?.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsRemoteVideoOn((prev) => !prev);
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        <div>
          <video
            className="rounded-xl"
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "200px" }}
          />
          {localVideoSourceObject && (
            <div>
              <button onClick={toggleLocalMute}>
                {isLocalMuted ? "🔇" : "🔊"}
              </button>
              <button onClick={toggleLocalVideo}>
                {isLocalVideoOn ? "📷" : "📵"}
              </button>
            </div>
          )}
        </div>

        <div>
          <video
            className="rounded-xl"
            ref={remoteVideoRef}
            autoPlay
            muted={isRemoteMuted}
            style={{ width: "200px" }}
          />
          {remoteVideoSourceObject && (
            <div>
              <button onClick={toggleRemoteMute}>
                {isRemoteMuted ? "🔇" : "🔊"}
              </button>
              <button onClick={toggleRemoteVideo}>
                {isRemoteVideoOn ? "📷" : "📵"}
              </button>
            </div>
          )}
        </div>
      </div>
      {!videoStart && <button onClick={startCall}>Start Call</button>}
    </div>
  );
};

export default VideoCall;
