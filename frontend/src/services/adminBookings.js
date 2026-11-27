import { getAdminSession } from './adminAuth';
import { apiRequest } from './api';

const toBookingView = (row) => ({
  id: row.id || row._id,
  reference: row.booking_reference || '',
  createdAt: row.created_at,
  name: row.customer_name,
  email: row.customer_email,
  phone: row.customer_phone,
  trek: row.trek_name,
  date: row.start_date,
  pax: row.travelers,
  amount: `Rs. ${Number(row.grand_total).toLocaleString()}`,
  amountValue: Number(row.grand_total),
  status: row.status,
  notification: row.notification,
  duration: '—',
  startPoint: 'Nepal',
  difficulty: '—',
  paymentMethod: row.payment_method,
  paymentStatus: row.payment_status || 'unpaid',
  paidValue: Number(row.paid_amount) || 0,
  paid: Number(row.paid_amount) > 0 ? `Rs. ${Number(row.paid_amount).toLocaleString()}` : 'Not received',
  due: `Rs. ${Math.max(0, Number(row.grand_total) - Number(row.paid_amount || 0)).toLocaleString()}`,
  notes: row.message,
});

export async function fetchAdminBookings() {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');

  const requestPage = (page) => apiRequest(`/admin/bookings?page=${page}&limit=100`, { token: session.access_token });
  const firstPage = await requestPage(1);
  // Support the older array response while consuming every page from the current API.
  if (Array.isArray(firstPage)) return firstPage.map(toBookingView);
  if (!Array.isArray(firstPage?.bookings)) throw new Error('The server returned an invalid booking list.');

  const rows = [...firstPage.bookings];
  const totalPages = Math.max(1, Number(firstPage.totalPages) || 1);
  for (let page = 2; page <= totalPages; page += 1) {
    const result = await requestPage(page);
    if (!Array.isArray(result?.bookings)) throw new Error('The server returned an invalid booking list.');
    rows.push(...result.bookings);
  }
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

export async function sendAdminPaymentLink(id, paymentMethod = 'deposit', provider = 'esewa') {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');
  const row = await apiRequest(`/admin/bookings/${encodeURIComponent(id)}/payment-link`, {
    method: 'POST',
    token: session.access_token,
    body: JSON.stringify({ payment_method: paymentMethod, provider }),
  });
  if (!row) throw new Error('Could not create a payment link.');
  return toBookingView(row);
}

export async function fetchAdminActivity() {
  const session = await getAdminSession();
  if (!session) throw new Error('Admin session expired. Please sign in again.');
  return apiRequest('/admin/activity', { token: session.access_token });
}
