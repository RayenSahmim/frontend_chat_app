import React, { useState } from "react";
import { Button, Space, Tooltip } from "antd";
import {
  PhoneOutlined,
  PhoneFilled,
  VideoCameraOutlined,
  VideoCameraFilled,
  StopOutlined,
} from "@ant-design/icons";

interface CallControlsProps {
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  logout: () => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
}

const CallControls: React.FC<CallControlsProps> = ({
  isCalling,
  startCall,
  endCall,
  logout,
  localVideoRef,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current?.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !isMuted));
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (localVideoRef.current?.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = videoEnabled));
    }
  };

  return (
    <Space className="flex justify-between w-full mb-3">
      {isCalling ? (
        <>
          <Tooltip title="End Call">
            <Button color="danger" shape="circle" icon={<StopOutlined />} onClick={endCall} />
          </Tooltip>
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <Button
              type="primary"
              shape="circle"
              icon={<PhoneOutlined />}
              onClick={toggleMute}
            />
          </Tooltip>
          <Tooltip title={videoEnabled ? "Turn Video Off" : "Turn Video On"}>
            <Button
              type="primary"
              shape="circle"
              icon={videoEnabled ? <VideoCameraFilled /> : <VideoCameraOutlined />}
              onClick={toggleVideo}
            />
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Start Call">
          <Button type="primary" icon={<PhoneFilled />} onClick={startCall}>
            Start Call
          </Button>
        </Tooltip>
      )}
      <Tooltip title="Logout">
        <Button type="default" onClick={logout}>
          Logout
        </Button>
      </Tooltip>
    </Space>
  );
};

export default CallControls;
