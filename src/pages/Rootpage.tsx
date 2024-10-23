import { Spin, Card, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { SendOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

let socket: Socket;

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [typing, setTyping] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Assuming you pass the userId of the chat partner via the URL, use useParams
  const { roomId } = useParams<{ roomId: string }>();
  console.log("recipientId : ", roomId);

  useEffect(() => {
    // Fetch session and username
    fetch('http://localhost:5000/api/check-session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUsername(data.user.name);

          socket = io('http://localhost:5000', {
            withCredentials: true,
          });

          socket.emit('joinRoom', { roomId });

          socket.on('connect', () => {
            console.log('Socket connected');
          });

          socket.on('previousMessages', (msgs: ChatMessage[]) => {
            setMessages(msgs);
            setLoading(false);
          });

          // Listen for new incoming messages
          socket.on('message', (data: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, data]);
          });

          // Listen for typing notification in the same room
          socket.on('typing', (data: string) => {
            setTyping(data);
            setTimeout(() => setTyping(''), 2000); // Clear typing after 2 seconds
          });

          // Handle socket disconnect
          socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setLoading(true);
          });
        } else {
          navigate('/login');
        }
      })
      .catch((err) => console.error(err));

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId, navigate]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { roomId , msg:message }); // Send message to room
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: username, message, timestamp: new Date() },
      ]);
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId }); // Notify typing for room
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error checking session:', err);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5'>
      <Card className='w-full max-w-4xl shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-6'>Private Chat</h1>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-4 rounded'
          onClick={logout}
        >
          Logout
        </button>
        <div className='chat-window bg-white p-4 overflow-y-auto rounded-md border border-gray-200 mb-4 h-[70vh] relative'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <Spin size='large' />
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.user === username ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg max-w-[70%] break-words transition-all duration-300 ease-in-out ${
                      msg.user === username
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <strong>{msg.user === username ? 'You' : msg.user}:</strong> {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {typing && (
          <p className='text-blue-500 italic text-sm mb-2 transition-opacity duration-300 ease-in-out'>
            {typing}
          </p>
        )}

        <form onSubmit={handleMessageSubmit} className='flex gap-2 items-center'>
          <Input
            className='flex-grow border border-gray-300 rounded-full px-4 py-2'
            size='large'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder='Type a message...'
          />
          <Button
            type='primary'
            size='large'
            shape='circle'
            icon={<SendOutlined />}
            onClick={handleMessageSubmit}
          />
        </form>
      </Card>
    </div>
  );
};

export default ChatApp;
