import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Admin, AdminActivity, Booking, connectDatabase, NewsletterSubscriber } from './db.js';
import { openApiSpec } from './openapi.js';
import { sendAdminBookingAlert, sendAdminWeeklyReport } from './notifications.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInputs } from './middleware/sanitize.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/auth.js';
import packageRoutes from './routes/packages.js';
import bookingRoutes from './routes/bookings.js';
import customerRoutes from './routes/customers.js';
import newsletterRoutes from './routes/newsletter.js';
import contactRoutes from './routes/contact.js';
import reviewRoutes from './routes/reviews.js';
import paymentRoutes from './routes/payments.js';
import adminBookingRoutes from './routes/admin/bookings.js';
import adminPackageRoutes from './routes/admin/packages.js';
import adminSettingsRoutes from './routes/admin/settings.js';
import adminSystemRoutes from './routes/admin/system.js';
import adminNewsletterRoutes from './routes/admin/newsletter.js';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured.');

const app = express();
const port = Number(process.env.PORT || 3001);

// ── Core middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map((o) => o.trim()) }));
app.use(express.json({ limit: '20kb' }));
app.use(sanitizeInputs);
app.use(generalLimiter);

// ── API Docs ───────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.get('/api-docs.json', (_req, res) => res.json(openApiSpec));

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Public Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// ── Admin Routes ───────────────────────────────────────────────────────────────
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/packages', adminPackageRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/admin', adminSystemRoutes);
app.use('/api/admin/newsletter', adminNewsletterRoutes);

// Admin reviews (mounted on /api to allow both /api/reviews/admin paths)
app.use('/api/reviews', reviewRoutes);

// ── Error handler ──────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Database + Server ──────────────────────────────────────────────────────────
await connectDatabase();

// Pending booking reminder — runs every 15 minutes
const pendingReminderTimer = setInterval(async () => {
  const configured = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  if (!configured || ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'].some((key) => !process.env[key])) return;

  const { AdminActivity } = await import('./db.js');
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const pending = await Booking.find({ status: 'pending', created_at: { $lte: cutoff }, admin_reminder_sent_at: null }).limit(50);

  for (const booking of pending) {
    try {
      const result = await sendAdminBookingAlert(booking, { reminder: true });
      if (result.status === 'sent') {
        booking.admin_reminder_sent_at = new Date();
        await booking.save();
        await AdminActivity.create({ action: 'notification.pending_reminder', booking_reference: booking.booking_reference, booking_id: booking.id, details: 'Admin reminder email: sent' });
      }
    } catch (error) {
      console.error(`Pending booking reminder failed for ${booking.booking_reference}:`, error.message);
    }
  }
}, 15 * 60 * 1000);
pendingReminderTimer.unref();

function isoWeekKey(date) {
  const thursday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const firstDay = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((thursday - firstDay) / 86400000) + 1) / 7);
  return `${thursday.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
}

async function sendWeeklyReports() {
  const now = new Date();
  if (now.getUTCDay() !== 1 || now.getUTCHours() !== 9) return;
  const weekKey = isoWeekKey(now);
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startFilter = { created_at: { $gte: start, $lt: now } };
  const [bookings, pending, confirmed, cancelled, paid, subscribers] = await Promise.all([
    Booking.countDocuments(startFilter),
    Booking.countDocuments({ ...startFilter, status: 'pending' }),
    Booking.countDocuments({ ...startFilter, status: 'confirmed' }),
    Booking.countDocuments({ ...startFilter, status: 'cancelled' }),
    Booking.aggregate([{ $match: startFilter }, { $group: { _id: null, amount: { $sum: '$paid_amount' } } }]),
    NewsletterSubscriber.countDocuments({ subscribed_at: { $gte: start, $lt: now } }),
  ]);

  const admins = await Admin.find({ 'notification_preferences.weeklyReport': true }).select('_id email weekly_report_sent_week').lean();
  for (const admin of admins) {
    const claimed = await Admin.findOneAndUpdate(
      { _id: admin._id, 'notification_preferences.weeklyReport': true, weekly_report_sent_week: { $ne: weekKey } },
      { $set: { weekly_report_sent_week: weekKey } },
      { new: true },
    );
    if (!claimed) continue;
    try {
      const result = await sendAdminWeeklyReport(admin, {
        periodStart: start.toISOString().slice(0, 10),
        periodEnd: now.toISOString().slice(0, 10),
        bookings,
        pending,
        confirmed,
        cancelled,
        revenue: paid[0]?.amount || 0,
        subscribers,
      });
      if (result.status !== 'sent') {
        await Admin.updateOne({ _id: admin._id, weekly_report_sent_week: weekKey }, { $set: { weekly_report_sent_week: '' } });
      } else {
        await AdminActivity.create({ action: 'notification.weekly_report', details: `Weekly report sent for ${weekKey}` });
      }
    } catch (error) {
      await Admin.updateOne({ _id: admin._id, weekly_report_sent_week: weekKey }, { $set: { weekly_report_sent_week: '' } });
      console.error(`Weekly report failed for ${admin.email}:`, error.message);
    }
  }
}

const weeklyReportTimer = setInterval(() => {
  sendWeeklyReports().catch((error) => console.error('Weekly report job failed:', error.message));
}, 5 * 60 * 1000);
weeklyReportTimer.unref();

app.listen(port, () => console.log(`API server listening on port ${port}`));
