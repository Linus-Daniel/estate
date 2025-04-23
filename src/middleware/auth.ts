import { NextApiRequest } from 'next';
import { verifyToken } from '../lib/auth';
import User from '@/models/User';

interface DecodedToken {
  _id: string;
  // Add other properties from your JWT payload if needed
  [key: string]: any;
}

export const authenticate = async (req:NextApiRequest) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verifyToken(token) as DecodedToken;
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};