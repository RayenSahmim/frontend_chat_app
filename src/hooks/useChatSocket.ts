import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../Providers/SocketContext'

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

export const useChatSocket = (roomId: string, username: string) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', { roomId });

    socket.on('previousMessages', (msgs: ChatMessage[]) => {
      setMessages(msgs);
      setLoading(false);
    });

    socket.on('message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    socket.on('typing', (data: string) => {
      setTyping(data);
      setTimeout(() => setTyping(''), 2000);
    });

    return () => {
      socket.off('previousMessages');
      socket.off('message');
      socket.off('typing');
    };
  }, [socket, roomId]);

  const sendMessage = useCallback((message: string) => {
    if (!socket || !message.trim()) return;
    
    socket.emit('message', { roomId, msg: message });
    setMessages(prev => [...prev, { user: username, message, timestamp: new Date() }]);
  }, [socket, roomId, username]);

  const sendTyping = useCallback(() => {
    if (!socket) return;
    socket.emit('typing', { roomId });
  }, [socket, roomId]);

  return {
    messages,
    typing,
    loading,
    sendMessage,
    sendTyping
  };
};