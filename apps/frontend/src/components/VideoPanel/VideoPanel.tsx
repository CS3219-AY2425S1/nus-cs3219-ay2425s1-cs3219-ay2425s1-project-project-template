import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import "./styles.scss";
import { Button } from "antd";
import {
  ApiOutlined,
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
      console.log(userStream.getVideoTracks());
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

  return (
    <div className="video-panel">
      <p className="header-tag">Video Feed for: {currentUsername}</p>
      <video
        className="user-video"
        playsInline
        ref={currentUserVideoRef}
        autoPlay
        muted
      />
      <Button
        onClick={toggleVideo}
        icon={<VideoCameraOutlined />}
        type={videoOn ? "default" : "primary"}
      >
        {videoOn ? "Off Webcam" : "On Webcam"}
      </Button>
      <Button onClick={handleCall} icon={<ApiOutlined />} type="primary">
        Initiate Call
      </Button>
      <p className="header-tag">Video Feed for: {matchedUsername}</p>
      <video
        className="matched-user-video"
        playsInline
        ref={remoteVideoRef}
        autoPlay
        muted
      />
    </div>
  );
};

export default VideoPanel;
