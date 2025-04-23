import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Booking from '../../../models/Booking';
import Property from '@/models/Property';
import { authenticate } from '@/middleware/auth';

interface User {
  _id: string;
  role: 'tenant' | 'agent' | 'admin';
}

interface BookingRequestBody {
  propertyId: string;
  startDate: string;
  endDate: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const user = await authenticate(req) as User;
        let bookings;

        if (user.role === 'tenant') {
          bookings = await Booking.find({ tenant: user._id })
            .populate('property')
            .populate('tenant', 'name email');
        } else if (user.role === 'agent') {
          // Get bookings for properties owned by this agent
          const agentProperties = await Property.find({ agent: user._id });
          bookings = await Booking.find({ 
            property: { $in: agentProperties.map((p:any) => p._id) }
          })
          .populate('property')
          .populate('tenant', 'name email');
        } else if (user.role === 'admin') {
          bookings = await Booking.find()
            .populate('property')
            .populate('tenant', 'name email');
        } else {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        res.status(200).json(bookings);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'POST':
      try {
        const user = await authenticate(req) as User;
        if (user.role !== 'tenant') {
          return res.status(403).json({ message: 'Only tenants can create bookings' });
        }

        const { propertyId, startDate, endDate }: BookingRequestBody = req.body;
        
        // Check if property exists and is available
        const property = await Property.findById(propertyId);
        if (!property || property.status !== 'available') {
          return res.status(400).json({ message: 'Property not available' });
        }

        // Calculate total amount (simplified)
        const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        const totalAmount = days * property.price;

        const booking = new Booking({
          property: propertyId,
          tenant: user._id,
          startDate,
          endDate,
          totalAmount,
        });

        await booking.save();
        res.status(201).json(booking);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
