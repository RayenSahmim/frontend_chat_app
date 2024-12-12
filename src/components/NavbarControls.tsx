import { Settings } from 'lucide-react';
import { Tooltip } from 'antd';
import { useNotificationsContext } from '../Providers/NotificationsProvider';
import { CallControls } from './CallControls';
import { NotificationsDropdown } from './NotificationsDropdown';

interface NavbarControlsProps {
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  handleMuteAudio: () => void;
  handleMuteVideo: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
}

const NavbarControls = ({
  isCalling,
  startCall,
  endCall,
  handleMuteAudio,
  handleMuteVideo,
  isAudioMuted,
  isVideoMuted,
}: NavbarControlsProps) => {
  const { notifications, markNotificationsAsRead, markAllNotificationsAsRead, isLoading } =
    useNotificationsContext();

  return (
    <div className="flex items-center gap-3 px-4">
      <CallControls
        isCalling={isCalling}
        startCall={startCall}
        endCall={endCall}
        handleMuteAudio={handleMuteAudio}
        handleMuteVideo={handleMuteVideo}
        isAudioMuted={isAudioMuted}
        isVideoMuted={isVideoMuted}
      />

      <div className="flex items-center gap-3">
        <NotificationsDropdown
          notifications={notifications}
          isLoading={isLoading}
          onMarkAsRead={markNotificationsAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />

        <Tooltip title="Settings" placement="bottom">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavbarControls;