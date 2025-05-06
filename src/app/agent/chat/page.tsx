"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Smile,
  Image,
  Mic,
  Paperclip,
  ChevronDown,
  Loader2,
  CheckCheck,
  UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/auth_context";
import api, { getCsrfToken } from "@/lib/api";
import { useRouter } from "next/navigation";

type Message = {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  read: boolean;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  chatId: string;
};

type User = {
  _id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: Date;
  chatId: string;
  lastMessage?: Message;
};

export default function ChatApp() {
  const { user } = useAuth();
  const { socket } = useSocket();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [loading, setLoading] = useState({
    users: true,
    messages: true,
  });
  const [error, setError] = useState("");

  const router = useRouter();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainer] = useAutoAnimate<HTMLDivElement>();

  // Fetch users and initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/chats/", {
          headers: { "x-csrf-token": await getCsrfToken() },
          withCredentials: true,
        });

        const simplifiedUsers = usersResponse.data.data.map((chat: any) => ({
          ...chat.participants[0],
          chatId: chat._id,
          lastMessage: chat.lastMessage,
          property: chat.property,
        }));

        setUsers(simplifiedUsers);
        if (simplifiedUsers.length > 0) {
          setSelectedUser(simplifiedUsers[0]);
        }
        setLoading((prev) => ({ ...prev, users: false }));
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Load messages when user is selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(
          `/chats/${selectedUser.chatId}/messages`,
          {
            headers: { "x-csrf-token": await getCsrfToken() },
            withCredentials: true,
          }
        );

        const sortedMessages = response.data.data.sort(
          (a: Message, b: Message) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setMessages(sortedMessages);
        setLoading((prev) => ({ ...prev, messages: false }));
      } catch (err) {
        setError("Failed to load messages");
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !selectedUser) return;

    // Join the chat room
    socket.emit("joinChat", selectedUser.chatId);

    // New message handler
    const handleNewMessage = (message: Message) => {
      if (message.chatId === selectedUser.chatId) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message].sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });

        // Update last message in users list
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.chatId === selectedUser.chatId
              ? { ...u, lastMessage: message }
              : u
          )
        );
      }
    };

    socket.onAny((event, ...args) => {
      console.log(`Socket event: ${event}`, args);
      // setMessages((prev) => [...prev, event]);2
    });
    // Typing indicator handler
    const handleTypingEvent = ({
      chatId,
      userId,
    }: {
      chatId: string;
      userId: string;
    }) => {
      if (chatId === selectedUser.chatId && userId !== user?._id) {
        setIsTyping(true);
        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => setIsTyping(false), 2000));
      }
    };

    // Message status updates
    const handleMessageStatus = ({
      messageId,
      status,
    }: {
      messageId: string;
      status: Message["status"];
    }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleTypingEvent);
    socket.on("messageStatus", handleMessageStatus);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTypingEvent);
      socket.off("messageStatus", handleMessageStatus);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [socket, selectedUser, user?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedUser || !user) return;

    const tempId = Date.now().toString();
    const newMessage: Message = {
      _id: tempId,
      content: inputMessage,
      sender: { _id: user._id, name: user.name, avatar: user.avatar },
      timestamp: new Date(),
      status: "sending",
      read: false,
      chatId: selectedUser.chatId,
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setShowEmojiPicker(false);

    try {
      const response = await api.post(
        `chats/${selectedUser.chatId}/messages`,
        { content: newMessage.content },
        {
          headers: { "x-csrf-token": await getCsrfToken() },
          withCredentials: true,
        }
      );

      // Replace temp message with server response
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...response.data, status: "sent" } : msg
        )
      );

      // Emit socket event
      if (socket) {
        socket.emit("sendMessage", {
          chatId: selectedUser.chatId,
          message: response.data,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      // Mark as failed instead of removing
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
      setError("Failed to send message");
    }
  };

  // Typing indicator handler
  const handleTyping = useCallback(() => {
    if (socket && selectedUser && user) {
      socket.emit("typing", {
        chatId: selectedUser.chatId,
        userId: user._id,
      });
    }
  }, [socket, selectedUser, user]);

  // User selection handler
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserList(false);
    setLoading((prev) => ({ ...prev, messages: true }));
  };

  // Helper functions
  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return "never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case "sent":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-green-400" />;
      case "failed":
        return <span className="text-red-400 text-xs">Failed</span>;
      default:
        return null;
    }
  };

  const addEmoji = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        </div>

        {loading.users ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {users.map((user, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectUser(user)}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${
                  selectedUser?._id === user._id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                      user.status
                    )}`}
                  ></span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {user.name}
                    </h3>
                    {user.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(
                          user.lastMessage.timestamp
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
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
          {selectedUser ? (
            <>
              <div className="flex items-center">
                <img
                  src={selectedUser.avatar || "/default-avatar.png"}
                  alt={selectedUser.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedUser.status === "online"
                      ? "Online"
                      : `Last seen ${formatLastSeen(selectedUser.lastSeen)}`}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  showUserList ? "transform rotate-180" : ""
                }`}
              />
            </>
          ) : (
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">Select a user</p>
            </div>
          )}
        </button>

        <AnimatePresence>
          {showUserList && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute z-10 w-full bg-white shadow-lg max-h-96 overflow-y-auto"
            >
              {users.map((user, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white ${getStatusColor(
                        user.status
                      )}`}
                    ></span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {user.status === "online"
                        ? "Online"
                        : `Last seen ${formatLastSeen(user.lastSeen)}`}
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
        {selectedUser ? (
          <div className="flex items-center p-4 border-b border-gray-200 bg-white">
            <div className="relative md:hidden">
              <img
                src={selectedUser.avatar || "/default-avatar.png"}
                alt={selectedUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(
                  selectedUser.status
                )}`}
              ></span>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUser.name}
              </h2>
              <p className="text-xs text-gray-500">
                {selectedUser.status === "online"
                  ? "Online"
                  : `Last seen ${formatLastSeen(selectedUser.lastSeen)}`}
                {isTyping && " • typing..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-white h-16">
            <h2 className="text-lg font-semibold text-gray-500">
              Select a user to start chatting
            </h2>
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
          ) : (
            <>
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      message?.sender?._id === user._id
                        ? "justify-end"
                        : "justify-start"
                    } mb-3`}
                  >
                    <div className="flex max-w-[90%] md:max-w-[70%]">
                      {message?.sender?._id !== user._id && (
                        <img
                          src={message?.sender?.avatar || "/default-avatar.png"}
                          alt={message?.sender?.name}
                          className="h-8 w-8 rounded-full mt-1 mr-2 self-start"
                        />
                      )}
                      <div
                        className={`rounded-xl px-4 py-2 ${
                          message?.sender?._id === user._id
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {message?.sender?._id !== user._id && (
                          <p className="font-medium text-sm">
                            {message?.sender?.name}
                          </p>
                        )}
                        <p
                          className={
                            message?.sender?._id !== user._id ? "mt-1" : ""
                          }
                        >
                          {message.content}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {message?.sender?._id === user._id && (
                            <span className="ml-2">
                              {getStatusIcon(message.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && selectedUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex mb-4 justify-start"
                >
                  <img
                    src={selectedUser.avatar || "/default-avatar.png"}
                    alt="User"
                    className="h-8 w-8 rounded-full object-cover mr-2 self-end"
                  />
                  <div className="bg-white text-gray-800 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message input */}
        {selectedUser && (
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
                        {[
                          "😀",
                          "😂",
                          "😍",
                          "👍",
                          "👋",
                          "❤️",
                          "🔥",
                          "🎉",
                          "🤔",
                          "😎",
                          "🙏",
                          "😢",
                        ].map((emoji, index) => (
                          <button
                            key={index}
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
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    handleTyping();
                  }}
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
