import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    return NextResponse.json(decoded);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}