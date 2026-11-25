import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import { Customer, Booking } from '../db.js';
import { requireCustomer } from '../customerAuth.js';
import { customerAuthLimiter } from '../middleware/rateLimiter.js';
import { cleanString } from '../middleware/sanitize.js';
import { sendCustomerPasswordResetEmail, sendCustomerVerificationEmail } from '../notifications.js';

const router = Router();
const preparationTaskIds = new Set(['passport', 'insurance', 'fitness', 'arrival', 'gear', 'medical', 'permits', 'final-pack']);
const hashToken = (token) => createHash('sha256').update(token).digest('hex');
const normalizedEmail = (value) => String(value || '').trim().toLowerCase();

function createSession(customer) {
  const expiresIn = 60 * 60 * 24 * 7;
  const accessToken = jwt.sign({ sub: customer.id, email: customer.email, role: 'customer', token_version: customer.token_version || 0 }, process.env.JWT_SECRET, { expiresIn });
  return { access_token: accessToken, expires_in: expiresIn, user: { id: customer.id, name: customer.full_name, email: customer.email, role: 'customer' } };
}

async function issueVerification(customer) {
  const token = randomBytes(32).toString('hex');
  customer.email_verification_token_hash = hashToken(token);
  customer.email_verification_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await customer.save();
  return sendCustomerVerificationEmail(customer, token);
}

router.post('/register', customerAuthLimiter, async (req, res, next) => {
  try {
    const name = cleanString(req.body?.name || '', 120);
    const email = normalizedEmail(req.body?.email);
    const password = String(req.body?.password || '');
    if (name.length < 2) return res.status(400).json({ message: 'Name must contain at least 2 characters.' });
    if (email.length > 320 || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 12 || password.length > 128) return res.status(400).json({ message: 'Password must be between 12 and 128 characters.' });
    let customer = await Customer.findOne({ email });
    if (customer) {
      if (customer.email_verified_at) return res.status(409).json({ message: 'An account with this email already exists.' });
      const delivery = await issueVerification(customer);
      return res.status(200).json({ verification_required: true, email_delivery: delivery.status, message: 'This account still needs email verification. We sent a new verification link.' });
    }
    customer = await Customer.create({ full_name: name, email, password_hash: await bcrypt.hash(password, 12) });
    const delivery = await issueVerification(customer);
    return res.status(201).json({ verification_required: true, email_delivery: delivery.status, message: 'Account created. Check your email for the verification link.' });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    return next(error);
  }
});

router.post('/resend-verification', customerAuthLimiter, async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ email: normalizedEmail(req.body?.email) });
    if (customer && !customer.email_verified_at) await issueVerification(customer);
    return res.json({ success: true, message: 'If the account needs verification, a new email has been sent.' });
  } catch (error) { return next(error); }
});

router.post('/verify-email', customerAuthLimiter, async (req, res, next) => {
  try {
    const token = String(req.body?.token || '');
    if (!/^[a-f0-9]{64}$/i.test(token)) return res.status(400).json({ message: 'This verification link is invalid or expired.' });
    const customer = await Customer.findOne({ email_verification_token_hash: hashToken(token), email_verification_expires_at: { $gt: new Date() } });
    if (!customer) return res.status(400).json({ message: 'This verification link is invalid or expired.' });
    customer.email_verified_at = new Date();
    customer.email_verification_token_hash = '';
    customer.email_verification_expires_at = null;
    await customer.save();
    await Booking.updateMany({ customer_id: null, customer_email: customer.email }, { $set: { customer_id: customer._id } });
    return res.json(createSession(customer));
  } catch (error) { return next(error); }
});

router.post('/login', customerAuthLimiter, async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ email: normalizedEmail(req.body?.email) });
    if (!customer || !(await bcrypt.compare(String(req.body?.password || ''), customer.password_hash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    if (!customer.email_verified_at) return res.status(403).json({ code: 'EMAIL_NOT_VERIFIED', message: 'Verify your email before signing in.' });
    return res.json(createSession(customer));
  } catch (error) { return next(error); }
});

router.post('/password-reset/request', customerAuthLimiter, async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ email: normalizedEmail(req.body?.email) });
    if (customer && customer.email_verified_at) {
      const token = randomBytes(32).toString('hex');
      customer.password_reset_token_hash = hashToken(token);
      customer.password_reset_expires_at = new Date(Date.now() + 30 * 60 * 1000);
      await customer.save();
      await sendCustomerPasswordResetEmail(customer, token);
    }
    return res.json({ success: true, message: 'If a verified account exists for that email, password reset instructions have been sent.' });
  } catch (error) { return next(error); }
});

router.post('/password-reset/complete', customerAuthLimiter, async (req, res, next) => {
  try {
    const token = String(req.body?.token || '');
    const password = String(req.body?.password || '');
    if (password.length < 12 || password.length > 128) return res.status(400).json({ message: 'Password must be between 12 and 128 characters.' });
    const customer = await Customer.findOne({ password_reset_token_hash: hashToken(token), password_reset_expires_at: { $gt: new Date() } });
    if (!customer) return res.status(400).json({ message: 'This reset link is invalid or expired. Request a new one.' });
    customer.password_hash = await bcrypt.hash(password, 12);
    customer.password_reset_token_hash = '';
    customer.password_reset_expires_at = null;
    customer.token_version = (customer.token_version || 0) + 1;
    await customer.save();
    return res.json({ success: true, message: 'Password reset. You can now sign in with your new password.' });
  } catch (error) { return next(error); }
});

router.get('/me', requireCustomer, (req, res) => res.json({ id: req.customer.id, name: req.customer.full_name, email: req.customer.email, phone: req.customer.phone || '', role: 'customer', email_verified: Boolean(req.customer.email_verified_at) }));

router.patch('/profile', requireCustomer, async (req, res, next) => {
  try {
    const name = cleanString(req.body?.name || '', 120);
    const phone = cleanString(req.body?.phone || '', 40);
    if (name.length < 2) return res.status(400).json({ message: 'Name must contain at least 2 characters.' });
    if (phone && phone.length < 5) return res.status(400).json({ message: 'Enter a valid phone number.' });
    const customer = await Customer.findByIdAndUpdate(req.customer.id, { $set: { full_name: name, phone } }, { new: true }).select('_id full_name email phone email_verified_at');
    return res.json({ id: customer.id, name: customer.full_name, email: customer.email, phone: customer.phone, role: 'customer', email_verified: Boolean(customer.email_verified_at) });
  } catch (error) { return next(error); }
});

router.get('/bookings', requireCustomer, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer_id: req.customer.id }).select('booking_reference trek_name start_date travelers grand_total paid_amount payment_status status created_at prep_completed_tasks').sort({ created_at: -1 }).limit(100).lean();
    return res.json(bookings);
  } catch (error) { return next(error); }
});

router.patch('/bookings/:id/preparation', requireCustomer, async (req, res, next) => {
  try {
    const { taskId, completed } = req.body || {};
    if (!preparationTaskIds.has(taskId) || typeof completed !== 'boolean') return res.status(400).json({ message: 'Invalid preparation checklist update.' });
    const update = completed ? { $addToSet: { prep_completed_tasks: taskId } } : { $pull: { prep_completed_tasks: taskId } };
    const booking = await Booking.findOneAndUpdate({ _id: req.params.id, customer_id: req.customer.id }, update, { new: true }).select('prep_completed_tasks').lean();
    if (!booking) return res.status(404).json({ message: 'Booking was not found.' });
    return res.json({ completed_tasks: booking.prep_completed_tasks || [] });
  } catch (error) { return next(error); }
});

router.patch('/password', requireCustomer, async (req, res, next) => {
  try {
    const currentPassword = String(req.body?.current_password || '');
    const newPassword = String(req.body?.new_password || '');
    if (newPassword.length < 12 || newPassword.length > 128) return res.status(400).json({ message: 'New password must be between 12 and 128 characters.' });
    const customer = await Customer.findById(req.customer.id);
    if (!customer || !(await bcrypt.compare(currentPassword, customer.password_hash))) return res.status(401).json({ message: 'Current password is incorrect.' });
    customer.password_hash = await bcrypt.hash(newPassword, 12);
    customer.token_version = (customer.token_version || 0) + 1;
    await customer.save();
    return res.json({ success: true, message: 'Password updated successfully. Please sign in again.' });
  } catch (error) { return next(error); }
});

export default router;
