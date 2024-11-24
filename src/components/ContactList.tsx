import React, { useState } from 'react';
import { Circle, Search, LogOut } from 'lucide-react';

interface Contact {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    lastMessage?: string;
    unreadCount?: number;
  }
interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onLogout: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedContact?.id === contact.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <Circle
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    contact.status === 'online'
                      ? 'text-green-500 fill-green-500'
                      : 'text-gray-400 fill-gray-400'
                  }`}
                />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  {contact.unreadCount ? (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0">
                      {contact.unreadCount}
                    </span>
                  ) : null}
                </div>
                {contact.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {contact.lastMessage}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No contacts found
          </div>
        )}
      </div>
    </div>
  );
};