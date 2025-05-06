
// socket.ts
import { io, Socket } from 'socket.io-client';

type Message = {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

type TypingEvent = {
  chatId: string;
  userId: string;
};

type SendMessageCallback = (response: {
  status: 'success' | 'error';
  message?: Message;
  error?: string;
}) => void;

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
    withCredentials: true,
    auth: { token },
  });

  return socket;
};

export const joinChat = (chatId: string): void => {
  if (socket) socket.emit('joinChat', chatId);
};

export const sendMessage = (
  chatId: string,
  content: string,
  callback: SendMessageCallback
): void => {
  if (socket) socket.emit('sendMessage', { chatId, content }, callback);
};

export const sendTyping = (chatId: string): void => {
  if (socket) socket.emit('typing', chatId);
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNewMessage = (callback: (message: Message) => void): void => {
  if (socket) socket.on('newMessage', callback);
};

export const onUserTyping = (callback: (event: TypingEvent) => void): void => {
  if (socket) socket.on('userTyping', callback);
};

export const offNewMessage = (): void => {
  if (socket) socket.off('newMessage');
};

export const offUserTyping = (): void => {
  if (socket) socket.off('userTyping');
};

// Additional utility types and exports
export type { Message, TypingEvent };