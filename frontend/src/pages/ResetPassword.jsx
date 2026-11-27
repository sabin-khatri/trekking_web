import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { completeCustomerPasswordReset } from '../services/customerAuth';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setError(''); setMessage(''); if (password !== confirm) return setError('The passwords do not match.'); setBusy(true); try { const result = await completeCustomerPasswordReset(params.get('token') || '', password); setMessage(result.message); } catch (requestError) { setError(requestError.message || 'Could not reset password.'); } finally { setBusy(false); } };
  return <main className="flex min-h-screen items-center justify-center bg-[#f4efe3] px-4 py-28"><SEO title="Choose a New Password | Apex Himalaya Treks" /><section className="w-full max-w-md rounded-3xl bg-[#eae1cb] p-7 shadow-xl sm:p-10"><h1 className="font-display text-center text-3xl italic text-slate-900">Choose a new password</h1>{message && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{message}<Link to="/customer-login" className="ml-2 font-semibold underline">Sign in</Link></p>}{error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-slate-700">New password<input type="password" minLength={12} maxLength={128} autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" /></label><label className="block text-sm font-semibold text-slate-700">Confirm password<input type="password" minLength={12} maxLength={128} autoComplete="new-password" required value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" /></label><button disabled={busy || Boolean(message)} className="w-full rounded-xl bg-emerald-950 px-5 py-3.5 font-semibold text-white disabled:opacity-60">{busy ? 'Updating…' : 'Reset password'}</button></form></section></main>;
}
