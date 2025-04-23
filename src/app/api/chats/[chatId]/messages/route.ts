// app/api/chats/[chatId]/messages/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Chat from '@/models/Chat';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    const user = await authenticate(request);

    const url = new URL(request.url);
    const chatId = url.pathname.split('/').slice(-2)[0]; // Extract [chatId]

    if (!Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: 'Invalid chat ID format' }, { status: 400 });
    }

    const chat = await Chat.findOne({ _id: chatId, participants: user._id });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 404 });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email role');

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: error.status || 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    const user = await authenticate(request);

    const url = new URL(request.url);
    const chatId = url.pathname.split('/').slice(-2)[0]; // Extract [chatId]

    const { content } = await request.json();

    if (!Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: 'Invalid chat ID format' }, { status: 400 });
    }

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const chat = await Chat.findOne({ _id: chatId, participants: user._id });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found or access denied' }, { status: 404 });
    }

    const message = await Message.create({
      chat: chatId,
      sender: user._id,
      content: content.trim()
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email role');

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: error.status || 500 });
  }
}
