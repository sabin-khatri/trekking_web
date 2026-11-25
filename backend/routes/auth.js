import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../db.js';
import { requireAdmin } from '../auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    );
    return res.json({
      access_token: token,
      expires_in: 28800,
      user: { id: admin.id, name: admin.full_name, email: admin.email, role: 'admin' },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAdmin, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.sub).select('full_name email');
    if (!admin) return res.status(401).json({ message: 'Admin account was not found.' });
    return res.json({ id: admin.id, name: admin.full_name, email: admin.email, role: 'admin' });
  } catch (error) {
    return next(error);
  }
});

export default router;
