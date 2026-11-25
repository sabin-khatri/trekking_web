import { Router } from 'express';
import { NewsletterSubscriber } from '../../db.js';
import { requireAdmin } from '../../auth.js';

const router = Router();

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
    const search = String(req.query.search || '').trim().slice(0, 320);
    const filter = search ? { email: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } } : {};
    const [subscribers, total] = await Promise.all([
      NewsletterSubscriber.find(filter).sort({ subscribed_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      NewsletterSubscriber.countDocuments(filter),
    ]);
    return res.json({ subscribers, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ message: 'Newsletter subscriber was not found.' });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
