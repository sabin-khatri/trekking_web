import { apiRequest } from './api';

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
  const session = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession({ ...session, expires_at: Date.now() + session.expires_in * 1000 });
  return session.user;
}

export async function getAdminSession() {
  const session = readSession();
  if (!session?.access_token || Date.now() >= session.expires_at) {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
  try {
    await apiRequest('/auth/me', { token: session.access_token });
    return session;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signOutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}
