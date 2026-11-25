import { Router } from 'express';
import { TrekPackage } from '../../db.js';
import { requireAdmin } from '../../auth.js';

const router = Router();

const slugify = (value) => String(value).normalize('NFKD').toLowerCase()
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// GET /api/admin/packages
router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const packages = await TrekPackage.find().sort({ created_at: -1 });
    return res.json(packages.map((p) => p.toJSON()));
  } catch (error) {
    return next(error);
  }
});

// POST /api/admin/packages
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (name && await TrekPackage.exists({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })) {
      return res.status(409).json({ message: 'A trek package with this name already exists. Edit the existing package instead.' });
    }
    const packageRecord = await TrekPackage.create({
      ...req.body,
      slug: `${slugify(req.body.name || '')}-${Date.now().toString(36)}`,
      price: Number(req.body.price),
      maxGroupSize: Number(req.body.maxGroupSize),
    });
    return res.status(201).json(packageRecord);
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/admin/packages/:id
router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const packageRecord = await TrekPackage.findById(req.params.id);
    if (!packageRecord) return res.status(404).json({ message: 'Trek package was not found.' });

    if (Object.hasOwn(req.body, 'name')) {
      const name = String(req.body.name).trim();
      const duplicate = await TrekPackage.exists({ _id: { $ne: packageRecord._id }, name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
      if (duplicate) return res.status(409).json({ message: 'A trek package with this name already exists.' });
    }

    const editableFields = ['name', 'region', 'duration', 'difficulty', 'price', 'maxGroupSize', 'status', 'description', 'image_url', 'max_altitude', 'featured', 'itinerary', 'sort_order'];
    for (const field of editableFields) {
      if (Object.hasOwn(req.body, field)) {
        packageRecord[field] = ['price', 'maxGroupSize', 'sort_order'].includes(field) ? Number(req.body[field]) : req.body[field];
      }
    }
    if (Object.hasOwn(req.body, 'name')) {
      const base = slugify(String(req.body.name));
      packageRecord.slug = `${base}-${String(packageRecord.id).slice(-5)}`;
    }
    await packageRecord.save();
    return res.json(packageRecord);
  } catch (error) {
    return next(error);
  }
});

// DELETE /api/admin/packages/:id  (soft delete)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const packageRecord = await TrekPackage.findById(req.params.id);
    if (!packageRecord) return res.status(404).json({ message: 'Trek package was not found.' });
    packageRecord.status = 'inactive';
    await packageRecord.save();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
