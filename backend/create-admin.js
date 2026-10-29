import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.');
}

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `insert into admin_users (email, password_hash) values ($1, $2)
     on conflict (email) do update set password_hash = excluded.password_hash`,
    [email, passwordHash],
  );
  console.log(`Admin account ready for ${email}`);
} finally {
  await pool.end();
}
