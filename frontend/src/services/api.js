import { treks } from '../data/treks';
import { galleryData } from '../data/galleryData';
const API_URL = import.meta.env.VITE_API_URL || '';

export async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'The server request failed.');
  }
  if (response.status === 204) return null;
  return response.json();
}

// Trek and gallery content is bundled with the app, so don't add fake network latency.
export const fetchTreks = async () => treks;

export const fetchTrekById = async (id) => {
  const trek = treks.find((t) => t.id === id);
  if (!trek) throw new Error('Trek not found');
  return trek;
};

export const fetchGallery = async () => {
  return galleryData;
};

export const submitBooking = async (bookingData) => {
  await apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      trek_name: bookingData.trekName,
      start_date: bookingData.startDate,
      travelers: bookingData.travelers,
      addons: bookingData.addons,
      customer_name: bookingData.customerName,
      customer_email: bookingData.customerEmail,
      customer_phone: bookingData.customerPhone,
      message: bookingData.message,
      grand_total: bookingData.grandTotal,
      payment_method: bookingData.paymentMethod,
      deposit_amount: bookingData.depositAmount,
    }),
  });
  return { success: true };
};
