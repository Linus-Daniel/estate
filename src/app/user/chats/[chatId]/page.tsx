"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/auth_context";
import { Send, Loader2, Smile, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api, { getCsrfToken } from "@/lib/api";
import { ChatInfo, Message } from "@/types";




export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const { user } = useAuth();
  const { socket, isConnected, connectionState,
    joinChat,
    sendMessage,
    sendTyping,
    offNewMessage,
    offUserTyping,
    onError,
    onUserTyping,
    onNewMessage,
    offError,
    arrivedMessage,
    isTyping
  } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const router = useRouter();
  
  const chatId = params.chatId as string;

  console.log("user chat page new message",arrivedMessage)
  
  // useEffect(()=>{
  //   console.log("New Message",arrivedMessage)
  //   !arrivedMessage ?console.log("messaee not here yet"):console.log("message incoming")
  
  //   arrivedMessage && setMessages(prev=>[...prev,arrivedMessage])
  // },[arrivedMessage])

  // Fetch chat data
// Fetch chat data
const fetchChatData = useCallback(async () => {
  try {
    // setLoading(true);

    const messagesRes = await api.get(`/chats/${chatId}/messages`, {
      headers: { "x-csrf-token": await getCsrfToken() },
      withCredentials: true,
    });

    setMessages(messagesRes.data.data);
  } catch (err) {
    console.error("Error fetching chat data:", err);
  } finally {
    setLoading(false);
  }
}, [chatId,arrivedMessage]);

// Initialize chat
useEffect(() => {
  if (chatId) {
    fetchChatData();
  }
}, [chatId, fetchChatData, arrivedMessage]);

// Handle new message
const handleNewMessage = useCallback(
  (message: Message) => {
    if (message.chatId === chatId) {
      setMessages((prev) => [...prev, message]);
    }
  },
  [chatId]
);



// Typing event with timeout cleanup
const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const handleTypingEvent = useCallback(() => {
  setOtherUserTyping(true);
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = setTimeout(() => {
    setOtherUserTyping(false);
  }, 2000);
}, []);


// Setup socket listeners
useEffect(() => {
  if (!socket || !chatId || !isConnected) return;

  console.log("Setting up socket listeners for chat:", chatId);
  joinChat(chatId);
  onNewMessage(handleNewMessage);
  onUserTyping(handleTypingEvent);

  // Debugging
  socket.onAny((event, ...args) => {
    console.log(`Socket event: ${event}`, args);
  });

  return () => {
    offNewMessage(handleNewMessage);
    offUserTyping(handleTypingEvent);
    socket.emit("leaveChat", chatId);
  };
}, [socket, chatId, isConnected, handleNewMessage, handleTypingEvent]);

// Scroll to bottom when messages change
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Emit typing indicator
const handleTyping = useCallback(() => {
  if (socket && chatId && isConnected) {
    socket.emit("typing", chatId);
  }
}, [socket, chatId, isConnected]);

const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.trim() || !user || !chatId || !socket) return;

  const tempId = Date.now().toString();
  const tempMessage:  Partial<Message> = {
    _id: tempId,
    sender: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
    },
    content: newMessage,
    read: false,
    chatId,
  };

  // Optimistic UI update
  setMessages((prev) => [...prev, tempMessage as Message]);
  setNewMessage("");
  setShowEmojiPicker(false);
  setSending(true);

  // Send message via socket
  socket.emit(
    "sendMessage",
    { chatId, content: newMessage },
    (response: { status: string; message?: Message }) => {
      if (response.status === "success" && response.message) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempId ? response.message! : msg))
        );
      } else {
        console.error("Message send failed:", response.message);
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      }
      setSending(false);
    }
  );
};


  // Get other participant in chat
  const getOtherParticipant = () => {
    if (!chatInfo || !user) return null;
    return chatInfo.participants.find((p) => p._id !== user._id);
  };

  const otherParticipant = getOtherParticipant();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="bg-white p-4 border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="md:hidden p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {otherParticipant && (
            <>
              <div className="relative">
                <img
                  src={otherParticipant.photo || "/default-avatar.png"}
                  alt={otherParticipant.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              </div>
              <div>
                <h2 className="font-semibold">{otherParticipant.name}</h2>
                <p className="text-xs text-gray-500">
                  {otherUserTyping ? "typing..." : "online"}
                </p>
              </div>
            </>
          )}
        </div>

        {chatInfo?.property && (
          <button
            onClick={() =>
              router.push(`/properties/${chatInfo?.property?._id}`)
            }
            className="hidden sm:flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              src={
                chatInfo.property.images[0]?.url || "/placeholder-property.jpg"
              }
              alt={chatInfo.property.title}
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="text-sm font-medium">
              {chatInfo.property.title}
            </span>
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-gray-200 p-6 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              No messages yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start the conversation with{" "}
              {otherParticipant?.name || "the other user"}
            </p>
          </div>
        ) : (
          messages.map((message,index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                message.sender?._id === user?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="flex max-w-[90%] md:max-w-[70%]">
                {message.sender?._id !== user?._id && (
                  <img
                    src={message.sender?.avatar || "/default-avatar.png"}
                    alt={message.sender?.name}
                    className="h-8 w-8 rounded-full mt-1 mr-2 self-start"
                  />
                )}
                <div
                  className={`rounded-xl px-4 py-2 ${
                    message.sender?._id === user?._id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {message.sender?._id !== user?._id && (
                    <p className="font-medium text-sm">
                      {message.sender?.name}
                    </p>
                  )}
                  <p
                    className={message.sender?._id !== user?._id ? "mt-1" : ""}
                  >
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
                      message.sender?._id === user?._id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {/* <span>
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </span> */}
                    {message.sender?._id === user?._id && (
                      <span>
                        {message?.read ? (
                          <span className="text-blue-300">✓✓</span>
                        ) : (
                          <span>✓</span>
                        )}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[90%] md:max-w-[70%]">
                
                <div className="bg-white text-gray-800 rounded-xl rounded-bl-none shadow-sm px-4 py-2">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center space-x-2">
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

            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onFocus={() => setShowEmojiPicker(false)}
            />

            {newMessage.trim() ? (
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-10 w-10"
                disabled={sending}
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <button
                type="button"
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>

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
                  ].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setNewMessage((prev) => prev + emoji);
                        inputRef.current?.focus();
                      }}
                      className="text-xl p-1 hover:bg-gray-100 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
