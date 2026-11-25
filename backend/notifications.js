import nodemailer from 'nodemailer';

const requiredMailSettings = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendAdminBookingAlert(booking, { reminder = false, event = 'new_booking' } = {}) {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  if (!recipient || requiredMailSettings.some((key) => !process.env[key])) return { status: 'not_configured' };
  const subjects = {
    new_booking: `New trek booking: ${booking.booking_reference}`,
    cancelled: `Booking cancelled: ${booking.booking_reference}`,
    payment_received: `Payment received: ${booking.booking_reference}`,
  };
  const summaries = {
    new_booking: 'A new trek booking request was received.',
    cancelled: 'A booking was cancelled.',
    payment_received: `A payment of Rs. ${Number(booking.payment_attempts?.at(-1)?.amount || 0).toLocaleString('en-IN')} was verified. Total received so far: Rs. ${Number(booking.paid_amount || 0).toLocaleString('en-IN')}.`,
  };
  const subject = reminder
    ? `Pending booking reminder: ${booking.booking_reference}`
    : subjects[event] || subjects.new_booking;
  const text = `${reminder ? 'This booking is still awaiting review.' : summaries[event] || summaries.new_booking}\n\nReference: ${booking.booking_reference}\nCustomer: ${booking.customer_name}\nEmail: ${booking.customer_email}\nPhone: ${booking.customer_phone}\nTrek: ${booking.trek_name}\nStart date: ${booking.start_date}\nTravelers: ${booking.travelers}\nQuoted total: Rs. ${Number(booking.grand_total).toLocaleString('en-IN')}\n\nOpen the admin dashboard for details.`;
  await createTransport().sendMail({ from: process.env.SMTP_FROM, to: recipient, subject, text });
  return { status: 'sent' };
}

export async function sendAdminWeeklyReport(admin, summary) {
  if (requiredMailSettings.some((key) => !process.env[key])) return { status: 'not_configured' };
  const lines = [
    `Apex Himalaya Treks weekly report`,
    `Period: ${summary.periodStart} to ${summary.periodEnd}`,
    `New bookings: ${summary.bookings}`,
    `Pending bookings: ${summary.pending}`,
    `Confirmed bookings: ${summary.confirmed}`,
    `Cancelled bookings: ${summary.cancelled}`,
    `Revenue received: Rs. ${Number(summary.revenue).toLocaleString('en-IN')}`,
    `New newsletter subscribers: ${summary.subscribers}`,
    '',
    'Sign in to the admin dashboard to review details.',
  ];
  await createTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: admin.email,
    subject: `Apex Himalaya weekly report — ${summary.periodEnd}`,
    text: lines.join('\n'),
  });
  return { status: 'sent' };
}

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

function customerActionUrl(path, token) {
  const origin = process.env.CLIENT_PUBLIC_URL || process.env.CLIENT_ORIGIN?.split(',')[0]?.trim() || 'http://localhost:5173';
  const url = new URL(path, origin);
  url.searchParams.set('token', token);
  return url.toString();
}

export async function sendCustomerVerificationEmail(customer, token) {
  if (requiredMailSettings.some((key) => !process.env[key])) return { status: 'not_configured' };
  const link = customerActionUrl('/verify-email', token);
  await createTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: customer.email,
    subject: 'Verify your Apex Himalaya Treks account',
    text: `Hello ${customer.full_name},\n\nVerify your email and attach matching guest bookings to your account using this link (expires in 24 hours):\n${link}\n\nIf you did not create this account, you can ignore this message.`,
    html: `<p>Hello ${escapeHtml(customer.full_name)},</p><p>Verify your email and attach matching guest bookings to your account.</p><p><a href="${escapeHtml(link)}">Verify email address</a></p><p>This link expires in 24 hours. If you did not create this account, ignore this message.</p>`,
  });
  return { status: 'sent' };
}

export async function sendCustomerPasswordResetEmail(customer, token) {
  if (requiredMailSettings.some((key) => !process.env[key])) return { status: 'not_configured' };
  const link = customerActionUrl('/reset-password', token);
  await createTransport().sendMail({
    from: process.env.SMTP_FROM,
    to: customer.email,
    subject: 'Reset your Apex Himalaya Treks password',
    text: `Hello ${customer.full_name},\n\nReset your password using this link (expires in 30 minutes):\n${link}\n\nIf you did not request this, ignore this message.`,
    html: `<p>Hello ${escapeHtml(customer.full_name)},</p><p><a href="${escapeHtml(link)}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request a reset, ignore this message.</p>`,
  });
  return { status: 'sent' };
}

export async function sendBookingStatusEmail(booking, { paymentUrl = '', paymentAmount, paymentOptions = [] } = {}) {
  if (requiredMailSettings.some((key) => !process.env[key])) return { status: 'not_configured' };

  const isConfirmed = booking.status === 'confirmed';
  const statusLabel = isConfirmed ? 'confirmed' : 'cancelled';
  const amount = `Rs. ${Number(booking.grand_total).toLocaleString('en-IN')}`;
  const options = paymentOptions.length ? paymentOptions : paymentUrl ? [{
    label: booking.paid_amount > 0 ? 'Pay remaining balance' : `Pay ${booking.payment_method}`,
    amount: paymentAmount ?? (booking.payment_method === 'deposit' ? booking.deposit_amount : booking.grand_total),
    url: paymentUrl,
  }] : [];
  const paymentText = options.length
    ? `Choose a payment option below. Each secure eSewa link expires after 24 hours:\n${options.map((option) => `${option.label} (Rs. ${Number(option.amount).toLocaleString('en-IN')}): ${option.url}`).join('\n')}\n\n`
    : 'Payment has not been processed. Our team will send payment instructions when online payment is available.\n\n';
  const paymentHtml = options.length
    ? `<p>Choose how you would like to pay. These secure eSewa links expire after 24 hours:</p>${options.map((option) => `<p><a href="${escapeHtml(option.url)}">${escapeHtml(option.label)} — Rs. ${escapeHtml(Number(option.amount).toLocaleString('en-IN'))}</a></p>`).join('')}`
    : '<p>Payment has not been processed. Our team will send payment instructions when online payment is available.</p>';

  const text = isConfirmed
    ? `Hello ${booking.customer_name},\n\nYour ${booking.trek_name} booking request has been confirmed.\nStart date: ${booking.start_date}\nTravelers: ${booking.travelers}\nQuoted total: ${amount}\n\n${paymentText}Apex Himalaya Treks`
    : `Hello ${booking.customer_name},\n\nYour ${booking.trek_name} booking request for ${booking.start_date} has been cancelled. Please contact Apex Himalaya Treks if you need help.\n\nApex Himalaya Treks`;
  const html = isConfirmed
    ? `<p>Hello ${escapeHtml(booking.customer_name)},</p><p>Your <strong>${escapeHtml(booking.trek_name)}</strong> booking request has been confirmed.</p><ul><li>Start date: ${escapeHtml(booking.start_date)}</li><li>Travelers: ${escapeHtml(booking.travelers)}</li><li>Quoted total: ${escapeHtml(amount)}</li></ul>${paymentHtml}<p>Apex Himalaya Treks</p>`
    : `<p>Hello ${escapeHtml(booking.customer_name)},</p><p>Your <strong>${escapeHtml(booking.trek_name)}</strong> booking request for ${escapeHtml(booking.start_date)} has been cancelled.</p><p>Please contact Apex Himalaya Treks if you need help.</p>`;

  await createTransport().sendMail({ from: process.env.SMTP_FROM, to: booking.customer_email, subject: `Your ${booking.trek_name} booking is ${statusLabel}`, text, html });
  return { status: 'sent' };
}
