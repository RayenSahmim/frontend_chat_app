import  { createContext, useContext, ReactNode } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';

interface NotificationsContextProps {
  notifications: Notification[];
  markNotificationsAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  isLoading : boolean
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { notifications, markNotificationsAsRead , markAllNotificationsAsRead, isLoading } = useNotifications();

  return (
    <NotificationsContext.Provider value={{ notifications, markNotificationsAsRead,markAllNotificationsAsRead, isLoading }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};
