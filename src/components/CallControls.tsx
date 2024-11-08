import { Button } from "antd";
import { PhoneFilled, PhoneOutlined,LogoutOutlined  } from "@ant-design/icons";
import CallModal from "./Callmodal";

interface CallControlsProps {
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  callerName: string;
  remoteStream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement>; // Add local video ref prop
  logout: () => void;
}



const CallControls: React.FC<CallControlsProps> = ({
  isCalling,
  startCall,
  endCall,
  callerName,
  remoteStream,
  localVideoRef,
  logout,
}) => (
  <div className="flex items-center space-x-4 justify-end">
    {" "}
    <Button
      type="primary"
      shape="round"
      onClick={isCalling ? endCall : startCall}
      icon={isCalling ? <PhoneFilled /> : <PhoneOutlined />}
      className="flex items-center justify-center"
    >

      {" "}
      {isCalling ? "End Call" : "Call"}{" "}
    </Button>{" "}

    <Button
      type="primary"
      color="danger"
      variant="outlined"
      shape="round"
      onClick={logout}
      icon={<LogoutOutlined />}
      className="flex items-center justify-center"
    > 
      Logout
    </Button>{" "}
    <CallModal
      visible={isCalling}
      onClose={endCall}
      callerName={callerName || "Unknown"}
      remoteStream={remoteStream}
      localVideoRef={localVideoRef}
    />{" "}
  </div>
);

export default CallControls;
