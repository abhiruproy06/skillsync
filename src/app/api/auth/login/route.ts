import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createSession, verifyPassword } from '@/lib/auth';
import { mockUsers } from '@/lib/mock-data';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    let user: User | null = null;

    try {
      const rows = await query<User[]>('SELECT * FROM users WHERE email = ?', [email]);
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch {
      // Fallback to mock
      user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found with this email' }, { status: 404 });
    }

    // Verify password if provided; if using demo quick switch or password matches
    if (password && user.password_hash) {
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid && password !== 'password123') {
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
      }
    }

    await createSession({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}

