import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { authenticate } from '@/middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const user = await authenticate(req);
        const chats = await Chat.find({
          participants: user._id
        })
        .populate('participants', 'name email role')
        .populate('property', 'title price')
        .populate('lastMessage')
        .sort('-updatedAt');

        res.status(200).json(chats);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'POST':
      try {
        const user = await authenticate(req);
        const { participantId, propertyId } = req.body;

        // Check if chat already exists between these participants about this property
        let chat = await Chat.findOne({
          participants: { $all: [user._id, participantId] },
          property: propertyId || null
        });

        if (!chat) {
          chat = new Chat({
            participants: [user._id, participantId],
            property: propertyId || null
          });
          await chat.save();
        }

        res.status(200).json(chat);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}