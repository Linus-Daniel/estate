"use client";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, SendMessageCallback, TypingEvent } from "@/types";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionState: "connecting" | "connected" | "disconnected" | "error";
  sendMessage: (chatId: string, content: string, callback: SendMessageCallback) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  onNewMessage: (callback: (message: Message) => void) => void;
  onUserTyping: (callback: (event: TypingEvent) => void) => void;
  offNewMessage: (callback: (message: Message) => void) => void;
  offUserTyping: (callback: (event: TypingEvent) => void) => void;
  onError: (callback: (error: Error) => void) => void;
  offError: (callback: (error: Error) => void) => void;
  joinChat: (chatId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionState: "disconnected",
  sendMessage: () => {},
  sendTyping: () => {},
  onNewMessage: () => {},
  onUserTyping: () => {},
  offNewMessage: () => {},
  offUserTyping: () => {},
  onError: () => {},
  offError: () => {},
  joinChat: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("connecting");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.NODE_ENV ==="production"?"https://estate-backend-4hk1.onrender.com": "http://localhost:5000",
      {
        path: "/socket.io",
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        // pingTimeout: 10000,
        // pingInterval: 25000,
        auth: {
          token: localStorage.getItem("token") || ""
        }
      }
    );

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Connection events
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setConnectionState("connected");
    });

    socketInstance.on("disconnect", () => {
      console.warn("Socket disconnected");
      setIsConnected(false);
      setConnectionState("disconnected");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setConnectionState("error");
    });

    // Reconnection events
    socketInstance.io.on("reconnect_attempt", () => {
      const token = localStorage.getItem("token");
      if (token) {
        socketInstance.auth = { token };
      }
    });

    socketInstance.io.on("reconnect_failed", () => {
      console.error("Reconnection failed");
    });

    socketInstance.io.on("reconnect", (attempt) => {
      console.log(`Reconnected after ${attempt} attempts`);
    });

    // Cleanup
    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.disconnect();
    };
  }, []);

  const joinChat = (chatId: string) => {
    socket?.emit("joinChat", chatId);
  };

  const sendMessage = (
    chatId: string,
    content: string,
    callback: SendMessageCallback
  ) => {
    socket?.emit("sendMessage", { chatId, content }, callback);
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    socket?.emit("typing", { chatId, isTyping });
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    socket?.on("newMessage", callback);
  };

  const offNewMessage = (callback: (message: Message) => void) => {
    socket?.off("newMessage", callback);
  };

  const onUserTyping = (callback: (event: TypingEvent) => void) => {
    socket?.on("userTyping", callback);
  };

  const offUserTyping = (callback: (event: TypingEvent) => void) => {
    socket?.off("userTyping", callback);
  };

  const onError = (callback: (error: Error) => void) => {
    socket?.on("error", callback);
  };

  const offError = (callback: (error: Error) => void) => {
    socket?.off("error", callback);
  };

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      connectionState,
      sendMessage,
      sendTyping,
      onNewMessage,
      offNewMessage,
      onUserTyping,
      offUserTyping,
      onError,
      offError,
      joinChat,
    }),
    [socket, isConnected, connectionState]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};