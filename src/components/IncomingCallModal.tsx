import React from "react";
import { Modal, Button } from "antd";

interface IncomingCallModalProps {
  visible: boolean;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ visible, callerName, onAccept, onDecline }) => (
  <Modal
    title="Incoming Call"
    open={visible}
    onCancel={onDecline}
    footer={[
      <Button key="decline" onClick={onDecline}>
        Decline
      </Button>,
      <Button key="accept" type="primary" onClick={onAccept}>
        Accept
      </Button>,
    ]}
  >
    <p>{callerName} is calling you...</p>
  </Modal>
);

export default IncomingCallModal;
