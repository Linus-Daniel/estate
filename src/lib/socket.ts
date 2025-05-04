import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Socket } from 'socket.io';

interface MessageData {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

let io: Server | null = null;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('New client connected');

    // Join room based on user ID
    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle chat messages
    socket.on('sendMessage', async (message: MessageData) => {
      const { chatId, senderId, receiverId, content } = message;
      
      // Save message to DB (you would call your API route here)
      // Then broadcast to receiver
      socket.to(receiverId).emit('receiveMessage', {
        chatId,
        senderId,
        content,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};


