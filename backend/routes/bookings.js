import { Router } from 'express';
import { Booking, TrekPackage } from '../db.js';
import { sendAdminBookingAlert } from '../notifications.js';
import { calculateBookingPrice } from '../pricing.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';
import { cleanString } from '../middleware/sanitize.js';
import { attachOptionalCustomer } from '../customerAuth.js';

const router = Router();

async function recordAdminActivity(booking, action, details = '') {
  const { AdminActivity } = await import('../db.js');
  try {
    await AdminActivity.create({
      action,
      booking_reference: booking?.booking_reference || '',
      booking_id: booking?.id || '',
      details,
    });
  } catch (error) {
    console.error('Could not save admin activity:', error.message);
  }
}

async function notifyAdmin(booking, preference, event) {
  const { Admin } = await import('../db.js');
  const admin = await Admin.findOne().select('notification_preferences');
  if (!admin?.notification_preferences?.[preference]) return { status: 'disabled' };
  const result = await sendAdminBookingAlert(booking, { event });
  await recordAdminActivity(booking, `notification.${event}`, `Admin email: ${result.status}`);
  return result;
}

// POST /api/bookings
router.post('/', bookingLimiter, attachOptionalCustomer, async (req, res, next) => {
  try {
    const {
      trek_name, start_date, travelers, addons = [], customer_name,
      customer_email, customer_phone, message = '',
    } = req.body;

    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(start_date || '')
      && !Number.isNaN(Date.parse(`${start_date}T00:00:00.000Z`))
      && new Date(`${start_date}T00:00:00.000Z`).toISOString().slice(0, 10) === start_date;

    if (!trek_name || !start_date || !customer_name || !customer_email || !customer_phone
      || !validDate || !/^\S+@\S+\.\S+$/.test(customer_email)
      || !Number.isInteger(Number(travelers)) || !Array.isArray(addons)) {
      return res.status(400).json({ message: 'Please provide valid booking details.' });
    }
    if (req.customer && String(customer_email).trim().toLowerCase() !== req.customer.email) {
      return res.status(403).json({ message: 'A signed-in customer must book using their account email.' });
    }

    const trekPackage = await TrekPackage.findOne({ name: cleanString(trek_name, 160), status: 'active' });
    if (!trekPackage) return res.status(400).json({ message: 'Selected trek is unavailable.' });
    if (Number(travelers) > trekPackage.maxGroupSize) {
      return res.status(400).json({ message: `This trek accepts up to ${trekPackage.maxGroupSize} travelers per booking.` });
    }

    let pricing;
    try {
      pricing = calculateBookingPrice({ trekPrice: trekPackage.price, travelers, addons, paymentMethod: 'deposit' });
    } catch (pricingError) {
      return res.status(400).json({ message: pricingError.message });
    }

    const booking = await Booking.create({
      trek_name: cleanString(trek_name, 160),
      start_date,
      travelers: Number(travelers),
      addons,
      customer_name: cleanString(customer_name, 160),
      customer_email: String(customer_email).trim().toLowerCase(),
      customer_phone: cleanString(customer_phone, 40),
      customer_id: req.customer?.id || null,
      message: cleanString(message, 3000),
      ...pricing,
    });

    await recordAdminActivity(booking, 'booking.created', `New booking from ${booking.customer_name}`);
    try {
      await notifyAdmin(booking, 'newBooking', 'new_booking');
    } catch (error) {
      console.error('New booking admin alert failed:', error.message);
    }

    return res.status(201).json({
      success: true,
      id: booking.id,
      booking_reference: booking.booking_reference,
      ...pricing,
    });
  } catch (error) {
    return next(error);
  }
});

// POST /api/bookings/track
router.post('/track', async (req, res, next) => {
  try {
    const reference = String(req.body.booking_reference || '').trim().toUpperCase();
    const email = String(req.body.customer_email || '').trim().toLowerCase();
    if (!/^[A-F0-9]{18}$/.test(reference) || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid booking reference and the email used for booking.' });
    }

    const booking = await Booking.findOne({ booking_reference: reference, customer_email: email });
    if (!booking) return res.status(404).json({ message: 'Booking not found. Check the reference and booking email.' });

    return res.json({
      booking_reference: booking.booking_reference,
      trek_name: booking.trek_name,
      start_date: booking.start_date,
      travelers: booking.travelers,
      status: booking.status,
      payment_method: booking.payment_method,
      payment_status: booking.payment_status,
      grand_total: booking.grand_total,
      paid_amount: booking.paid_amount,
      created_at: booking.created_at,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
