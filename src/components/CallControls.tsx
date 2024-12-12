import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from 'lucide-react';
import { Tooltip } from 'antd';
import { cn } from '../lib/utils';

interface CallControlsProps {
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  handleMuteAudio: () => void;
  handleMuteVideo: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
}

const ControlButton = ({
  onClick,
  icon,
  tooltip,
  active,
}: {
  onClick: () => void;
  icon: JSX.Element;
  tooltip: string;
  active?: boolean;
}) => (
  <Tooltip title={tooltip} placement="bottom">
    <button
      onClick={onClick}
      className={cn(
        'p-3 rounded-full transition-all duration-200 ease-in-out',
        active
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {icon}
    </button>
  </Tooltip>
);

export const CallControls = ({
  isCalling,
  startCall,
  endCall,
  handleMuteAudio,
  handleMuteVideo,
  isAudioMuted,
  isVideoMuted,
}: CallControlsProps) => {
  return (
    <div className="flex items-center gap-2 bg-white p-1 rounded-lg">
      {isCalling ? (
        <>
          <ControlButton
            onClick={handleMuteAudio}
            icon={isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            tooltip={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            active={isAudioMuted}
          />
          <ControlButton
            onClick={handleMuteVideo}
            icon={isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            tooltip={isVideoMuted ? 'Enable Video' : 'Disable Video'}
            active={isVideoMuted}
          />
          <ControlButton
            onClick={endCall}
            icon={<PhoneOff className="w-5 h-5" />}
            tooltip="End Call"
            active={true}
          />
        </>
      ) : (
        <ControlButton
          onClick={startCall}
          icon={<Phone className="w-5 h-5" />}
          tooltip="Start Call"
        />
      )}
    </div>
  );
};