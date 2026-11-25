import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { Booking } from './db.js';

const SANDBOX_PAYMENT_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const LIVE_PAYMENT_URL = 'https://epay.esewa.com.np/api/epay/main/v2/form';
const SANDBOX_STATUS_URL = 'https://rc.esewa.com.np/api/epay/transaction/status/';
const LIVE_STATUS_URL = 'https://esewa.com.np/api/epay/transaction/status/';
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

const isLive = () => process.env.ESEWA_ENV === 'production';
const productCode = () => process.env.ESEWA_PRODUCT_CODE || (isLive() ? '' : 'EPAYTEST');
const secretKey = () => process.env.ESEWA_SECRET_KEY;
const apiPublicUrl = () => process.env.API_PUBLIC_URL?.replace(/\/$/, '');
const paymentUrl = () => process.env.ESEWA_PAYMENT_URL || (isLive() ? LIVE_PAYMENT_URL : SANDBOX_PAYMENT_URL);
const statusUrl = () => process.env.ESEWA_STATUS_URL || (isLive() ? LIVE_STATUS_URL : SANDBOX_STATUS_URL);

export const isEsewaConfigured = () => Boolean(productCode() && secretKey() && apiPublicUrl());

const hashToken = (token) => createHash('sha256').update(token).digest('hex');
const sign = (message) => createHmac('sha256', secretKey()).update(message).digest('base64');
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

export async function createEsewaPaymentLink(booking, { paymentMethod = booking.payment_method || 'deposit', keepExistingPending = false } = {}) {
  if (!isEsewaConfigured()) return { status: 'not_configured' };
  const amount = booking.paid_amount > 0
    ? booking.grand_total - booking.paid_amount
    : paymentMethod === 'deposit' ? booking.deposit_amount : booking.grand_total;
  if (!Number.isInteger(amount) || amount < 10) return { status: 'invalid_amount' };

  const token = randomBytes(32).toString('base64url');
  const transactionUuid = `${Date.now()}-${randomBytes(5).toString('hex')}`;
  if (!keepExistingPending) booking.payment_attempts.forEach((attempt) => {
    if (attempt.status === 'pending') attempt.status = 'failed';
  });
  booking.payment_attempts.push({
    provider: 'esewa',
    transaction_uuid: transactionUuid,
    token_hash: hashToken(token),
    amount,
    payment_method: paymentMethod,
    status: 'pending',
  });
  booking.payment_status = 'pending';
  await booking.save();

  return {
    status: 'ready',
    url: `${apiPublicUrl()}/api/payments/esewa/checkout/${token}`,
    amount,
  };
}

export async function renderEsewaCheckout(token) {
  if (!isEsewaConfigured()) return { status: 503, html: '<h1>eSewa payments are not configured.</h1>' };
  const tokenHash = hashToken(token);
  const booking = await Booking.findOne({ 'payment_attempts.token_hash': tokenHash });
  const attempt = booking?.payment_attempts.find((item) => item.token_hash === tokenHash);
  if (!booking || booking.status !== 'confirmed' || !attempt || attempt.status !== 'pending'
    || Date.now() - attempt.created_at.getTime() > TOKEN_LIFETIME_MS) {
    return { status: 404, html: '<h1>This payment link is invalid or has expired.</h1>' };
  }

  const totalAmount = attempt.amount;
  const transactionUuid = attempt.transaction_uuid;
  const code = productCode();
  const signedFieldNames = 'total_amount,transaction_uuid,product_code';
  const signature = sign(`total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${code}`);
  const formFields = {
    amount: totalAmount,
    tax_amount: 0,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: code,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `${apiPublicUrl()}/api/payments/esewa/success`,
    failure_url: `${apiPublicUrl()}/api/payments/esewa/failure?transaction_uuid=${encodeURIComponent(transactionUuid)}`,
    signed_field_names: signedFieldNames,
    signature,
  };
  const inputs = Object.entries(formFields)
    .map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}">`)
    .join('');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Redirecting to eSewa</title><body><p>Redirecting you securely to eSewa…</p><form id="payment" method="POST" action="${escapeHtml(paymentUrl())}">${inputs}<noscript><button type="submit">Continue to eSewa</button></noscript></form><script>document.getElementById('payment').submit()</script></body></html>`;
  return { status: 200, html };
}

function parseCallback(data) {
  try {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function validCallbackSignature(data) {
  if (!data.signed_field_names || !data.signature) return false;
  const fields = data.signed_field_names.split(',');
  if (!['status', 'total_amount', 'transaction_uuid', 'product_code'].every((field) => fields.includes(field))) return false;
  const message = fields.map((field) => `${field}=${data[field]}`).join(',');
  const expected = Buffer.from(sign(message), 'base64');
  const received = Buffer.from(data.signature, 'base64');
  return expected.length === received.length && timingSafeEqual(expected, received);
}

const amountsMatch = (left, right) => Number(String(left).replaceAll(',', '')) === Number(right);

export async function verifyEsewaSuccess(encodedData) {
  if (!isEsewaConfigured()) return { status: 'not_configured' };
  const data = parseCallback(encodedData || '');
  if (!data || data.status !== 'COMPLETE' || data.product_code !== productCode() || !validCallbackSignature(data)) {
    return { status: 'invalid' };
  }

  const booking = await Booking.findOne({ 'payment_attempts.transaction_uuid': data.transaction_uuid });
  const attempt = booking?.payment_attempts.find((item) => item.transaction_uuid === data.transaction_uuid);
  if (!booking || booking.status !== 'confirmed' || !attempt || !amountsMatch(data.total_amount, attempt.amount)) return { status: 'not_found' };
  if (attempt.status === 'complete') return { status: 'paid', bookingId: booking.id, bookingReference: booking.booking_reference, already_processed: true };

  const lookup = new URL(statusUrl());
  lookup.searchParams.set('product_code', productCode());
  lookup.searchParams.set('total_amount', String(attempt.amount));
  lookup.searchParams.set('transaction_uuid', attempt.transaction_uuid);
  const response = await fetch(lookup, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) return { status: 'verification_pending' };
  const result = await response.json();
  if (result.status !== 'COMPLETE'
    || result.transaction_uuid !== attempt.transaction_uuid
    || result.product_code !== productCode()
    || !amountsMatch(result.total_amount, attempt.amount)) {
    return { status: 'verification_pending' };
  }

  const referenceId = String(result.ref_id || data.transaction_code || '');
  const paidAmount = Number(booking.paid_amount || 0) + attempt.amount;
  const update = await Booking.updateOne({
    _id: booking._id,
    payment_attempts: { $elemMatch: { transaction_uuid: attempt.transaction_uuid, status: 'pending' } },
  }, {
    $set: {
      'payment_attempts.$[selected].status': 'complete',
      'payment_attempts.$[selected].reference_id': referenceId,
      'payment_attempts.$[selected].completed_at': new Date(),
      'payment_attempts.$[other].status': 'failed',
      payment_status: paidAmount >= booking.grand_total ? 'paid' : 'partially_paid',
      payment_reference_id: referenceId,
      payment_method: attempt.payment_method || 'deposit',
    },
    $inc: { paid_amount: attempt.amount },
  }, { arrayFilters: [
    { 'selected.transaction_uuid': attempt.transaction_uuid, 'selected.status': 'pending' },
    { 'other.status': 'pending', 'other.transaction_uuid': { $ne: attempt.transaction_uuid } },
  ] });
  if (!update.modifiedCount) {
    const latest = await Booking.findById(booking._id).lean();
    const latestAttempt = latest?.payment_attempts?.find((item) => item.transaction_uuid === attempt.transaction_uuid);
    if (latestAttempt?.status === 'complete') return { status: 'paid', bookingId: booking.id, bookingReference: booking.booking_reference, already_processed: true };
    return { status: 'invalid' };
  }
  return { status: 'paid', bookingId: booking.id, bookingReference: booking.booking_reference };
}

export async function markEsewaFailure(transactionUuid) {
  if (!transactionUuid) return '';
  const booking = await Booking.findOne({ 'payment_attempts.transaction_uuid': transactionUuid });
  const attempt = booking?.payment_attempts.find((item) => item.transaction_uuid === transactionUuid);
  if (!booking || !attempt || attempt.status !== 'pending') return booking?.booking_reference || '';
  attempt.status = 'failed';
  const anotherPending = booking.payment_attempts.some((item) => item.status === 'pending');
  booking.payment_status = anotherPending ? 'pending' : booking.paid_amount > 0 ? 'partially_paid' : 'failed';
  await booking.save();
  return booking.booking_reference;
}

export function paymentResultUrl(status, bookingReference) {
  const fallbackOrigin = process.env.CLIENT_ORIGIN?.split(',')[0]?.trim() || 'http://localhost:5173';
  const url = new URL(process.env.PAYMENT_RESULT_URL || `${fallbackOrigin}/payment-result`);
  url.searchParams.set('status', status);
  if (bookingReference) url.searchParams.set('ref', bookingReference);
  return url.toString();
}
