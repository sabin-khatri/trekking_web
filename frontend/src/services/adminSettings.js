import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

async function settingsRequest(path, options = {}) {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');
  return apiRequest(path, { ...options, token: session.access_token });
}

export const fetchAdminSettings = () => settingsRequest('/admin/settings');
export const fetchAdminReadiness = () => settingsRequest('/admin/readiness');

export const saveAdminProfile = (profile) => settingsRequest('/admin/settings/profile', {
  method: 'PATCH',
  body: JSON.stringify(profile),
});

export const changeAdminPassword = (currentPassword, newPassword) => settingsRequest('/admin/settings/password', {
  method: 'PATCH',
  body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
});
