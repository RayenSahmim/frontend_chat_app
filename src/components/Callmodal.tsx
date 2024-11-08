import { Button, Modal, Typography, Space, Divider } from "antd";
import { PhoneFilled, AudioMutedOutlined, AudioOutlined, VideoCameraOutlined, VideoCameraAddOutlined, DesktopOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

interface CallModalProps {
  visible: boolean;
  onClose: () => void;
  callerName: string;
  remoteStream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement>;
}

const CallModal = ({ visible, onClose, callerName, remoteStream, localVideoRef }: CallModalProps) => {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Toggle microphone
  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => (track.enabled = !isMicOn));
      setIsMicOn(prev => !prev);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => (track.enabled = !isCameraOn));
      setIsCameraOn(prev => !prev);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isSharingScreen) {
      try {
        const screenMediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(screenMediaStream);
        if (localVideoRef.current) localVideoRef.current.srcObject = screenMediaStream;
        setIsSharingScreen(true);
      } catch (error) {
        console.error("Screen sharing failed:", error);
      }
    } else {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      setScreenStream(null);
      setIsSharingScreen(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={800} // Increase the modal width
      className="custom-call-modal"
    >
      <div className="flex flex-col items-center space-y-6">
        <Typography.Title level={3} className="text-center">
          {callerName} is calling...
        </Typography.Title>
        
        <Divider />
        
        <Typography.Text type="secondary">On Video Call</Typography.Text>
        
        <div className="video-container flex justify-center space-x-4">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className={`rounded-lg shadow-lg w-1/2 ${isCameraOn || isSharingScreen ? "" : "hidden"}`}
          />
          {remoteStream && (
            <video
              ref={remoteVideoRef}
              autoPlay
              className="rounded-lg shadow-lg w-1/2"
            />
          )}
        </div>
        
        <Divider />
        
        <Space className="flex justify-center">
          <Button 
            onClick={toggleMic} 
            icon={isMicOn ? <AudioOutlined /> : <AudioMutedOutlined />} 
            type="primary" 
            shape="round" 
            size="large"
          >
            {isMicOn ? "Mute Mic" : "Unmute Mic"}
          </Button>
          <Button 
            onClick={toggleCamera} 
            icon={isCameraOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />} 
            type="primary" 
            shape="round" 
            size="large"
          >
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </Button>
          <Button 
            onClick={toggleScreenShare} 
            icon={<DesktopOutlined />} 
            type="primary" 
            shape="round" 
            size="large"
          >
            {isSharingScreen ? "Stop Sharing" : "Share Screen"}
          </Button>
          <Button 
            onClick={onClose} 
            icon={<PhoneFilled />} 
            type="primary" 
            danger 
            shape="round" 
            size="large"
          >
            End Call
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default CallModal;
