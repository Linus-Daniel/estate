// src/components/chat/ChatList.tsx
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const chats = [
  { id: 1, name: 'John Smith', lastMessage: 'I would like to schedule a viewing...', time: '10:30 AM', unread: 2 },
  { id: 2, name: 'Sarah Johnson', lastMessage: 'What is the property tax for...', time: 'Yesterday', unread: 0 },
  { id: 3, name: 'Michael Brown', lastMessage: 'Are there any additional fees?', time: 'Yesterday', unread: 0 },
  { id: 4, name: 'Emily Davis', lastMessage: 'Can I get pre-approved?', time: 'Mar 12', unread: 3 },
  { id: 5, name: 'David Wilson', lastMessage: 'The property looks great!', time: 'Mar 11', unread: 0 },
  { id: 6, name: 'Jessica Taylor', lastMessage: 'Is the property pet friendly?', time: 'Mar 10', unread: 0 },
  { id: 7, name: 'Robert Martinez', lastMessage: 'What are the HOA fees?', time: 'Mar 9', unread: 1 },
];

export default function ChatList({ activeChat, setActiveChat }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Messages</h2>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div 
            key={chat.id}
            className={`p-4 border-b cursor-pointer transition-colors ${
              activeChat === chat.id 
                ? 'bg-blue-50 dark:bg-blue-900/30' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div>
                  <h3 className="font-medium">{chat.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                {chat.unread > 0 && (
                  <span className="mt-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}