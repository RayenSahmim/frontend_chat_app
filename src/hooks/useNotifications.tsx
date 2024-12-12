import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../Providers/SocketContext';
import axios from 'axios';

export interface Notification {
  _id: string;
  from: string;
  type: string;
  content: string;
  timestamp: string;
  isRead?: boolean; 
}

export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/getnotifications',{
        withCredentials: true, // Include credentials in the request
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
      })
      ;
      const unreadNotifications: Notification[] = response.data;
      
      // Merge with existing notifications, avoiding duplicates
      setNotifications((prev) => {
        const existingIds = new Set(prev.map(n => n._id));
        const newNotifications = unreadNotifications.filter(n => !existingIds.has(n._id));
        return [...newNotifications, ...prev];
      });
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) return;

    fetchUnreadNotifications();

    // Listener for unread notifications on initial load
    const handleUnreadNotifications = (unreadNotifications: Notification[]) => {
      setNotifications((prev) => [...prev, ...unreadNotifications]);
    };

    // Listener for real-time notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on('unreadNotifications', handleUnreadNotifications);
    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('unreadNotifications', handleUnreadNotifications);
      socket.off('notification', handleNewNotification);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Mark all notifications as read
  const markNotificationsAsRead = (notificationId: string) => {
    if (!socket) return;

    socket.emit('markNotificationsAsRead' , { notificationId });
    // Optimistically update the state
    setNotifications((prev : Notification[]) => prev.filter((notification) => notification._id !== notificationId));

  };
  const markAllNotificationsAsRead = () => {
    if (!socket) return;

    socket.emit('markAllNotificationsAsRead');
    // Optimistically update the state
    setNotifications([]);
  };

  return { notifications, markNotificationsAsRead,markAllNotificationsAsRead, isLoading };
};