import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Admin sign-in required.' });

  try {
    const session = jwt.verify(token, process.env.JWT_SECRET);
    if (session.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    req.admin = session;
    return next();
  } catch {
    return res.status(401).json({ message: 'Admin session expired. Please sign in again.' });
  }
}
