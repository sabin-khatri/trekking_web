import { Router } from 'express';
import { NewsletterSubscriber } from '../db.js';
import { newsletterLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/subscribe', newsletterLimiter, async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    try {
      await NewsletterSubscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
    return res.status(200).json({ message: 'You are subscribed to trek updates.' });
  } catch (error) {
    return next(error);
  }
});

export default router;
