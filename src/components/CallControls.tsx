import { Mic, MicOff, PhoneOff, Video, VideoOff , ScreenShare , ScreenShareOff} from 'lucide-react';

import ControlButton from './ControlButton';

interface CallControlsProps {
  isCalling: boolean;
  isScreenSharing : boolean ;
  endCall: () => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  handleMuteAudio: () => void;
  handleMuteVideo: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
}



export const CallControls = ({
  isCalling,
  isScreenSharing,
  endCall,
  startScreenShare,
  stopScreenShare,
  handleMuteAudio,
  handleMuteVideo,
  isAudioMuted,
  isVideoMuted,
}: CallControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-2 px-4 p-1 border border-gray-700 bg-gray-700 max-w-96 mx-auto absolute bottom-10 left-1/2 transform -translate-x-1/2 rounded-full ">
      {isCalling && (
        <>
          <ControlButton
            onClick={handleMuteAudio}
            icon={isAudioMuted ? <MicOff className="w-5 h-5 " /> : <Mic className="w-5 h-5 text-white hover:text-gray-700" />}
            tooltip={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            active={isAudioMuted}
          />
          <ControlButton
            onClick={handleMuteVideo}
            icon={isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-white hover:text-gray-700" />}
            tooltip={isVideoMuted ? 'Enable Video' : 'Disable Video'}
            active={isVideoMuted}
          />
          <ControlButton
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            icon={isScreenSharing ? <ScreenShareOff className="w-5 h-5" /> : <ScreenShare className="w-5 h-5 text-white hover:text-gray-700" />}
            tooltip={!isScreenSharing ? 'screen share' : 'stop screen share'}
            active={isScreenSharing}
          />
          <ControlButton
            onClick={endCall}
            icon={<PhoneOff className="w-5 h-5" />}
            tooltip="End Call"
            active={true}
          />
        </>
      ) }
    </div>
  );
};