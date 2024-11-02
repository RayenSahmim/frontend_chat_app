import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin, List, Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface Room {
  _id: string;
  users: User[];
}
interface User {
  _id: string;
  name: string;
  email: string;
}
interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAuthenticatedUser(data.user);
      } catch (err) {
        console.error('Error fetching authenticated user:', err);
      }
    };

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/rooms', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    getAuthenticatedUser().then(() => fetchRooms());
  }, []);

  if (!authenticatedUser) return <div>Unauthorized</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>
      {rooms.length === 0 ? (
        <p>No active chats available</p>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={rooms}
          renderItem={(room) => {
            const friend = room.users.find((user) => user._id !== authenticatedUser.id);
            return (
              <List.Item>
                <Link to={`/root/rooms/${room._id}`}>
                  <Card hoverable className="rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <Card.Meta
                      avatar={<Avatar size={48} icon={<UserOutlined />} />}
                      title={<span className="text-lg font-semibold">{friend?.name}</span>}
                      description={<p className="text-gray-500">{friend?.email}</p>}
                    />
                  </Card>
                </Link>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default RoomsPage;
