import { NextRequest, NextResponse } from 'next/server';
import {
  DETAILS_AUTH_COOKIE,
  expectedDetailsCookieValue,
  getDetailsPassword,
} from '@/lib/details-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { password?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const password = typeof body?.password === 'string' ? body.password : '';
  if (!password) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  if (password !== getDetailsPassword()) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: DETAILS_AUTH_COOKIE,
    value: expectedDetailsCookieValue(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

