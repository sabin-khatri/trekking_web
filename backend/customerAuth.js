import jwt from 'jsonwebtoken';
import { Customer } from './db.js';

export async function requireCustomer(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Customer sign-in required.' });

  try {
    const session = jwt.verify(token, process.env.JWT_SECRET);
    if (session.role !== 'customer') return res.status(403).json({ message: 'Customer access required.' });
    const customer = await Customer.findById(session.sub).select('_id full_name email phone email_verified_at token_version');
    if (!customer) return res.status(401).json({ message: 'Customer account was not found.' });
    if (!customer.email_verified_at || (session.token_version || 0) !== (customer.token_version || 0)) return res.status(401).json({ message: 'Customer session expired. Please sign in again.' });
    req.customer = customer;
    return next();
  } catch {
    return res.status(401).json({ message: 'Customer session expired. Please sign in again.' });
  }
}

export async function attachOptionalCustomer(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return next();

  try {
    const session = jwt.verify(token, process.env.JWT_SECRET);
    if (session.role !== 'customer') return res.status(403).json({ message: 'Customer access required.' });
    const customer = await Customer.findById(session.sub).select('_id full_name email phone email_verified_at token_version');
    if (!customer) return res.status(401).json({ message: 'Customer account was not found.' });
    if (!customer.email_verified_at || (session.token_version || 0) !== (customer.token_version || 0)) return res.status(401).json({ message: 'Customer session expired. Please sign in again.' });
    req.customer = customer;
    return next();
  } catch {
    return res.status(401).json({ message: 'Customer session expired. Please sign in again.' });
  }
}
