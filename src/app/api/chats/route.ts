// app/api/chats/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';

interface ChatRequestPOST {
  participantId: string;
  propertyId?: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const user = await authenticate(request);

    const chats = await Chat.find({
      participants: user._id
    })
    .populate('participants', 'name email role')
    .populate('property', 'title price')
    .populate('lastMessage')
    .sort('-updatedAt');

    return NextResponse.json(chats);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = await authenticate(request);
    const { participantId, propertyId }: ChatRequestPOST = await request.json();

    // Validate participantId
    if (!participantId || !Types.ObjectId.isValid(participantId)) {
      return NextResponse.json(
        { message: 'Invalid participant ID' },
        { status: 400 }
      );
    }

    // Check if chat exists
    let chat = await Chat.findOne({
      participants: { $all: [user._id, participantId] },
      property: propertyId || null
    })
    .populate('participants', 'name email role')
    .populate('property', 'title price');

    if (!chat) {
      chat = new Chat({
        participants: [user._id, participantId],
        property: propertyId || null
      });
      await chat.save();
      
      // Populate after save
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email role')
        .populate('property', 'title price');
    }

    return NextResponse.json(chat);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message ? 401 : 500 }
    );
  }
}