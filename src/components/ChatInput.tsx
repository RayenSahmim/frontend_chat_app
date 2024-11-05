import React from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleMessageSubmit: (e: React.FormEvent) => void;
  handleTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, handleMessageSubmit, handleTyping }) => (
  <form onSubmit={handleMessageSubmit} className="flex items-center  bg-white p-3 rounded-md  ">
    <Input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message here..."
      className="flex-grow mr-2"
      onKeyUp={handleTyping}
    />
    <Button type="primary" htmlType="submit" icon={<SendOutlined />} className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
      Send
    </Button>
  </form>
);

export default ChatInput;
