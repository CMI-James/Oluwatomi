import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerConfig } from '@/lib/server-supabase';
import { sendVisitorLoadEmail } from '@/lib/email-alert';

export const runtime = 'nodejs';

type IncomingEvent = {
  eventType?: string;
  pageKey?: string;
  visitorName?: string;
  durationMs?: number;
  occurredAt?: string;
  path?: string;
  url?: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  viewportW?: number;
  viewportH?: number;
  screenW?: number;
  screenH?: number;
  tz?: string;
  language?: string;
  isMobile?: boolean;
  meta?: Record<string, unknown>;
};

const ALLOWED_EVENT_TYPES = new Set([
  'session_start',
  'page_view',
  'page_leave',
  'interaction',
  'session_end',
]);

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const toNullableInt = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : null;

const getIp = (req: NextRequest): string | null => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  return toNullableString(req.headers.get('x-real-ip'));
};

const isLikelyBot = (ua: string | null, path: string | null): boolean => {
  const userAgent = (ua || '').toLowerCase();
  const pathname = (path || '').toLowerCase();

  if (!userAgent) return true;
  if (pathname.includes('/_vercel') || pathname.includes('/api/')) return true;

  return /(bot|spider|crawler|headless|uptime|vercel|monitor|pingdom|checkly|datadog|facebookexternalhit|slurp|curl|wget)/i.test(
    userAgent
  );
};

export async function POST(req: NextRequest) {
  const { supabaseUrl, serviceRoleKey, hasSupabaseUrl, hasServiceRoleKey } =
    getSupabaseServerConfig();

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error: 'Server analytics env not configured.',
        debug: { hasSupabaseUrl, hasServiceRoleKey, nodeEnv: process.env.NODE_ENV || 'unknown' },
      },
      { status: 500 }
    );
  }

  let body: { sessionId?: string; events?: IncomingEvent[] } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const sessionId = toNullableString(body?.sessionId);
  const events = Array.isArray(body?.events) ? body.events.slice(0, 120) : [];

  if (!sessionId || events.length === 0) {
    return NextResponse.json({ error: 'sessionId and events are required.' }, { status: 400 });
  }

  const ip = getIp(req);

  const rows = events
    .filter((event) => ALLOWED_EVENT_TYPES.has(String(event.eventType)))
    .map((event) => {
      const path = toNullableString(event.path);
      const userAgent = toNullableString(event.userAgent);
      const isBot = isLikelyBot(userAgent, path);
      return {
        session_id: sessionId,
        event_type: String(event.eventType),
        page_key: toNullableString(event.pageKey),
        visitor_name: toNullableString(event.visitorName),
        duration_ms: toNullableInt(event.durationMs),
        occurred_at: toNullableString(event.occurredAt) ?? new Date().toISOString(),
        path,
        url: toNullableString(event.url),
        referrer: toNullableString(event.referrer),
        ip,
        user_agent: userAgent,
        device_type: toNullableString(event.deviceType),
        os: toNullableString(event.os),
        browser: toNullableString(event.browser),
        viewport_w: toNullableInt(event.viewportW),
        viewport_h: toNullableInt(event.viewportH),
        screen_w: toNullableInt(event.screenW),
        screen_h: toNullableInt(event.screenH),
        tz: toNullableString(event.tz),
        language: toNullableString(event.language),
        is_mobile: typeof event.isMobile === 'boolean' ? event.isMobile : null,
        meta: {
          ...(event.meta && typeof event.meta === 'object' ? event.meta : {}),
          is_bot: isBot,
        },
      };
    });

  if (!rows.length) {
    return NextResponse.json({ error: 'No valid events.' }, { status: 400 });
  }

  const loadEvent = rows.find(
    (row) => row.event_type === 'session_start' && (row.meta as { is_bot?: boolean })?.is_bot !== true
  );

  if (loadEvent) {
    void sendVisitorLoadEmail({
      occurredAt: loadEvent.occurred_at,
      ip: loadEvent.ip,
      deviceType: loadEvent.device_type,
      os: loadEvent.os,
      browser: loadEvent.browser,
      path: loadEvent.path,
      url: loadEvent.url,
      visitorName: loadEvent.visitor_name,
    }).catch(() => {
      // Never fail analytics ingest because email delivery fails.
    });
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(rows),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: 'Failed to write analytics.', detail: errorText.slice(0, 500) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, inserted: rows.length });
}
