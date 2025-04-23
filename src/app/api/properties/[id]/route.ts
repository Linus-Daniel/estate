import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import { authenticate } from '@/middleware/auth';

interface User {
  _id: string;
  role: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const property = await Property.findById(id).populate('agent', 'name email phone');
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }
        res.status(200).json(property);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'PUT':
    case 'PATCH':
      try {
        const user = await authenticate(req) as User;
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }

        // Only the agent who created the property or admin can update it
        if (property.agent.toString() !== user._id.toString() && user.role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        res.status(200).json(updatedProperty);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    case 'DELETE':
      try {
        const user = await authenticate(req) as User;
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }

        // Only the agent who created the property or admin can delete it
        if (property.agent.toString() !== user._id.toString() && user.role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        await Property.findByIdAndDelete(id);
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
