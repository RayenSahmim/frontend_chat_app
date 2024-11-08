import { useEffect, useRef } from "react";
import { Spin } from "antd";

interface MessageListProps {
  messages: ChatMessage[];
  typing: string;
  username: string;
  loading: boolean;
}

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

const MessageList: React.FC<MessageListProps> = ({ messages, typing, username, loading }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change or loading state changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div
    ref={chatContainerRef}
    className="chat-window bg-white p-4 overflow-y-auto rounded-md  mb-4 flex-grow  relative"
  >
    {loading ? (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.user === username ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-2 rounded-xl shadow-md max-w-[70%] break-words ${
                msg.user === username ? "bg-blue-600 text-white ml-auto" : "bg-gray-200 text-black"
              }`}
            >
              <span className="font-semibold">{msg.user}: </span>
              <span>{msg.message}</span>
            </div>
          </div>
        ))}
        {typing && <p className="text-gray-400 italic animate-pulse">{typing}</p>}
      </div>
    )}
  </div>
  
  );
};

export default MessageList;
