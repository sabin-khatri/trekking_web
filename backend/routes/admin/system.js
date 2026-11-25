import { Router } from 'express';
import { Admin, AdminActivity, Booking, NewsletterSubscriber } from '../../db.js';
import { requireAdmin } from '../../auth.js';

const router = Router();

const hasConfiguredValue = (key) => {
  const value = String(process.env[key] || '').trim();
  return Boolean(value) && !/replace-with|change-me|your-|example\.com/i.test(value);
};

// GET /api/admin/readiness
router.get('/readiness', requireAdmin, async (_req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = process.env.API_PUBLIC_URL || '';
    const frontendUrl = process.env.PAYMENT_RESULT_URL || '';

    const [bookingCount, subscriberCount] = await Promise.all([
      Booking.countDocuments(),
      NewsletterSubscriber.countDocuments(),
    ]);

    const checks = {
      database: { ready: true, detail: 'MongoDB is connected.' },
      admin: { ready: Boolean(await Admin.exists()), detail: 'Admin account is available.' },
      email: {
        ready: ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'].every(hasConfiguredValue),
        detail: 'SMTP values are present; delivery still needs an inbox check.',
      },
      payment: {
        ready: ['ESEWA_PRODUCT_CODE', 'ESEWA_SECRET_KEY'].every(hasConfiguredValue) && Boolean(apiUrl && frontendUrl),
        detail: 'eSewa credentials and callback URLs are present.',
      },
      deployment: {
        ready: !isProduction || (apiUrl.startsWith('https://') && frontendUrl.startsWith('https://') && Boolean(process.env.CLIENT_ORIGIN)),
        detail: isProduction ? 'Production URLs must use HTTPS and CLIENT_ORIGIN must be set.' : 'Local development configuration.',
      },
      security: {
        ready: hasConfiguredValue('JWT_SECRET') && process.env.JWT_SECRET.length >= 32,
        detail: 'Use a unique, non-placeholder JWT secret of at least 32 characters.',
      },
    };

    return res.json({
      checks,
      counts: { bookings: bookingCount, newsletterSubscribers: subscriberCount },
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/admin/activity
router.get('/activity', requireAdmin, async (_req, res, next) => {
  try {
    const activity = await AdminActivity.find().sort({ created_at: -1 }).limit(100).lean();
    return res.json(activity);
  } catch (error) {
    return next(error);
  }
});

export default router;
