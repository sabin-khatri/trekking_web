import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

const toBookingView = (row) => ({
  id: row.id,
  createdAt: row.created_at,
  name: row.customer_name,
  email: row.customer_email,
  phone: row.customer_phone,
  trek: row.trek_name,
  date: row.start_date,
  pax: row.travelers,
  amount: `Rs. ${Number(row.grand_total).toLocaleString()}`,
  status: row.status,
  duration: '—',
  startPoint: 'Nepal',
  difficulty: '—',
  paymentMethod: row.payment_method,
  paid: 'Not processed',
  due: `Rs. ${Number(row.grand_total).toLocaleString()}`,
  notes: row.message,
});

export async function fetchAdminBookings() {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');

  const rows = await apiRequest('/admin/bookings', {
    token: session.access_token,
  });

  return rows.map(toBookingView);
}

export async function updateAdminBookingStatus(id, status) {
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    throw new Error('Unsupported booking status.');
  }
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');

  const row = await apiRequest(`/admin/bookings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    token: session.access_token,
    body: JSON.stringify({ status }),
  });
  if (!row) throw new Error('Booking request was not found.');
  return toBookingView(row);
}
