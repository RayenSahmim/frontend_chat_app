import { Spin, Card, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Initialize socket connection
const socket = io('http://localhost:5000', {
  withCredentials: true, // Send session cookie
});

interface Message {
  user: string;
  message: string;
}



const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [typing, setTyping] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
const logout = async () => {
  try{
  const response = await fetch('http://localhost:5000/api/logout', {
    method: 'POST',
    credentials: 'include', // Important to include credentials (cookies)

  })
  if (response.ok) {
    navigate('/login');
  }

  } catch (err) {
    console.error('Error checking session:', err);
  }
};
  useEffect(() => {
    // Check session to retrieve the logged-in user
    fetch('http://localhost:5000/api/check-session', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUsername(data.user.name);
        } else {
          alert('Not authenticated');
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // Listen for previous messages
    socket.on('previousMessages', (msgs: Message[]) => {
      setMessages((prevMessages) => [...prevMessages, ...msgs]);
      setLoading(false);
    });

    // Listen for incoming messages
    socket.on('message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for typing event
    socket.on('typing', (data: string) => {
      setTyping(data);
      setTimeout(() => setTyping(''), 2000);
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('previousMessages');
    };
  }, []);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', message);
      setMessages((prevMessages) => [...prevMessages, { user: username, message }]);
      setMessage(''); // Clear input after sending
    }
  };

  const handleTyping = () => {
    socket.emit('typing');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5'>
      <Card className='w-full max-w-4xl shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-6'>Real-Time Chat</h1>
        <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' onClick={logout}>logout</button>

        <div className='chat-window bg-white p-4  overflow-y-auto rounded-md border border-gray-200 mb-4 h-[70vh]'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <Spin size='large' />
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.user === username ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    msg.user === username
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <strong>{msg.user === username ? 'You' :msg.user}:</strong> {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        {typing && (
          <p className='text-blue-500 italic text-sm mb-2'>
            {typing} is typing...
          </p>
        )}

        <form
          onSubmit={handleMessageSubmit}
          className='flex gap-2 items-center'
        >
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
