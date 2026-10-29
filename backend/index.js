import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db.js';
import { requireAdmin } from './auth.js';

const app = express();
const port = Number(process.env.PORT || 3001);

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error('DATABASE_URL and JWT_SECRET must be configured.');
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()) }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const { rows } = await pool.query(
      'select id, email, password_hash from admin_users where email = $1',
      [email],
    );
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    const token = jwt.sign({ sub: admin.id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ access_token: token, expires_in: 28800, user: { id: admin.id, email: admin.email, role: 'admin' } });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/auth/me', requireAdmin, (req, res) => {
  res.json({ id: req.admin.sub, email: req.admin.email, role: req.admin.role });
});

app.post('/api/bookings', async (req, res, next) => {
  try {
    const {
      trek_name, start_date, travelers, addons = [], customer_name,
      customer_email, customer_phone, message = '', grand_total,
      payment_method, deposit_amount,
    } = req.body;
    if (!trek_name || !start_date || !customer_name || !customer_email || !customer_phone
      || !Number.isInteger(Number(travelers)) || !Array.isArray(addons)
      || !Number.isInteger(Number(grand_total)) || !Number.isInteger(Number(deposit_amount))
      || !['deposit', 'full'].includes(payment_method)) {
      return res.status(400).json({ message: 'Please provide valid booking details.' });
    }

    const { rows } = await pool.query(
      `insert into bookings
       (trek_name, start_date, travelers, addons, customer_name, customer_email, customer_phone, message, grand_total, payment_method, deposit_amount)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`,
      [trek_name, start_date, Number(travelers), addons, customer_name, customer_email, customer_phone, message, Number(grand_total), payment_method, Number(deposit_amount)],
    );
    return res.status(201).json({ success: true, id: rows[0].id });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/bookings', requireAdmin, async (_req, res, next) => {
  try {
    const { rows } = await pool.query('select * from bookings order by created_at desc');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/admin/bookings/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Unsupported booking status.' });
    }
    const { rows } = await pool.query(
      'update bookings set status = $1 where id = $2 returning *',
      [status, req.params.id],
    );
    if (!rows[0]) return res.status(404).json({ message: 'Booking request was not found.' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === '23514' || error.code === '22P02' || error.code === '22007') {
    return res.status(400).json({ message: 'Booking details are invalid.' });
  }
  return res.status(500).json({ message: 'The server could not complete the request.' });
});

app.listen(port, () => console.log(`API server listening on port ${port}`));
