import React from "react";
import { Modal, Button, Typography } from "antd";
import { PhoneOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface IncomingCallModalProps {
  visible: boolean;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  visible,
  callerName,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal
      title="Incoming Call"
      open={visible}
      onCancel={onDecline}
      footer={null}
      closable={false}
      centered
    >
      <div className="flex flex-col items-center space-y-4">
        <Text strong>{callerName} is calling you...</Text>
        <div className="flex space-x-4">
          <Button
            type="primary"
            shape="circle"
            icon={<PhoneOutlined />}
            onClick={onAccept}
            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
          />
          <Button
            type="default"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={onDecline}
            danger
          />
        </div>
      </div>
    </Modal>
  );
};

export default IncomingCallModal;
