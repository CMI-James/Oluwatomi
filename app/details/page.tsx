'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type DetailsResponse = {
  summary: {
    totalEvents: number;
    uniqueSessions: number;
    deviceCount: { mobile: number; tablet: number; desktop: number; unknown: number };
    includeBots: boolean;
  };
  pages: Array<{ pageKey: string; totalMs: number; avgMs: number; exits: number }>;
  rows: Array<{
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
    meta: Record<string, unknown> | null;
  }>;
};

const formatMs = (ms: number): string => {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r}s`;
};

export default function DetailsPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<DetailsResponse | null>(null);
  const [includeBots, setIncludeBots] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/details/data${includeBots ? '?includeBots=1' : ''}`, {
        cache: 'no-store',
      });
      if (res.status === 401) {
        setData(null);
        return;
      }
      const json = (await res.json()) as DetailsResponse | { error?: string };
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Failed to load details.');
        return;
      }
      setData(json as DetailsResponse);
    } catch {
      setError('Network error loading details.');
    } finally {
      setLoading(false);
    }
  }, [includeBots]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/details/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error || 'Login failed.');
        return;
      }
      setPassword('');
      await loadData();
    } catch {
      setError('Network error during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/details/logout', { method: 'POST' });
    setData(null);
    setError('');
  };

  const deviceStats = useMemo(() => data?.summary.deviceCount, [data]);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 p-8 space-y-4"
        >
          <h1 className="text-2xl font-semibold">Details Login</h1>
          <p className="text-sm text-slate-400">Enter password to view analytics details.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 outline-none focus:border-slate-400"
            placeholder="Password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-500 px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 md:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">Analytics Details</h1>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 rounded-lg border border-slate-600 px-3 py-2">
            <input
              type="checkbox"
              checked={includeBots}
              onChange={(e) => setIncludeBots(e.target.checked)}
            />
            Include bots
          </label>
          <button
            onClick={() => void loadData()}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-rose-500/50 px-4 py-2 text-sm text-rose-300"
          >
            Logout
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Events</p>
          <p className="text-xl font-semibold">{data.summary.totalEvents}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Sessions</p>
          <p className="text-xl font-semibold">{data.summary.uniqueSessions}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Mobile</p>
          <p className="text-xl font-semibold">{deviceStats?.mobile ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Desktop</p>
          <p className="text-xl font-semibold">{deviceStats?.desktop ?? 0}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-medium mb-3">Top Pages by Time Spent</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-2 pr-4">Page</th>
                <th className="py-2 pr-4">Avg</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2">Exits</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map((row) => (
                <tr key={row.pageKey} className="border-t border-slate-800">
                  <td className="py-2 pr-4">{row.pageKey}</td>
                  <td className="py-2 pr-4">{formatMs(row.avgMs)}</td>
                  <td className="py-2 pr-4">{formatMs(row.totalMs)}</td>
                  <td className="py-2">{row.exits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-lg font-medium mb-3">Recent Events</h2>
        <div className="max-h-[55vh] overflow-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="sticky top-0 bg-slate-900">
              <tr className="text-left text-slate-400">
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Event</th>
                <th className="py-2 pr-3">Page</th>
                <th className="py-2 pr-3">Duration</th>
                <th className="py-2 pr-3">Device</th>
                <th className="py-2 pr-3">Browser</th>
                <th className="py-2 pr-3">OS</th>
                <th className="py-2">IP</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, idx) => (
                <tr key={`${row.session_id}-${idx}`} className="border-t border-slate-800">
                  <td className="py-2 pr-3">{new Date(row.occurred_at).toLocaleString()}</td>
                  <td className="py-2 pr-3">{row.visitor_name || '-'}</td>
                  <td className="py-2 pr-3">{row.event_type}</td>
                  <td className="py-2 pr-3">{row.page_key || '-'}</td>
                  <td className="py-2 pr-3">
                    {typeof row.duration_ms === 'number' ? formatMs(row.duration_ms) : '-'}
                  </td>
                  <td className="py-2 pr-3">{row.device_type || '-'}</td>
                  <td className="py-2 pr-3">{row.browser || '-'}</td>
                  <td className="py-2 pr-3">{row.os || '-'}</td>
                  <td className="py-2">{row.ip || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </main>
  );
}
