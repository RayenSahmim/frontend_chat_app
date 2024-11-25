import React, { useRef, useState } from 'react';
import { Paperclip, SendHorizontal, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleMessageSubmit: (e: React.FormEvent) => void;
  handleTyping: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleMessageSubmit,
  handleTyping,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name); // Set the file name for preview
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="sticky bottom-0 z-20 ">

    <form
      onSubmit={handleMessageSubmit}
      className="bg-white border-t border-gray-200 p-4 "
    >
      <div className="flex items-center space-x-2">
        {/* Paperclip Button */}
        <button
          type="button"
          onClick={handleFileUpload}
          className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100 hidden sm:block"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleTyping}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
          />
          {/* Smile Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-600 hidden sm:block"
          >
            <Smile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-full transition-all duration-200 ${
            message.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* File Preview */}
      {fileName && (
        <div className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
          <span className="font-medium text-gray-800">Attached file:</span>
          <span>{fileName}</span>
        </div>
      )}
    </form>
    </div>
  );
};
