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
  className="flex items-center p-3 bg-white rounded-full shadow-md w-full sticky bottom-0 "
>
  <Input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type a message..."
    className="flex-grow mr-3 rounded-full border-0 bg-gray-100 placeholder-gray-500 focus:ring-0"
    onKeyUp={handleTyping}
  />
  <Button
    type="primary"
    htmlType="submit"
    icon={<SendOutlined />}
    className="text-white bg-blue-500 hover:bg-blue-600 rounded-full"
  >
    Send
  </Button>
</form>


);

export default ChatInput;
