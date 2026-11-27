import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

async function authorizedRequest(path, options = {}) {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');
  return apiRequest(path, { ...options, token: session.access_token });
}

export async function fetchAdminPackages() {
  const packages = await authorizedRequest('/admin/packages');
  return packages.map((packageRecord) => ({ ...packageRecord, id: packageRecord.id || packageRecord._id }));
}

export const createAdminPackage = (data) => authorizedRequest('/admin/packages', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateAdminPackage = (id, data) => authorizedRequest(`/admin/packages/${encodeURIComponent(id)}`, {
  method: 'PATCH',
  body: JSON.stringify(data),
});

export const deleteAdminPackage = (id) => authorizedRequest(`/admin/packages/${encodeURIComponent(id)}`, {
  method: 'DELETE',
});
