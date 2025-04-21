"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Smile, Image, Mic, Paperclip, ChevronDown, Loader2, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  avatar?: string;
};

type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
};

export default function ChatApp() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'You',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'online'
  });
  const [selectedUser, setSelectedUser] = useState<User>({
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'online',
    lastSeen: new Date()
  });
  const [users, setUsers] = useState<User[]>([
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      status: 'online',
      lastSeen: new Date()
    },
    {
      id: '3',
      name: 'Mike Peterson',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      status: 'away',
      lastSeen: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      status: 'offline',
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

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

  // Load initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Hey there! How are you doing?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'read',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        id: '2',
        text: "I'm good, thanks! Just working on that project we discussed.",
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        status: 'read'
      },
      {
        id: '3',
        text: 'How about you? Any progress on your end?',
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        status: 'read'
      },
      {
        id: '4',
        text: "Yes, I've completed the design mockups. Want me to share them?",
        sender: 'other',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        status: 'read',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        id: '5',
        text: "That would be great! I'll review them and get back to you.",
        sender: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
        status: 'delivered'
      }
    ];
    setMessages(initialMessages);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'me',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setShowEmojiPicker(false);

    // Simulate message sending and delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomReply(),
        sender: 'other',
        timestamp: new Date(),
        status: 'delivered',
        avatar: selectedUser.avatar
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 3000);
  };

  const getRandomReply = () => {
    const replies = [
      "Sounds good!",
      "I'll check it out.",
      "Thanks for letting me know.",
      "Can we discuss this tomorrow?",
      "That's interesting!",
      "I agree with you.",
      "Let me think about it.",
      "What time works for you?"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // Handle user selection
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserList(false);
    // In a real app, you would load messages for this user
  };

  // Get status color
  const getStatusColor = (status: User['status']) => {
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map(user => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${selectedUser.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></span>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                  <span className="text-xs text-gray-500">
                    {user.lastSeen && formatTime(user.lastSeen)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {user.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen || new Date())}`}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={currentUser.avatar}
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

      {/* Mobile user selector */}
      <div className="md:hidden relative">
        <button
          onClick={() => setShowUserList(!showUserList)}
          className="flex items-center justify-between w-full p-4 border-b border-gray-200 bg-white"
        >
          <div className="flex items-center">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{selectedUser.name}</h3>
              <p className="text-xs text-gray-500">
                {selectedUser.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(selectedUser.lastSeen || new Date())}`}
              </p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showUserList ? 'transform rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showUserList && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute z-10 w-full bg-white shadow-lg"
            >
              {users.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500">
                      {user.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen || new Date())}`}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-white">
          <div className="relative md:hidden">
            <img
              src={selectedUser.avatar}
              alt={selectedUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(selectedUser.status)}`}></span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h2>
            <p className="text-xs text-gray-500">
              {selectedUser.status === 'online' ? 'Online' : `Last seen ${formatLastSeen(selectedUser.lastSeen || new Date())}`}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainer}
          className="flex-1 p-4 overflow-y-auto bg-gray-50"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'other' && (
                  <img
                    src={message.avatar}
                    alt="User"
                    className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.sender === 'me' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}
                >
                  <p>{message.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.sender === 'me' && (
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
              <img
                src={selectedUser.avatar}
                alt="User"
                className="h-8 w-8 rounded-full object-cover mr-2 self-end"
              />
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
        </div>

        {/* Message input */}
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
      </div>
    </div>
  );
}