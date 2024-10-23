import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin, List, Card } from 'antd';

interface Room {
  _id: string;
  name: string;
  users: string[];
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const response = await fetch('http://localhost:5000/api/rooms',{
          credentials: 'include',});

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        console.log("data : ", data);
        setRooms(data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false); // Ensure loading is set to false whether the fetch succeeds or fails
      }
    };
  
    fetchRooms();
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Rooms</h1>
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              <Card title={room.name}>
                <Link to={`/root/rooms/${room._id}`}>Join Room</Link>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default RoomsPage;
