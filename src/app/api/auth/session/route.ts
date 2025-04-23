import { verifyToken } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    res.status(200).json(decoded);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
}