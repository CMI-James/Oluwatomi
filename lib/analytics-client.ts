'use client';

type AnalyticsEventType =
  | 'session_start'
  | 'page_view'
  | 'page_leave'
  | 'interaction'
  | 'session_end';

type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  pageKey?: string;
  visitorName?: string;
  durationMs?: number;
  meta?: Record<string, unknown>;
  occurredAt?: string;
};

type DeviceSnapshot = {
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  viewportW: number;
  viewportH: number;
  screenW: number;
  screenH: number;
  tz: string;
  language: string;
  isMobile: boolean;
};

const API_PATH = '/api/analytics/events';
const SESSION_KEY = 'oa_session_id';
const MAX_QUEUE = 120;
const FLUSH_INTERVAL_MS = 4000;

let sessionId = '';
let initialized = false;
let currentPageKey: string | null = null;
let currentPageStart = 0;
let currentVisitorName = '';
let flushTimer: number | null = null;
let sessionEnded = false;
let sessionEnding = false;
const eventQueue: AnalyticsEvent[] = [];

const getSessionId = (): string => {
  if (sessionId) return sessionId;
  if (typeof window === 'undefined') return '';

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    sessionId = existing;
    return sessionId;
  }

  sessionId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};

const parseDeviceType = (ua: string): DeviceSnapshot['deviceType'] => {
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android/i.test(ua)) return 'mobile';
  return 'desktop';
};

const parseOs = (ua: string): string => {
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Unknown';
};

const parseBrowser = (ua: string): string => {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\//i.test(ua)) return 'Opera';
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return 'Chrome';
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return 'Safari';
  if (/firefox\//i.test(ua)) return 'Firefox';
  return 'Unknown';
};

const getDeviceSnapshot = (): DeviceSnapshot => {
  const ua = navigator.userAgent ?? '';
  const deviceType = parseDeviceType(ua);
  return {
    userAgent: ua,
    deviceType,
    os: parseOs(ua),
    browser: parseBrowser(ua),
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
    screenW: window.screen?.width ?? 0,
    screenH: window.screen?.height ?? 0,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'unknown',
    language: navigator.language ?? 'unknown',
    isMobile: deviceType !== 'desktop',
  };
};

const pushEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;
  eventQueue.push(event);
  if (eventQueue.length > MAX_QUEUE) {
    eventQueue.splice(0, eventQueue.length - MAX_QUEUE);
  }
};

const serializeEvents = (events: AnalyticsEvent[]) => ({
  sessionId: getSessionId(),
  events: events.map((event) => ({
    ...event,
    occurredAt: event.occurredAt ?? new Date().toISOString(),
    visitorName: event.visitorName ?? (currentVisitorName || undefined),
    path: window.location.pathname,
    url: window.location.href,
    referrer: document.referrer || undefined,
    ...getDeviceSnapshot(),
  })),
});

const flushWithFetch = async (events: AnalyticsEvent[]) => {
  if (!events.length) return;
  await fetch(API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serializeEvents(events)),
    keepalive: true,
  });
};

const flushWithBeacon = (events: AnalyticsEvent[]): boolean => {
  if (!events.length || !navigator.sendBeacon) return false;
  const payload = JSON.stringify(serializeEvents(events));
  return navigator.sendBeacon(API_PATH, new Blob([payload], { type: 'application/json' }));
};

export const flushAnalytics = async () => {
  if (!eventQueue.length) return;
  const batch = eventQueue.splice(0, eventQueue.length);
  try {
    const beaconSent = flushWithBeacon(batch);
    if (!beaconSent) {
      await flushWithFetch(batch);
    }
  } catch {
    eventQueue.unshift(...batch);
  }
};

export const initAnalytics = (visitorName?: string) => {
  if (typeof window === 'undefined' || initialized) {
    if (visitorName) currentVisitorName = visitorName;
    return;
  }

  initialized = true;
  if (visitorName) currentVisitorName = visitorName;
  getSessionId();

  pushEvent({ eventType: 'session_start' });
  void flushAnalytics();

  const endSessionOnce = (reason: 'hidden' | 'pagehide') => {
    if (sessionEnded || sessionEnding) return;
    sessionEnding = true;
    endCurrentPage(reason);
    pushEvent({ eventType: 'session_end', meta: { reason } });
    sessionEnded = true;
    void flushAnalytics().finally(() => {
      sessionEnding = false;
    });
  };

  const onHidden = () => {
    if (document.visibilityState !== 'hidden') return;
    endSessionOnce('hidden');
  };

  const onPageHide = () => {
    endSessionOnce('pagehide');
  };

  document.addEventListener('visibilitychange', onHidden);
  window.addEventListener('pagehide', onPageHide);

  flushTimer = window.setInterval(() => {
    void flushAnalytics();
  }, FLUSH_INTERVAL_MS);
};

export const setAnalyticsVisitorName = (name: string) => {
  currentVisitorName = name;
};

export const trackInteraction = (pageKey: string, meta?: Record<string, unknown>) => {
  pushEvent({ eventType: 'interaction', pageKey, meta });
};

export const endCurrentPage = (reason?: string) => {
  if (!currentPageKey || !currentPageStart) return;
  const durationMs = Math.max(0, Date.now() - currentPageStart);
  pushEvent({
    eventType: 'page_leave',
    pageKey: currentPageKey,
    durationMs,
    meta: reason ? { reason } : undefined,
  });
  currentPageStart = 0;
};

export const trackScreenChange = (pageKey: string, visitorName?: string) => {
  if (sessionEnded) return;
  if (visitorName) currentVisitorName = visitorName;
  if (!pageKey) return;

  if (currentPageKey && currentPageKey !== pageKey) {
    endCurrentPage('screen_change');
  }

  if (currentPageKey === pageKey && currentPageStart > 0) return;

  currentPageKey = pageKey;
  currentPageStart = Date.now();
  pushEvent({ eventType: 'page_view', pageKey });
};

export const resetAnalyticsFlowPage = () => {
  endCurrentPage('flow_reset');
  currentPageKey = null;
};
