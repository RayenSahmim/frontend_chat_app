import { Bell } from 'lucide-react';
import { Badge, Dropdown, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { NotificationItem } from './NotificationItem';

interface Notification {
  _id: string;
  from: string;
  content: string;
  timestamp: string;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDropdown = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsDropdownProps) => {
  const items: MenuProps['items'] = notifications.map((notification, index) => ({
    key: index.toString(),
    label: (
      <NotificationItem
        from={notification.from}
        content={notification.content}
        timestamp={notification.timestamp}
        onMarkAsRead={() => onMarkAsRead(notification._id)}
      />
    ),
  }));

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click']}
      dropdownRender={(menu) => (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <Spin />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No new notifications</div>
          ) : (
            <>
              {menu}
              <div className="p-2 text-center border-t">
                <button
                  onClick={onMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            </>
          )}
    </div>
      )}
    >
      <Badge count={notifications.length} size="default">
        <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </Badge>
    </Dropdown>
  );
};