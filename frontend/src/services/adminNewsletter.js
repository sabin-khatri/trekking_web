import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

async function request(path, options = {}) {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');
  return apiRequest(path, { ...options, token: session.access_token });
}

export function fetchNewsletterSubscribers({ page = 1, limit = 25, search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) params.set('search', search.trim());
  return request(`/admin/newsletter?${params.toString()}`);
}

export function removeNewsletterSubscriber(id) {
  return request(`/admin/newsletter/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
