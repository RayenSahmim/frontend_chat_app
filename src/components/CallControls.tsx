import { Button, Tooltip, Space } from "antd";
import {
  PhoneFilled,
  PhoneOutlined,
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";

interface CallControlsProps {
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  handleMuteAudio: () => void;
  handleMuteVideo: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
}

const CallControls: React.FC<CallControlsProps> = ({
  isCalling,
  startCall,
  endCall,
  handleMuteAudio,
  handleMuteVideo,
  isAudioMuted,
  isVideoMuted,
}) => {
  return (
    <div className="flex items-center space-x-2 justify-end">
      <Space>
        {/* Start/End Call Button */}
        <Tooltip title={isCalling ? "End Call" : "Start Call"}>
          <Button
            shape="circle"
            icon={isCalling ? <PhoneFilled /> : <PhoneOutlined />}
            onClick={isCalling ? endCall : startCall}
            style={{
              backgroundColor: isCalling ? "#ff4d4f" : "#1890ff",
              borderColor: isCalling ? "#ff4d4f" : "#1890ff",
              color: "white",
              transition: "background-color 0.3s, transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            className="flex items-center justify-center hover:scale-105 active:scale-95 hover:shadow-lg"
          />
        </Tooltip>
          {isCalling && (
            <>
            <Tooltip title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}>
            <Button
              shape="circle"
              icon={isAudioMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={handleMuteAudio}
              style={{
                backgroundColor: isAudioMuted ? "#ff6347" : "#1890ff",
                borderColor: isAudioMuted ? "#ff6347" : "#1890ff",
                color: "white",
                transition: "background-color 0.3s, transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              className="flex items-center justify-center hover:scale-105 active:scale-95 hover:shadow-lg"
            />
          </Tooltip>
  
          <Tooltip title={isVideoMuted ? "Unmute Video" : "Mute Video"}>
            <Button
              shape="circle"
              icon={isVideoMuted ? <VideoCameraAddOutlined /> : <VideoCameraOutlined />}
              onClick={handleMuteVideo}
              style={{
                backgroundColor: isVideoMuted ? "#ff6347" : "#1890ff",
                borderColor: isVideoMuted ? "#ff6347" : "#1890ff",
                color: "white",
                transition: "background-color 0.3s, transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              className="flex items-center justify-center hover:scale-105 active:scale-95 hover:shadow-lg"
            />
          </Tooltip>
          </>
          )}
        

 
      </Space>
    </div>
  );
};

export default CallControls;
