/* eslint-disable no-unused-vars */
import { treks } from '../data/treks';
import { galleryData } from '../data/galleryData';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTreks = async () => {
  await delay(500); // simulate 500ms network delay
  return treks;
};

export const fetchTrekById = async (id) => {
  await delay(500);
  const trek = treks.find((t) => t.name.toLowerCase().replace(/\s+/g, '-') === id);
  if (!trek) throw new Error('Trek not found');
  return trek;
};

export const fetchGallery = async () => {
  await delay(500);
  return galleryData;
};

// Simulated booking API
export const submitBooking = async (bookingData) => {
  await delay(1000);
  // Simulate successful booking
  return { success: true, message: 'Booking confirmed! We will contact you soon.', id: Math.random().toString(36).substr(2, 9) };
};
