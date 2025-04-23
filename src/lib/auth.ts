// lib/jwt.ts
import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

type UserRole = 'tenant' | 'agent' | 'admin';

interface UserTokenPayload extends JwtPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN  ;
const JWT_ISSUER = process.env.JWT_ISSUER || 'your-app-name';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'your-app-client';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const signOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as undefined,
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
  algorithm: 'HS256',
};

const verifyOptions: VerifyOptions = {
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
  algorithms: ['HS256'],
};

export const generateToken = (user: {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
}): string => {
  const payload: UserTokenPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const verifyToken = (token: string): UserTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, verifyOptions);
    
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded as UserTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

// Optional refresh token functionality
export const generateRefreshToken = (user: {
  _id: Types.ObjectId;
}): string => {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET || JWT_SECRET + '-refresh',
    { expiresIn: '90d' }
  );
};

export const verifyRefreshToken = (token: string): { _id: Types.ObjectId } => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || JWT_SECRET + '-refresh'
    ) as { _id: Types.ObjectId };
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};