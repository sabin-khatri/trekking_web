import { Router } from 'express';
import { Review, TrekPackage } from '../db.js';
import { requireAdmin } from '../auth.js';
import { reviewLimiter } from '../middleware/rateLimiter.js';
import { cleanString } from '../middleware/sanitize.js';

const router = Router();

// GET /api/reviews — public, paginated, approved reviews only
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 6));
    const skip = (page - 1) * limit;
    const trek = String(req.query.trek || '').trim().toLowerCase();

    const filter = { status: 'approved' };
    if (trek) filter.trek_slug = trek;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .select('-submitter_ip -reviewer_email')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return res.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
});

// POST /api/reviews — public, rate limited
router.post('/', reviewLimiter, async (req, res, next) => {
  try {
    const reviewer_name = cleanString(req.body?.reviewer_name || '', 80);
    const trek_name = cleanString(req.body?.trek_name || '', 160);
    const trek_slug = String(req.body?.trek_slug || '').trim().toLowerCase().slice(0, 80);
    const rating = Number(req.body?.rating);
    const comment = cleanString(req.body?.comment || '', 1000);
    const reviewer_email = String(req.body?.reviewer_email || '').trim().toLowerCase();

    if (reviewer_name.length < 2) return res.status(400).json({ message: 'Please enter your name.' });
    if (!trek_name) return res.status(400).json({ message: 'Please select a trek.' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    if (comment.length < 10) return res.status(400).json({ message: 'Please write a comment (at least 10 characters).' });
    if (reviewer_email && !/^\S+@\S+\.\S+$/.test(reviewer_email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Verify trek exists
    const trekExists = await TrekPackage.exists({ name: new RegExp(`^${trek_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'), status: 'active' });
    if (!trekExists) return res.status(400).json({ message: 'Selected trek was not found.' });

    const review = await Review.create({
      trek_name,
      trek_slug,
      reviewer_name,
      reviewer_email: reviewer_email || '',
      rating,
      comment,
      submitter_ip: req.ip || '',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      id: review.id,
      message: 'Thank you for your review! It will be published after a quick check.',
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/admin/reviews — admin only
router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (['pending', 'approved', 'rejected'].includes(status)) filter.status = status;

    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
    ]);

    return res.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/admin/reviews/:id — approve or reject
router.patch('/admin/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved, rejected, or pending.' });
    }
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/admin/:id', requireAdmin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
