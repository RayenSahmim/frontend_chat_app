import { Button, Modal, Typography } from "antd";
import { useEffect, useRef } from "react";
import { PhoneFilled } from "@ant-design/icons";
interface CallModalProps {
    visible: boolean;
    onClose: () => void;
    callerName: string;
    remoteStream: MediaStream | null;
  }
  
  const CallModal = ({ visible, onClose, callerName, remoteStream }: CallModalProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
  
    useEffect(() => {
      if (remoteStream && audioRef.current) {
        audioRef.current.srcObject = remoteStream;
      }
    }, [remoteStream]);
  
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
          <Typography.Text>On Call</Typography.Text>
          {remoteStream && <audio ref={audioRef} autoPlay />}
          <Button onClick={onClose} icon={<PhoneFilled />} className="bg-red-600 text-white">
            End Call
          </Button>
        </div>
      </Modal>
    );
  };
  
  export default CallModal;