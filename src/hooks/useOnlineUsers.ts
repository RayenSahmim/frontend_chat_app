import { useState, useEffect } from 'react';
import { useSocket } from '../Providers/SocketContext';

export const useOnlineUsers = () => {
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listener for the "onlineUsers" event
    const handleOnlineUsers = (userIds: string[]) => {
      setOnlineUsers(userIds);
    };

    socket.on('onlineUsers', handleOnlineUsers);

    // Emit "getOnlineUsers" to fetch the initial list
    socket.emit('getOnlineUsers');

    // Cleanup the listener when the component unmounts or socket changes
    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [socket]);

  return { onlineUsers };
};
