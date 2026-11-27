import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

export async function fetchAdminReviews(status = '') {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired.');
  const query = status ? `?status=${status}` : '';
  return apiRequest(`/reviews/admin${query}`, { token: session.access_token });
}

export async function updateReviewStatus(id, status) {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired.');
  return apiRequest(`/reviews/admin/${id}`, {
    method: 'PATCH',
    token: session.access_token,
    body: JSON.stringify({ status }),
  });
}

export async function deleteReview(id) {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired.');
  return apiRequest(`/reviews/admin/${id}`, {
    method: 'DELETE',
    token: session.access_token,
  });
}
