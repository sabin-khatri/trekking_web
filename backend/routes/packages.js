import { Router } from 'express';
import { TrekPackage } from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const packages = await TrekPackage.find({ status: 'active' }).sort({ sort_order: 1, created_at: 1, name: 1 });
    return res.json(packages.map((p) => p.toJSON()));
  } catch (error) {
    return next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const packageRecord = await TrekPackage.findOne({
      slug: String(req.params.slug).toLowerCase(),
      status: 'active',
    });
    if (!packageRecord) return res.status(404).json({ message: 'Trek package was not found.' });
    return res.json(packageRecord.toJSON());
  } catch (error) {
    return next(error);
  }
});

export default router;
