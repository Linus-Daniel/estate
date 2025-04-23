import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { authenticate } from '@/middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        // Public endpoint - no auth required for listing properties
        const properties = await Property.find({ status: 'available' })
          .populate('agent', 'name email phone');
        res.status(200).json(properties);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'POST':
      try {
        // Only agents and admins can create properties
        const user = await authenticate(req);
        if (user.role !== 'agent' && user.role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        const propertyData = {
          ...req.body,
          agent: user.role === 'agent' ? user._id : req.body.agent || user._id,
        };

        const property = new Property(propertyData);
        await property.save();
        res.status(201).json(property);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}