import React, { useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Loader2, MessageSquare } from 'lucide-react';

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

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  typing,
  username,
  loading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      const dateStr = format(date, 'yyyy-MM-dd');
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(message);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4   min-h-[calc(100dvh-2rem)]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="px-4 py-6  h-fit min-h-[calc(100dvh-9.75rem)]">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
          <p className="text-gray-500">Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(messageGroups).map(([dateStr, msgs]) => (
            <div key={dateStr} className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {getDateDisplay(new Date(dateStr))}
                </div>
              </div>
              {msgs.map((msg, index) => {
                console.log(msg.user, username);
                const isOwn = msg.user === username;
                return (
                  <div
                    key={index}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                      {!isOwn && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-white">
                            {msg.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {typing && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">{typing}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};