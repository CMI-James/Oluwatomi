import { NextRequest, NextResponse } from 'next/server';
import { DETAILS_AUTH_COOKIE, isValidDetailsCookie } from '@/lib/details-auth';

export const runtime = 'nodejs';

type AnalyticsRow = {
  occurred_at: string;
  visitor_name: string | null;
  session_id: string;
  page_key: string | null;
  event_type: string;
  duration_ms: number | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  is_mobile: boolean | null;
  ip: string | null;
  path: string | null;
  url: string | null;
  viewport_w: number | null;
  viewport_h: number | null;
  language: string | null;
  tz: string | null;
};

export async function GET(req: NextRequest) {
  const cookieValue = req.cookies.get(DETAILS_AUTH_COOKIE)?.value;
  if (!isValidDetailsCookie(cookieValue)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server analytics env not configured.' }, { status: 500 });
  }

  const select =
    'occurred_at,visitor_name,session_id,page_key,event_type,duration_ms,device_type,os,browser,is_mobile,ip,path,url,viewport_w,viewport_h,language,tz';
  const response = await fetch(
    `${supabaseUrl}/rest/v1/analytics_events?select=${encodeURIComponent(select)}&order=occurred_at.desc&limit=500`,
    {
      method: 'GET',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json(
      { error: 'Failed to load analytics details.', detail: detail.slice(0, 500) },
      { status: 500 }
    );
  }

  const rows = (await response.json()) as AnalyticsRow[];

  const sessions = new Set<string>();
  const deviceCount = { mobile: 0, tablet: 0, desktop: 0, unknown: 0 };
  const pageDuration: Record<string, { totalMs: number; count: number }> = {};

  for (const row of rows) {
    sessions.add(row.session_id);

    const device = (row.device_type || 'unknown') as keyof typeof deviceCount;
    if (device in deviceCount) deviceCount[device] += 1;
    else deviceCount.unknown += 1;

    if (row.event_type === 'page_leave' && row.page_key && typeof row.duration_ms === 'number') {
      if (!pageDuration[row.page_key]) {
        pageDuration[row.page_key] = { totalMs: 0, count: 0 };
      }
      pageDuration[row.page_key].totalMs += row.duration_ms;
      pageDuration[row.page_key].count += 1;
    }
  }

  const pages = Object.entries(pageDuration)
    .map(([pageKey, value]) => ({
      pageKey,
      totalMs: value.totalMs,
      avgMs: value.count > 0 ? Math.round(value.totalMs / value.count) : 0,
      exits: value.count,
    }))
    .sort((a, b) => b.totalMs - a.totalMs)
    .slice(0, 20);

  return NextResponse.json({
    summary: {
      totalEvents: rows.length,
      uniqueSessions: sessions.size,
      deviceCount,
    },
    pages,
    rows,
  });
}

