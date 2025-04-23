// lib/auth.ts
import { NextRequest } from 'next/server';
import { verifyToken } from '../lib/auth';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import { Types } from 'mongoose';

type UserRole = 'tenant' | 'agent' | 'admin';

interface AuthenticatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthOptions {
  requireVerifiedEmail?: boolean;
  allowedRoles?: UserRole[];
}

export class AuthError extends Error {
  constructor(public message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function authenticate(
  request: NextRequest,
  options: AuthOptions = {}
): Promise<AuthenticatedUser> {
  try {
    await dbConnect();
    
    // Get token from Authorization header or cookies
    const token = request.headers.get('authorization')?.split(' ')[1] || 
                 request.cookies.get('authToken')?.value;

    if (!token) {
      throw new AuthError('Authentication required', 401);
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded?._id) {
      throw new AuthError('Invalid token', 401);
    }

    // Get user from database
    const user = await User.findById(decoded._id)
      .select('name email role isEmailVerified');
    
    if (!user) {
      throw new AuthError('User not found', 404);
    }

    // Check email verification if required
    if (options.requireVerifiedEmail && !user.isEmailVerified) {
      throw new AuthError('Email verification required', 403);
    }

    // Check role permissions
    if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
      throw new AuthError('Insufficient permissions', 403);
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Authentication failed', 500);
  }
}

export function requireRoles(roles: UserRole | UserRole[]) {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return async (request: NextRequest) => {
    const user = await authenticate(request, { allowedRoles: roleArray });
    return user;
  };
}

// Utility for route handlers
export async function authenticatedRoute(
  request: NextRequest,
  handler: (user: AuthenticatedUser) => Promise<Response>,
  options?: AuthOptions
) {
  try {
    const user = await authenticate(request, options);
    return await handler(user);
  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}