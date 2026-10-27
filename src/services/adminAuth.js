import { requireSupabase } from './supabase';

const SESSION_KEY = 'apex-admin-session';

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signInAdmin(email, password) {
  const { url, anonKey } = requireSupabase();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const session = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(session.msg || session.message || 'Email or password is incorrect.');
  if (session.user?.app_metadata?.role !== 'admin') {
    await fetch(`${url}/auth/v1/logout`, {
      method: 'POST',
      headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}` },
    });
    throw new Error('This account does not have admin access.');
  }
  saveSession(session);
  return session.user;
}

export async function getAdminSession() {
  const session = readSession();
  if (!session?.access_token || !session?.refresh_token) return null;
  const { url, anonKey } = requireSupabase();
  const createdAt = typeof session.created_at === 'number'
    ? session.created_at * 1000
    : Date.parse(session.created_at || '') || Date.now();
  const expiresAt = session.expires_at
    ? session.expires_at * 1000
    : createdAt + (session.expires_in || 0) * 1000;

  let current = session;
  if (Date.now() > expiresAt - 60_000) {
    const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    current = await response.json().catch(() => ({}));
    if (!response.ok || current.user?.app_metadata?.role !== 'admin') {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    saveSession(current);
  }

  if (current.user?.app_metadata?.role !== 'admin') {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  return current;
}

export async function signOutAdmin() {
  const session = readSession();
  sessionStorage.removeItem(SESSION_KEY);
  if (!session?.access_token) return;

  const { url, anonKey } = requireSupabase();
  await fetch(`${url}/auth/v1/logout`, {
    method: 'POST',
    headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}` },
  });
}
