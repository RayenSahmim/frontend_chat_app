import { Button, Modal, Typography, Space } from "antd";
import { PhoneFilled, AudioMutedOutlined, AudioOutlined, VideoCameraOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
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

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Function to toggle microphone
  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => (track.enabled = !isMicOn));
      setIsMicOn(prev => !prev);
    }
  };

  // Function to toggle camera
  const toggleCamera = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => (track.enabled = !isCameraOn));
      setIsCameraOn(prev => !prev);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
    >
      <div className="flex flex-col items-center space-y-4">
        <Typography.Text className="font-bold text-xl">{callerName}</Typography.Text>
        <Typography.Text>On Video Call</Typography.Text>
        <div className="video-container flex space-x-4">
          <video ref={localVideoRef} autoPlay muted className={`w-1/2 ${isCameraOn ? "" : "hidden"}`} /> {/* Local video */}
          {remoteStream && <video ref={remoteVideoRef} autoPlay className="w-1/2" />} {/* Remote video */}
        </div>
        <Space className="mt-4">
          <Button 
            onClick={toggleMic} 
            icon={isMicOn ? <AudioOutlined /> : <AudioMutedOutlined />} 
            className="bg-blue-500 text-white"
          >
            {isMicOn ? "Mute Mic" : "Unmute Mic"}
          </Button>
          <Button 
            onClick={toggleCamera} 
            icon={isCameraOn ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />} 
            className="bg-blue-500 text-white"
          >
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </Button>
          <Button 
            onClick={onClose} 
            icon={<PhoneFilled />} 
            className="bg-red-600 text-white"
          >
            End Call
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default CallModal;
