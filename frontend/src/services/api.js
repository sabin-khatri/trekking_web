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
    const requestError = new Error(error.message || 'The server request failed.');
    requestError.status = response.status;
    requestError.code = error.code;
    throw requestError;
  }
  if (response.status === 204) return null;
  return response.json();
}

const normalizeTrek = (record) => {
  const fallback = treks.find((trek) => trek.name.toLowerCase() === String(record.name || '').toLowerCase());
  const difficulty = String(record.difficulty || record.category || 'Moderate').toLowerCase();
  const durationText = String(record.duration || '');
  const durationParts = durationText.match(/(\d+)\s*(day|week|month)?/i);
  const durationNumber = durationParts
    ? Number(durationParts[1]) * (/week/i.test(durationParts[2] || '') ? 7 : /month/i.test(durationParts[2] || '') ? 30 : 1)
    : fallback?.duration || 1;
  return {
    ...fallback,
    ...record,
    id: record.slug || record.id || record._id,
    category: difficulty === 'easy' ? 'easy' : difficulty === 'strenuous' ? 'challenging' : difficulty === 'challenging' ? 'challenging' : 'moderate',
    location: record.region || fallback?.location || '',
    duration: durationNumber,
    price: Number(record.price) || 0,
    image: record.image_url || record.image || fallback?.image || treks[0]?.image || '',
    maxAltitude: record.max_altitude || record.maxAltitude || fallback?.maxAltitude || '',
    maxGroupSize: Number(record.maxGroupSize) || fallback?.maxGroupSize || 12,
    featured: record.featured ?? fallback?.featured ?? false,
    itinerary: record.itinerary?.length ? record.itinerary : fallback?.itinerary || [],
  };
};

export const fetchTreks = async () => {
  try {
    const records = await apiRequest('/packages');
    return records.map(normalizeTrek);
  } catch (error) {
    if (error.status) throw error;
    return treks.map(normalizeTrek);
  }
};

export const fetchTrekById = async (id) => {
  try {
    return normalizeTrek(await apiRequest(`/packages/${encodeURIComponent(id)}`));
  } catch (error) {
    if (error.status) throw error;
    const localTrek = treks.find((trek) => trek.id === id);
    if (localTrek) return normalizeTrek(localTrek);
    throw error;
  }
};

export const fetchTrekDepartures = (trek) => apiRequest(`/departures?trek=${encodeURIComponent(trek)}`);

export const fetchGallery = async () => {
  try {
    return await apiRequest('/gallery');
  } catch {
    return galleryData; // fall back to static
  }
};

export const submitBooking = async (bookingData, customerToken = '') => {
  return apiRequest('/bookings', {
    method: 'POST',
    token: customerToken,
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
    }),
  });
};

export const trackBooking = (bookingReference, customerEmail) => apiRequest('/bookings/track', {
  method: 'POST',
  body: JSON.stringify({ booking_reference: bookingReference, customer_email: customerEmail }),
});

export const subscribeToNewsletter = (email) => apiRequest('/newsletter/subscribe', {
  method: 'POST',
  body: JSON.stringify({ email }),
});
