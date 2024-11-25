import { useState, useEffect } from "react";
import { Empty } from "antd";
import { Search, LogOut, X, MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import ChatPage from "./ChatPage";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

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
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();
  const { authenticatedUser, loading: authLoading, error } = useAuthenticatedUser();

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const newTimeout = setTimeout(() => fetchRooms(value), 500);
    setSearchTimeout(newTimeout);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchRooms("");
  };

  const handleLogout = async () => {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) navigate("/login");
  };

  const handleBackToList = () => setSelectedRoomId(null);

  if (!authenticatedUser) return <div>Unauthorized</div>;
  if (error) return <div>Error: {error}</div>;
  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col h-full overflow-x-hidden",
          isMobileView && selectedRoomId ? 'hidden' : 'w-full',
          'md:w-96'
        )}
      >
        {/* Fixed Header */}
        <div className="flex-none">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Messages</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Scrollable Room List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {searchLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-20"
              >
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </motion.div>
            ) : rooms.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Empty
                  image={<MessageSquare className="w-16 h-16 text-gray-300" />}
                  description={
                    <span className="text-gray-500 text-lg">No conversations found</span>
                  }
                  className="mt-16"
                />
              </motion.div>
            ) : (
              <motion.div
                key="rooms"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="divide-y divide-gray-100"
              >
                {rooms.map((room) => {
                  const friend = room.users.find(
                    (user) => user._id !== authenticatedUser.id
                  );
                  return (
                    <motion.div
                      key={room._id}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                      onClick={() => setSelectedRoomId(room._id)}
                      className={cn(
                        "flex items-center space-x-2 px-6 py-4 cursor-pointer transition-colors",
                        selectedRoomId === room._id ? 'bg-blue-50' : ''
                      )}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-white">
                            {friend?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                          Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-300'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {friend?.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {friend?.email}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          !isMobileView || selectedRoomId ? 'flex flex-col' : 'hidden',
          'md:flex flex-1 overflow-hidden'
        )}
      >
        {selectedRoomId ? (
          <>
            {isMobileView && (
              <div className="p-4 border-b border-gray-200 bg-white">
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={handleBackToList}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to conversations</span>
                </motion.button>
              </div>
            )}
            <div className="flex-1 overflow-x-hidden">
              <ChatPage roomId={selectedRoomId} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500 text-lg">
                Choose a contact to start messaging
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RoomsPage;