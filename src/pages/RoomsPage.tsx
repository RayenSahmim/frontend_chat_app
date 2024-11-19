import { useState, useEffect } from "react";
import { List, Avatar, Spin, Card, Empty, Button } from "antd";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import ChatPage from "./ChatPage";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
interface Room {
  _id: string;
  users: User[];
}
interface User {
  _id: string;
  name: string;
  email: string;
  ImageURL: string;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { authenticatedUser, loading: authLoading, error } = useAuthenticatedUser();

  const fetchRooms = async (query: string) => {
    setSearchLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/rooms?search=${query}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRooms("").then(() => setLoading(false));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const newTimeout = setTimeout(() => {
      fetchRooms(value);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchRooms("");
  };

  const handleLogout = async() => {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) navigate("/login");  };

  if (!authenticatedUser) return <div>Unauthorized</div>;
  if (error) return <div>Error: {error}</div>;
  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-screen flex pl-8">
      <div className="w-1/5 max-h-full py-5 flex flex-col h-screen relative">
        <Card className="shadow-lg h-full p-0 flex flex-col flex-grow relative">
          {/* Search Bar */}
          <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4 text-center">Discussions</h1>
            <div className="flex items-center bg-white rounded-lg shadow-sm p-2 border">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none text-sm text-gray-700"
                placeholder="Search for friends"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchLoading ? (
                <Spin size="small" className="mr-2" />
              ) : searchTerm ? (
                <button
                  onClick={clearSearch}
                  className="text-gray-500 hover:text-gray-800 transition"
                >
                  <CloseOutlined />
                </button>
              ) : null}
            </div>
          </div>

          {/* Room List */}
          <div className="overflow-y-auto flex-grow p-4">
            {rooms.length === 0 && !searchLoading ? (
              <Empty description="No active chats found" />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={rooms}
                renderItem={(room) => {
                  const friend = room.users.find(
                    (user) => user._id !== authenticatedUser.id
                  );
                  return (
                    <List.Item
                      onClick={() => setSelectedRoomId(room._id)}
                      className="cursor-pointer hover:bg-gray-200 rounded-lg px-4 mb-4 transition duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar
                          size={48}
                          src={friend?.ImageURL || undefined}
                          icon={!friend?.ImageURL ? <UserOutlined /> : undefined}
                        />
                        <div>
                          <h4 className="text-lg font-semibold">
                            {friend?.name}
                          </h4>
                          <p className="text-gray-500">{friend?.email}</p>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white ">
            <Button
              danger
              icon={<LogoutOutlined />}
              iconPosition="end"
              type="primary"
              className="w-full"
              onClick={handleLogout}
              loading={authLoading}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>

      <div className="w-4/5 max-h-full overflow-y-auto">
        {selectedRoomId ? (
          <ChatPage roomId={selectedRoomId} />
        ) : (
          <p className="text-center text-gray-600 mt-20">
            Select a chat to start messaging
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
