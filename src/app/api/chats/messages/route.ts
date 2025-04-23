import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import { authenticate } from '@/middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const user = await authenticate(req);
        const { chatId } = req.query;

        // Verify user is a participant in the chat
        const chat = await Chat.findById(chatId);
        if (!chat.participants.includes(user._id)) {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        const messages = await Message.find({ chat: chatId })
          .sort('createdAt')
          .populate('sender', 'name email role');

        res.status(200).json(messages);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'POST':
      try {
        const user = await authenticate(req);
        const { chatId, content } = req.body;

        // Verify user is a participant in the chat
        const chat = await Chat.findById(chatId);
        if (!chat.participants.includes(user._id)) {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        const message = new Message({
          chat: chatId,
          sender: user._id,
          content,
        });

        await message.save();

        // Update chat's last message
        chat.lastMessage = message._id;
        await chat.save();

        res.status(201).json(message);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}