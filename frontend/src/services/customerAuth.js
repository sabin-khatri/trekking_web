import { apiRequest } from './api';

const SESSION_KEY = 'apex-customer-session';

function readSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { sessionStorage.removeItem(SESSION_KEY); return null; }
}

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, expires_at: Date.now() + session.expires_in * 1000 }));
}

export function registerCustomer(name, email, password) {
  return apiRequest('/customer/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

export async function verifyCustomerEmail(token) {
  const session = await apiRequest('/customer/verify-email', { method: 'POST', body: JSON.stringify({ token }) });
  saveSession(session);
  return session.user;
}

export function resendCustomerVerification(email) {
  return apiRequest('/customer/resend-verification', { method: 'POST', body: JSON.stringify({ email }) });
}

export function requestCustomerPasswordReset(email) {
  return apiRequest('/customer/password-reset/request', { method: 'POST', body: JSON.stringify({ email }) });
}

export function completeCustomerPasswordReset(token, password) {
  return apiRequest('/customer/password-reset/complete', { method: 'POST', body: JSON.stringify({ token, password }) });
}

export async function signInCustomer(email, password) {
  const session = await apiRequest('/customer/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(session);
  return session.user;
}

export async function getCustomerSession() {
  const session = readSession();
  if (!session?.access_token || Date.now() >= session.expires_at) { sessionStorage.removeItem(SESSION_KEY); return null; }
  try { await apiRequest('/customer/me', { token: session.access_token }); return session; }
  catch { sessionStorage.removeItem(SESSION_KEY); return null; }
}

export function signOutCustomer() { sessionStorage.removeItem(SESSION_KEY); }

async function authorizedRequest(path, options = {}) {
  const session = await getCustomerSession();
  if (!session) throw new Error('Please sign in again to continue.');
  return apiRequest(path, { ...options, token: session.access_token });
}

export function fetchCustomerBookings() { return authorizedRequest('/customer/bookings'); }

export function updateCustomerPassword(currentPassword, newPassword) {
  return authorizedRequest('/customer/password', { method: 'PATCH', body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) });
}

export function updateCustomerProfile(name, phone) {
  return authorizedRequest('/customer/profile', { method: 'PATCH', body: JSON.stringify({ name, phone }) });
}

export function updateCustomerPreparation(bookingId, taskId, completed) {
  return authorizedRequest(`/customer/bookings/${encodeURIComponent(bookingId)}/preparation`, { method: 'PATCH', body: JSON.stringify({ taskId, completed }) });
}

export async function getCustomerProfile() {
  const session = await getCustomerSession();
  if (!session) return null;
  return apiRequest('/customer/me', { token: session.access_token });
}

export async function getCustomerToken() { return (await getCustomerSession())?.access_token || ''; }
