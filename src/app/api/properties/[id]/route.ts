// app/api/properties/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    // Extract property ID from the request URL
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').slice(-2)[0]; // Extract [id]

    if (!Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { message: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const property = await Property.findById(propertyId)
      .populate('agent', 'name email phone');
    
    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    // Extract property ID from the request URL
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').slice(-2)[0]; // Extract [id]

    if (!Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { message: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const user = await authenticate(request);
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    // Authorization check
    if (property.agent.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      body,
      { new: true }
    ).populate('agent', 'name email phone');

    return NextResponse.json(updatedProperty);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();
    
    // Extract property ID from the request URL
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').slice(-2)[0]; // Extract [id]

    if (!Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { message: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const user = await authenticate(request);
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    // Authorization check
    if (property.agent.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    await Property.findByIdAndDelete(propertyId);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
