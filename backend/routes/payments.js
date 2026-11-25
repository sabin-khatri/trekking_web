import { Router } from 'express';
import {
  createEsewaPaymentLink,
  markEsewaFailure,
  paymentResultUrl,
  renderEsewaCheckout,
  verifyEsewaSuccess,
} from '../esewa.js';
import { Booking } from '../db.js';
import { sendAdminBookingAlert } from '../notifications.js';

const router = Router();

async function notifyAdminPayment(booking) {
  const { Admin, AdminActivity } = await import('../db.js');
  const admin = await Admin.findOne().select('notification_preferences');
  if (!admin?.notification_preferences?.paymentReceived) return;
  const result = await sendAdminBookingAlert(booking, { event: 'payment_received' });
  try {
    await AdminActivity.create({
      action: 'notification.payment_received',
      booking_reference: booking?.booking_reference || '',
      booking_id: booking?.id || '',
      details: `Admin email: ${result.status}`,
    });
  } catch { /* non-critical */ }
}

// GET /api/payments/esewa/checkout/:token
router.get('/esewa/checkout/:token', async (req, res, next) => {
  try {
    const checkout = await renderEsewaCheckout(req.params.token);
    return res.status(checkout.status).type('html').set('Cache-Control', 'no-store').send(checkout.html);
  } catch (error) {
    return next(error);
  }
});

// GET /api/payments/esewa/success
router.get('/esewa/success', async (req, res, next) => {
  try {
    const result = await verifyEsewaSuccess(req.query.data);
    if (result.status === 'paid' && !result.already_processed) {
      const booking = await Booking.findById(result.bookingId);
      if (booking) {
        try { await notifyAdminPayment(booking); } catch (e) {
          console.error('Payment received admin alert failed:', e.message);
        }
      }
    }
    const status = result.status === 'paid' ? 'success'
      : result.status === 'verification_pending' ? 'pending' : 'failed';
    return res.redirect(303, paymentResultUrl(status, result.bookingReference));
  } catch (error) {
    return next(error);
  }
});

// GET /api/payments/esewa/failure
router.get('/esewa/failure', async (req, res, next) => {
  try {
    const bookingReference = await markEsewaFailure(req.query.transaction_uuid);
    return res.redirect(303, paymentResultUrl('failed', bookingReference));
  } catch (error) {
    return next(error);
  }
});

export { createEsewaPaymentLink };
export default router;
