import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../../db.js';
import { requireAdmin } from '../../auth.js';

const router = Router();

// GET /api/admin/settings
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.sub).select('full_name email notification_preferences');
    if (!admin) return res.status(404).json({ message: 'Admin account was not found.' });
    return res.json({ name: admin.full_name, email: admin.email, notifications: admin.notification_preferences });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/admin/settings/profile
router.patch('/profile', requireAdmin, async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const notifications = req.body.notifications;

    if (name.length < 2 || name.length > 120) return res.status(400).json({ message: 'Name must be between 2 and 120 characters.' });
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 320) return res.status(400).json({ message: 'Enter a valid email address.' });

    const preferenceKeys = ['newBooking', 'cancellation', 'paymentReceived', 'weeklyReport'];
    if (!notifications || typeof notifications !== 'object'
      || preferenceKeys.some((key) => typeof notifications[key] !== 'boolean')) {
      return res.status(400).json({ message: 'Notification preferences are invalid.' });
    }
    const duplicate = await Admin.exists({ email, _id: { $ne: req.admin.sub } });
    if (duplicate) return res.status(409).json({ message: 'This email is already used by another admin account.' });

    const admin = await Admin.findById(req.admin.sub);
    if (!admin) return res.status(404).json({ message: 'Admin account was not found.' });
    admin.full_name = name;
    admin.email = email;
    admin.notification_preferences = notifications;
    await admin.save();
    return res.json({ name: admin.full_name, email: admin.email, notifications: admin.notification_preferences });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/admin/settings/password
router.patch('/password', requireAdmin, async (req, res, next) => {
  try {
    const currentPassword = String(req.body.current_password || '');
    const newPassword = String(req.body.new_password || '');
    if (newPassword.length < 12 || newPassword.length > 128) {
      return res.status(400).json({ message: 'New password must be between 12 and 128 characters.' });
    }
    const admin = await Admin.findById(req.admin.sub);
    if (!admin) return res.status(404).json({ message: 'Admin account was not found.' });
    if (!(await bcrypt.compare(currentPassword, admin.password_hash))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    admin.password_hash = await bcrypt.hash(newPassword, 12);
    await admin.save();
    return res.json({ success: true, message: 'Password updated. Use the new password next time you sign in.' });
  } catch (error) {
    return next(error);
  }
});

export default router;
