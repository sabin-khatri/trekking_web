import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { verifyCustomerEmail } from '../services/customerAuth';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [message, setMessage] = useState(token ? 'Verifying your email…' : 'This verification link is missing its token.');
  const [failed, setFailed] = useState(!token);
  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    let redirectTimer;
    verifyCustomerEmail(token).then(() => {
      if (!active) return;
      setMessage('Email verified. Your matching guest bookings are now linked to your account.');
      redirectTimer = setTimeout(() => navigate('/account', { replace: true }), 1200);
    }).catch((error) => {
      if (active) { setFailed(true); setMessage(error.message || 'This verification link is invalid or expired.'); }
    });
    return () => { active = false; clearTimeout(redirectTimer); };
  }, [navigate, token]);
  return <main className="flex min-h-screen items-center justify-center bg-[#f4efe3] px-4 py-28"><SEO title="Verify Email | Apex Himalaya Treks" /><section className="w-full max-w-lg rounded-3xl bg-[#eae1cb] p-8 text-center shadow-xl"><h1 className="font-display text-3xl italic text-slate-900">Email verification</h1><p role={failed ? 'alert' : 'status'} className="mt-4 text-slate-700">{message}</p>{failed && <Link to="/customer-login" className="mt-6 inline-flex rounded-xl bg-emerald-950 px-5 py-3 font-semibold text-white">Go to sign in</Link>}</section></main>;
}
