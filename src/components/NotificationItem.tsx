interface NotificationItemProps {
    from: string;
    content: string;
    timestamp: string;
    onMarkAsRead: () => void;
  }
  
  export const NotificationItem = ({ from, content, timestamp, onMarkAsRead }: NotificationItemProps) => (
    <div className="flex flex-col gap-2 p-3  transition-colors duration-200 w-full">
      <div className="flex justify-between items-start">
        <span className="font-medium text-sm text-gray-900">{from}</span>
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm text-gray-600">{content}</p>
      <button
        onClick={onMarkAsRead}
        className="self-end text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        Mark as read
      </button>
    </div>
  );