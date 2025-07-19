// src/components/chat/ChatWindow.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const messages = [
  { id: 1, sender: 'user', text: 'Hello, I saw your property listing and I\'m very interested!', time: '10:15 AM' },
  { id: 2, sender: 'agent', text: 'Hi John! Thank you for reaching out. Which property are you interested in?', time: '10:16 AM' },
  { id: 3, sender: 'user', text: 'The modern downtown loft on Main St. When can I schedule a viewing?', time: '10:18 AM' },
  { id: 4, sender: 'agent', text: 'We have availabilities tomorrow afternoon or Thursday morning. What works best for you?', time: '10:20 AM' },
  { id: 5, sender: 'user', text: 'Tomorrow afternoon works for me. Around 2 PM?', time: '10:22 AM' },
];

export default function ChatWindow({ chatId }: any) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'agent',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border h-full flex flex-col">
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
        <div>
          <h3 className="font-bold">John Smith</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map(msg => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'agent' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'agent' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}