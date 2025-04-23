// app/api/properties/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    // Build filter object
    const filter: any = { status };
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) {
      filter.price = filter.price || {};
      filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('agent', 'name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = await authenticate(request);
    
    // Authorization check
    if (user.role !== 'agent' && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Only agents and admins can create properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.price || !body.location) {
      return NextResponse.json(
        { message: 'Title, price, and location are required' },
        { status: 400 }
      );
    }

    // Create property with agent assignment
    const propertyData = {
      ...body,
      agent: user.role === 'agent' ? user._id : body.agent || user._id,
      status: body.status || 'available'
    };

    const property = new Property(propertyData);
    await property.save();

    // Populate agent info in response
    const populatedProperty = await Property.findById(property._id)
      .populate('agent', 'name email phone');

    return NextResponse.json(populatedProperty, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}