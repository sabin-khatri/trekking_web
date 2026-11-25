import { Router } from 'express';
import nodemailer from 'nodemailer';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { cleanString } from '../middleware/sanitize.js';

const router = Router();

const isEmailConfigured = () =>
  ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'].every((key) => process.env[key]);

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// POST /api/contact
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const name = cleanString(req.body?.name || '', 160);
    const email = String(req.body?.email || '').trim().toLowerCase();
    const subject = cleanString(req.body?.subject || '', 200);
    const message = cleanString(req.body?.message || '', 3000);
    const phone = cleanString(req.body?.phone || '', 40);

    if (name.length < 2) return res.status(400).json({ message: 'Please enter your name.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (message.length < 10) return res.status(400).json({ message: 'Please enter a message (at least 10 characters).' });

    const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
    if (!isEmailConfigured() || !recipient) {
      return res.status(503).json({ message: 'Contact email is temporarily unavailable. Please use the phone or WhatsApp number instead.' });
    }

    if (isEmailConfigured() && recipient) {
      const emailSubject = subject || `Website inquiry from ${name}`;
      const text = [
        `New contact form message received from the Apex Himalaya Treks website.`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        `Subject: ${emailSubject}`,
        ``,
        `Message:`,
        message,
        ``,
        `---`,
        `Sent from apex himalaya website contact form`,
      ].filter((line) => line !== undefined).join('\n');

      try {
        await createTransport().sendMail({
          from: process.env.SMTP_FROM,
          to: recipient,
          replyTo: email,
          subject: `[Contact] ${emailSubject}`,
          text,
        });
      } catch (mailError) {
        console.error('Contact form email failed:', mailError.message);
        return res.status(503).json({ message: 'We could not deliver your message right now. Please use the phone or WhatsApp number instead.' });
      }
    } else {
      console.log(`[Contact Form] From: ${name} <${email}> | Subject: ${subject || '(none)'} | Message: ${message.slice(0, 100)}...`);
    }

    return res.json({ success: true, message: 'Your message has been sent. We will get back to you soon!' });
  } catch (error) {
    return next(error);
  }
});

export default router;
