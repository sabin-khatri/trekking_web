import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { requestCustomerPasswordReset } from '../services/customerAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setBusy(true); setError(''); setMessage(''); try { const result = await requestCustomerPasswordReset(email); setMessage(result.message); } catch (requestError) { setError(requestError.message || 'Could not request a password reset.'); } finally { setBusy(false); } };
  return <main className="flex min-h-screen items-center justify-center bg-[#f4efe3] px-4 py-28"><SEO title="Forgot Password | Apex Himalaya Treks" /><section className="w-full max-w-md rounded-3xl bg-[#eae1cb] p-7 shadow-xl sm:p-10"><h1 className="font-display text-center text-3xl italic text-slate-900">Reset your password</h1><p className="mt-3 text-center text-sm text-slate-600">Enter your account email. If it is verified, we will send a reset link.</p>{message && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}{error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-slate-700">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" /></label><button disabled={busy} className="w-full rounded-xl bg-emerald-950 px-5 py-3.5 font-semibold text-white disabled:opacity-60">{busy ? 'Sending…' : 'Send reset link'}</button></form><p className="mt-5 text-center text-sm"><Link to="/customer-login" className="font-semibold text-emerald-900 underline">Back to sign in</Link></p></section></main>;
}
