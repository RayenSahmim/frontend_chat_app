import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  _id: string;
  username: string;
  message: string;
  timestamp: string;
}

const App = () => {
  const [username, setUsername] = useState(""); // Store the user's name
  const [msg, setMsg] = useState(""); // Current input field text
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Chat messages from all users
  const [socket, setSocket] = useState<Socket | null>(null); // Store the socket instance
  const [isConnected, setIsConnected] = useState(false); // Connection status flag

  useEffect(() => {
    // Establish socket connection
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Listen for chat history from the backend
    newSocket.on('chat history', (chatHistory: ChatMessage[]) => {
      // Set chat history with messages fetched from the backend
      setMessages(chatHistory);
    });

    // Listen for new chat messages in real-time
    newSocket.on('chat message', (newMsg: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    });

    // Handle disconnection
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Clean up the socket connection on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle message submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg && username && socket) {
      socket.emit("chat message", { username, message: msg }); // Emit the message along with username
      setMsg(""); // Clear the input field after sending
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center font-bold flex-col gap-10">
      {/* Username Input */}
      {!isConnected ? (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
          />
          <button
            onClick={() => setIsConnected(true)} // Activate the chat only after username is set
            className="p-2 bg-blue-500 text-white"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <>
          {/* Message Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              name="message"
              value={msg} // Bind the input field to the msg state
              onChange={(e) => setMsg(e.target.value)}
              className="border bg-gray-500 p-2"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white">
              Send
            </button>
          </form>

          {/* Render the chat messages */}
          <div className="chat-history w-1/2 bg-gray-200 p-4 rounded-md">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message._id} className="p-2 bg-white mb-2 rounded">
                  <p>
                    <strong>{message.username}: </strong>
                    {message.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No messages yet...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
