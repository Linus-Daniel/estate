"use client"
// src/app/admin/chat/page.tsx
import ChatList from '@/components/ChatLists';
import ChatWindow from '@/components/ChatWindows';
import { useState } from 'react';

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);
  
  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-150px)]">
      <div className="w-full md:w-1/3">
        <ChatList activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>
      <div className="w-full md:w-2/3">
        <ChatWindow chatId={activeChat} />
      </div>
    </div>
  );
}