// app/api/bookings/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';

interface BookingRequestBody {
  propertyId: string;
  startDate: string;
  endDate: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const user = await authenticate(request);
    let bookings;

    switch (user.role) {
      case 'tenant':
        bookings = await Booking.find({ tenant: user._id })
          .populate('property')
          .populate('tenant', 'name email');
        break;
      
      case 'agent':
        const agentProperties = await Property.find({ agent: user._id });
        bookings = await Booking.find({ 
          property: { $in: agentProperties.map(p => p._id) }
        })
        .populate('property')
        .populate('tenant', 'name email');
        break;
      
      case 'admin':
        bookings = await Booking.find()
          .populate('property')
          .populate('tenant', 'name email');
        break;
      
      default:
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 403 }
        );
    }

    return NextResponse.json(bookings);
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
    
    if (user.role !== 'tenant') {
      return NextResponse.json(
        { message: 'Only tenants can create bookings' },
        { status: 403 }
      );
    }

    const { propertyId, startDate, endDate }: BookingRequestBody = await request.json();
    
    // Validate input
    if (!propertyId || !Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { message: 'Invalid property ID' },
        { status: 400 }
      );
    }

    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { message: 'Invalid date range' },
        { status: 400 }
      );
    }

    // Check property availability
    const property = await Property.findById(propertyId);
    if (!property || property.status !== 'available') {
      return NextResponse.json(
        { message: 'Property not available for booking' },
        { status: 400 }
      );
    }

    // Check for existing bookings that conflict with these dates
    const conflictingBooking = await Booking.findOne({
      property: propertyId,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { message: 'Property already booked for selected dates' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    const totalAmount = days * property.price;

    // Create booking
    const booking = new Booking({
      property: propertyId,
      tenant: user._id,
      startDate,
      endDate,
      totalAmount,
      status: 'confirmed'
    });

    await booking.save();

    // Populate references for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('property')
      .populate('tenant', 'name email');

    return NextResponse.json(populatedBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message ? 400 : 500 }
    );
  }
}