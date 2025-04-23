"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Smile, Image, Mic, Paperclip, ChevronDown, Loader2, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAuth } from '@/context/auth_context';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  content: string;
  sender: string;
  createdAt: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
};

type User = {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
};

type Chat = {
  id: string;
  participants: User[];
  property?: {
    id: string;
    title: string;
  };
  lastMessage?: Message;
  updatedAt: Date;
};

export default function Messages() {
  const {user} = useAuth();
  const router = useRouter();
  
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [loading, setLoading] = useState({
    chats: true,
    messages: false
  });
  const [error, setError] = useState('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainer] = useAutoAnimate<HTMLDivElement>();

  // Animation variants
  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  // Fetch chats on component mount
  useEffect(() => {
    if (user) {
      setCurrentUser({
        id:"2",
        name:user.name || 'You',
        email:user.email || '',
        // avatar:user.image || '/default-avatar.png',
        role:user.role || 'user'
      });

      fetchChats();
    }
  }, [user]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setLoading(prev => ({ ...prev, chats: true }));
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data);
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
      console.log(err)
    } finally {
      setLoading(prev => ({ ...prev, chats: false }));
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const response = await fetch(`/api/chats/${chatId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      // Transform API data to our Message type
      const formattedMessages = data.map((msg: any) => ({
        id: msg._id,
        content: msg.content,
        sender: msg.sender._id,
        createdAt: new Date(msg.createdAt),
        status: 'read' // Assuming messages fetched are already read
      }));
      
      setMessages(formattedMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat || !currentUser) return;

    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      content: inputMessage,
      sender: "2",
      createdAt: new Date(),
      status: 'sending'
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setShowEmojiPicker(false);

    try {
      const response = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputMessage
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const sentMessage = await response.json();
      
      // Replace temp message with actual message from server
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? {
          id: sentMessage._id,
          content: sentMessage.content,
          sender: sentMessage.sender._id,
          createdAt: new Date(sentMessage.createdAt),
          status: 'sent'
        } : msg
      ));

      // Refresh chats to update last message
      fetchChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the optimistic message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  // Handle chat selection
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowUserList(false);
  };

  // Get other participant in chat
  const getOtherParticipant = (chat: Chat) => {
    if (!currentUser) return null;
    return chat.participants.find(p => p.id !== currentUser.id);
  };

  // Get status color
  const getStatusColor = (status: User['status'] = 'offline') => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format last seen
  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Get status icon for message
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case 'sent': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-blue-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-green-400" />;
      default: return null;
    }
  };

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            <button 
              onClick={() => router.push('/messages/new')}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {loading.chats ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => {
              const otherParticipant = getOtherParticipant(chat);
              return (
                <motion.div
                  key={chat.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${selectedChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  {otherParticipant && (
                    <>
                      <div className="relative">
                        <img
                          src={otherParticipant.avatar || '/default-avatar.png'}
                          alt={otherParticipant.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(otherParticipant.status)}`}></span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {otherParticipant.name}
                            {chat.property && (
                              <span className="text-xs text-gray-500 ml-1">• {chat.property.title}</span>
                            )}
                          </h3>
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(new Date(chat.lastMessage.createdAt))}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={currentUser.avatar || '/default-avatar.png'}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{currentUser.name}</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile chat selector */}
      <div className="md:hidden relative">
        <button
          onClick={() => setShowUserList(!showUserList)}
          className="flex items-center justify-between w-full p-4 border-b border-gray-200 bg-white"
        >
          {selectedChat ? (
            <>
              <div className="flex items-center">
                <img
                  src={getOtherParticipant(selectedChat)?.avatar || '/default-avatar.png'}
                  alt={getOtherParticipant(selectedChat)?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {getOtherParticipant(selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.lastMessage?.content ? 
                      selectedChat.lastMessage.content.substring(0, 20) + (selectedChat.lastMessage.content.length > 20 ? '...' : '') : 
                      'No messages yet'}
                  </p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showUserList ? 'transform rotate-180' : ''}`} />
            </>
          ) : (
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">Select a chat</p>
            </div>
          )}
        </button>

        <AnimatePresence>
          {showUserList && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute z-10 w-full bg-white shadow-lg max-h-96 overflow-y-auto"
            >
              {chats.map(chat => {
                const otherParticipant = getOtherParticipant(chat);
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="relative">
                      <img
                        src={otherParticipant?.avatar || '/default-avatar.png'}
                        alt={otherParticipant?.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white ${getStatusColor(otherParticipant?.status)}`}></span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {otherParticipant?.name}
                        {chat.property && (
                          <span className="text-xs text-gray-500 ml-1">• {chat.property.title}</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {selectedChat ? (
          <div className="flex items-center p-4 border-b border-gray-200 bg-white">
            <div className="relative md:hidden">
              <img
                src={getOtherParticipant(selectedChat)?.avatar || '/default-avatar.png'}
                alt={getOtherParticipant(selectedChat)?.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(getOtherParticipant(selectedChat)?.status)}`}></span>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {getOtherParticipant(selectedChat)?.name}
                {selectedChat.property && (
                  <span className="text-sm text-gray-500 ml-2">• {selectedChat.property.title}</span>
                )}
              </h2>
              <p className="text-xs text-gray-500">
                {getOtherParticipant(selectedChat)?.status === 'online' ? 
                  'Online' : 
                  `Last seen ${formatLastSeen(selectedChat.updatedAt)}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-white h-16">
            <h2 className="text-lg font-semibold text-gray-500">Select a chat to start messaging</h2>
          </div>
        )}

        {/* Messages */}
        <div
          ref={messagesContainer}
          className="flex-1 p-4 overflow-y-auto bg-gray-50"
        >
          {loading.messages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className={`flex mb-4 ${message.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender !== currentUser.id && selectedChat && (
                      <img
                        src={getOtherParticipant(selectedChat)?.avatar || '/default-avatar.png'}
                        alt="User"
                        className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.sender === currentUser.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}
                    >
                      <p>{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${message.sender === currentUser.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        <span>{formatTime(message.createdAt)}</span>
                        {message.sender === currentUser.id && (
                          <span>{getStatusIcon(message.status)}</span>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex mb-4 justify-start"
                >
                  {selectedChat && (
                    <img
                      src={getOtherParticipant(selectedChat)?.avatar || '/default-avatar.png'}
                      alt="User"
                      className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div className="bg-white text-gray-800 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input */}
        {selectedChat && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <div className="flex space-x-1 mr-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <Image className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex-1">
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-2 w-64 h-40 overflow-y-auto"
                    >
                      <div className="grid grid-cols-6 gap-1">
                        {['😀', '😂', '😍', '👍', '👋', '❤️', '🔥', '🎉', '🤔', '😎'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => addEmoji(emoji)}
                            className="text-xl p-1 hover:bg-gray-100 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => setShowEmojiPicker(false)}
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {inputMessage.trim() ? (
                  <Send className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}