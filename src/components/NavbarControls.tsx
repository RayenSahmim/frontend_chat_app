import { MoreVerticalIcon, Phone } from "lucide-react";
import { Tooltip } from "antd";
import { useNotificationsContext } from "../Providers/NotificationsProvider";
import { NotificationsDropdown } from "./NotificationsDropdown";
import ControlButton from "./ControlButton";

interface NavbarControlsProps {
  isCalling: boolean;
  startCall: () => void;
}

const NavbarControls = ({ isCalling, startCall }: NavbarControlsProps) => {
  const {
    notifications,
    markNotificationsAsRead,
    markAllNotificationsAsRead,
    isLoading,
  } = useNotificationsContext();

  return (
    <div className="flex items-center gap-3 px-4">
      <ControlButton
        onClick={startCall}
        icon={<Phone className="w-5 h-5" />}
        tooltip="Start Call"
        disabled={isCalling}
      />

      <div className="flex items-center gap-3">
        <NotificationsDropdown
          notifications={notifications}
          isLoading={isLoading}
          onMarkAsRead={markNotificationsAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />

        <Tooltip title="More" placement="bottom">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavbarControls;
