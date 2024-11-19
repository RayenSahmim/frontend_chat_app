import React from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleMessageSubmit: (e: React.FormEvent) => void;
  handleTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleMessageSubmit,
  handleTyping,
}) => (
  <form
    onSubmit={handleMessageSubmit}
    className="flex items-center bg-white border-t border-gray-300  shadow-lg w-full p-2 py-3 absolute bottom-0 left-0"
    style={{ zIndex: 10 }}
  >
    <Input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="flex-grow mr-3 rounded-full border border-gray-300 px-8 py-2 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
      onKeyUp={handleTyping}
    />
    <Button
      type="primary"
      htmlType="submit"
      icon={<SendOutlined />}
      className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-4"
    >
      Send
    </Button>
  </form>
);

export default ChatInput;
