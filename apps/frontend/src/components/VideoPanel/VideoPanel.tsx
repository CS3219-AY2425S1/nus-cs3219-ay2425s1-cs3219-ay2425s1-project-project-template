import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import "./styles.scss";
import { Button } from "antd";
import {
  ApiOutlined,
  AudioMutedOutlined,
  AudioOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const VideoPanel = () => {
  const matchId = localStorage.getItem("collabId")?.toString() ?? "";
  const currentUsername = localStorage.getItem("user")?.toString();
  const matchedUsername = localStorage.getItem("matchedUser")?.toString();
  const currentId = currentUsername + "-" + matchId ?? "";
  const partnerId = matchedUsername + "-" + matchId ?? "";

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [callInstance, setCallInstance] = useState<MediaConnection | null>(
    null
  );
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [videoOn, setVideoOn] = useState<boolean>(true);
  const [muteOn, setMuteOn] = useState<boolean>(false);

  const handleCall = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (peerInstance) {
          const call = peerInstance?.call(partnerId, stream);
          setCallInstance(call);
          if (call) {
            call.on("stream", (userVideoStream: MediaStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = userVideoStream;
              }
            });

            if (userStream) {
              const videoTrack = userStream.getVideoTracks()[0];

              const sender = call.peerConnection.getSenders().find((s) => {
                if (s.track) {
                  return s.track.kind === "video";
                }
              });
              if (sender) {
                sender.replaceTrack(videoTrack); // Replace the video track in the call
              }

              const audioTrack = userStream.getAudioTracks()[0];

              const sender2 = call.peerConnection.getSenders().find((s) => {
                if (s.track) {
                  return s.track.kind === "audio";
                }
              });
              if (sender2) {
                sender2.replaceTrack(audioTrack); // Replace the video track in the call
              }
            }
          }
        }
      });
  };

  useEffect(() => {
    if (currentId) {
      let peer: Peer;
      if (typeof window !== "undefined") {
        peer = new Peer(
          currentId
          //     {
          //   host: "localhost",
          //   port: 4444,
          //   path: "/",
          // }
        );

        setPeerInstance(peer);

        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            setUserStream(stream);
            if (currentUserVideoRef.current) {
              currentUserVideoRef.current.srcObject = stream;
            }

            peer.on("call", (call) => {
              call.answer(stream);
              call.on("stream", (userVideoStream) => {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = userVideoStream;
                }
              });
            });
          });
      }
      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, []);

  const toggleVideo = () => {
    if (userStream) {
      const videoTrack = userStream.getVideoTracks()[0];

      if (videoTrack) {
        if (videoOn) {
          // Stop the video track
          videoTrack.enabled = false;

          setVideoOn(false);
          if (callInstance) {
            const sender = callInstance.peerConnection
              .getSenders()
              .find((s) => {
                if (s.track) {
                  return s.track.kind === "video";
                }
              });
            if (sender) {
              sender.replaceTrack(videoTrack); // Replace the video track in the call
            }
          }
        } else {
          // Resume the video track
          videoTrack.enabled = true;
          setVideoOn(true);
        }
      }
    }
  };

  const toggleMute = () => {
    if (userStream) {
      const audioTrack = userStream.getAudioTracks()[0];

      if (audioTrack) {
        if (muteOn) {
          // Unmute the audio track
          audioTrack.enabled = true;
          setMuteOn(false);
        } else {
          // Mute the audio track
          audioTrack.enabled = false;
          setMuteOn(true);

          if (callInstance) {
            const sender = callInstance.peerConnection
              .getSenders()
              .find((s) => {
                if (s.track) {
                  return s.track.kind === "audio";
                }
              });
            if (sender) {
              sender.replaceTrack(audioTrack); // Replace the video track in the call
            }
          }
        }
      }
    }
  };

  return (
    <div className="video-panel">
      {/* <p className="header-tag">Video Feed for: {currentUsername}</p> */}
      <video
        className="user-video"
        playsInline
        ref={currentUserVideoRef}
        autoPlay
      />
      <div className="buttons-container">
        <Button
          onClick={toggleVideo}
          icon={
            videoOn ? (
              <div className="icon-padding">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M21 26H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v4.06l5.42-3.87A1 1 0 0 1 30 9v14a1 1 0 0 1-1.58.81L23 19.94V24a2 2 0 0 1-2 2M4 8v16h17v-6a1 1 0 0 1 1.58-.81L28 21.06V10.94l-5.42 3.87A1 1 0 0 1 21 14V8Z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="icon-padding">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M29.46 8.11a1 1 0 0 0-1 .08L23 12.06v-1.62l7-7L28.56 2L2 28.56L3.44 30l4-4H21a2 2 0 0 0 2-2v-4.06l5.42 3.87A1 1 0 0 0 30 23V9a1 1 0 0 0-.54-.89M28 21.06l-5.42-3.87A1 1 0 0 0 21 18v6H9.44L21 12.44V14a1 1 0 0 0 1.58.81L28 10.94zM4 24V8h16V6H4a2 2 0 0 0-2 2v16z"
                  ></path>
                </svg>
              </div>
            )
          }
          type={videoOn ? "default" : "primary"}
        >
          {videoOn ? "Off Cam" : "On Cam"}
        </Button>
        <Button
          onClick={toggleMute}
          type={!muteOn ? "default" : "primary"}
          icon={muteOn ? <AudioMutedOutlined /> : <AudioOutlined />}
        >
          {muteOn ? "On Mic" : "Off Mic"}
        </Button>
        <Button onClick={handleCall} icon={<ApiOutlined />} type="primary">
          Call
        </Button>
      </div>
      {/* <p className="header-tag">Video Feed for: {matchedUsername}</p> */}
      <video
        className="matched-user-video"
        playsInline
        ref={remoteVideoRef}
        autoPlay
      />
    </div>
  );
};

export default VideoPanel;
