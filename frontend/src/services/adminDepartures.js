import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

async function authorizedRequest(path, options = {}) {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');
  return apiRequest(path, { ...options, token: session.access_token });
}

export const fetchAdminDepartures = () => authorizedRequest('/admin/departures');
export const saveAdminDeparture = (data) => authorizedRequest('/admin/departures', {
  method: 'POST', body: JSON.stringify(data),
});
export const setAdminDepartureOpen = (id, is_open) => authorizedRequest(`/admin/departures/${encodeURIComponent(id)}`, {
  method: 'PATCH', body: JSON.stringify({ is_open }),
});
