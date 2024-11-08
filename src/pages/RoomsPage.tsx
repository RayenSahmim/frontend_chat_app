import { useState, useEffect } from 'react';
import { List, Avatar, Spin, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ChatPage from './ChatPage'; // Import ChatPage component

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
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
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
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-screen flex pl-8">
      <div className="w-1/4 max-h-full overflow-y-auto py-5">
        <Card className="shadow-lg h-full p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Your Chats</h1>
          {rooms.length === 0 ? (
            <p className="text-center text-gray-600">No active chats available</p>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={rooms}
              renderItem={(room) => {
                const friend = room.users.find((user) => user._id !== authenticatedUser.id);
                return (
                  <List.Item
                    onClick={() => setSelectedRoomId(room._id)}
                    className="cursor-pointer hover:bg-gray-200 rounded-lg p-4 mb-4 transition duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar size={48} icon={<UserOutlined />} />
                      <div>
                        <h4 className="text-lg font-semibold">{friend?.name}</h4>
                        <p className="text-gray-500">{friend?.email}</p>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          )}
        </Card>
      </div>
      <div className="w-3/4 max-h-full overflow-y-auto">
        {selectedRoomId ? (
          <ChatPage roomId={selectedRoomId} />
        ) : (
          <p className="text-center text-gray-600 mt-20">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
