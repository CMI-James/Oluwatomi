import { NextResponse } from 'next/server';
import { DETAILS_AUTH_COOKIE } from '@/lib/details-auth';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: DETAILS_AUTH_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}

