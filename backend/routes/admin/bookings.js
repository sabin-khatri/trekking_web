import { Router } from 'express';
import { Booking, AdminActivity } from '../../db.js';
import { requireAdmin } from '../../auth.js';
import { sendAdminBookingAlert, sendBookingStatusEmail } from '../../notifications.js';
import { createEsewaPaymentLink } from '../../esewa.js';

const router = Router();

async function recordActivity(booking, action, details = '') {
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
  const { Admin } = await import('../../db.js');
  const admin = await Admin.findOne().select('notification_preferences');
  if (!admin?.notification_preferences?.[preference]) return { status: 'disabled' };
  const result = await sendAdminBookingAlert(booking, { event });
  await recordActivity(booking, `notification.${event}`, `Admin email: ${result.status}`);
  return result;
}

// GET /api/admin/bookings — with pagination, search, filter
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = String(req.query.search || '').trim();
    const dateFrom = req.query.date_from;
    const dateTo = req.query.date_to;

    const filter = {};

    // Status filter
    if (['pending', 'confirmed', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.created_at = {};
      if (dateFrom) filter.created_at.$gte = new Date(dateFrom);
      if (dateTo) filter.created_at.$lte = new Date(`${dateTo}T23:59:59.999Z`);
    }

    // Search filter — across name, email, phone, trek, reference
    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { customer_name: searchRegex },
        { customer_email: searchRegex },
        { customer_phone: searchRegex },
        { trek_name: searchRegex },
        { booking_reference: searchRegex },
      ];
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(filter),
    ]);

    return res.json({
      bookings: bookings.map((b) => b.toJSON()),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/admin/bookings/:id
router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Unsupported booking status.' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking request was not found.' });

    const changed = booking.status !== status;
    const previousStatus = booking.status;
    booking.status = status;
    await booking.save();
    if (changed) await recordActivity(booking, 'booking.status', `Status changed from ${previousStatus} to ${status}`);

    let notification = { status: 'unchanged', payment_status: booking.payment_status };
    if (changed && ['confirmed', 'cancelled'].includes(status)) {
      if (status === 'cancelled') {
        try { await notifyAdmin(booking, 'cancellation', 'cancelled'); } catch (e) {
          console.error('Cancellation admin alert failed:', e.message);
        }
      }
      let payment = { status: 'not_needed' };
      let paymentOptions = [];
      if (status === 'confirmed') {
        try {
          if (booking.paid_amount > 0) {
            payment = await createEsewaPaymentLink(booking);
            if (payment.status === 'ready') paymentOptions = [{ label: 'Pay remaining balance', amount: payment.amount, url: payment.url }];
          } else {
            const deposit = await createEsewaPaymentLink(booking, { paymentMethod: 'deposit', keepExistingPending: true });
            const full = await createEsewaPaymentLink(booking, { paymentMethod: 'full', keepExistingPending: true });
            if (deposit.status === 'ready') paymentOptions.push({ label: 'Pay 20% deposit', amount: deposit.amount, url: deposit.url });
            if (full.status === 'ready') paymentOptions.push({ label: 'Pay in full', amount: full.amount, url: full.url });
            payment = paymentOptions.length ? { status: 'ready', url: deposit.url || full.url, amount: paymentOptions[0].amount } : deposit;
          }
        } catch (e) {
          console.error('Could not create eSewa payment link:', e.message);
          payment = { status: 'failed' };
        }
      }
      try {
        const email = await sendBookingStatusEmail(booking, { paymentUrl: payment.url, paymentAmount: payment.amount, paymentOptions });
        notification = { status: email.status, payment_status: payment.status, payment_amount: payment.amount, payment_url: payment.url, payment_options: paymentOptions };
        await recordActivity(booking, 'notification.booking_status', `Customer email: ${email.status}`);
      } catch (e) {
        console.error('Booking status email failed:', e.message);
        notification = { status: 'failed', payment_status: payment.status, payment_amount: payment.amount, payment_url: payment.url, payment_options: paymentOptions };
        await recordActivity(booking, 'notification.booking_status', 'Customer email: failed');
      }
    }
    return res.json({ ...booking.toJSON(), notification });
  } catch (error) {
    return next(error);
  }
});

// POST /api/admin/bookings/:id/payment-link
router.post('/:id/payment-link', requireAdmin, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking request was not found.' });
    if (booking.status !== 'confirmed') return res.status(409).json({ message: 'Confirm the booking before sending a payment link.' });
    if (booking.payment_status === 'paid') return res.status(409).json({ message: 'This booking is already fully paid.' });

    const paymentMethod = req.body?.payment_method === 'full' ? 'full' : 'deposit';
    const payment = await createEsewaPaymentLink(booking, { paymentMethod });
    if (payment.status !== 'ready') return res.status(503).json({ message: 'eSewa is not configured. Set its merchant values in backend/.env.' });

    let email;
    try {
      const paymentLabel = booking.paid_amount > 0 ? 'Pay remaining balance' : paymentMethod === 'full' ? 'Pay in full' : 'Pay 20% deposit';
      email = await sendBookingStatusEmail(booking, { paymentOptions: [{ label: paymentLabel, amount: payment.amount, url: payment.url }] });
    } catch (e) {
      console.error('Payment link email failed:', e.message);
      email = { status: 'failed' };
    }
    await recordActivity(booking, 'payment.link', `Payment link email: ${email.status}`);
    return res.json({ ...booking.toJSON(), notification: { status: email.status, payment_status: payment.status, payment_amount: payment.amount, payment_url: payment.url } });
  } catch (error) {
    return next(error);
  }
});

export default router;
