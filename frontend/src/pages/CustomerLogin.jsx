import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { resendCustomerVerification, signInCustomer } from '../services/customerAuth';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInCustomer(email, password);
      navigate(location.state?.from?.pathname || '/account', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not sign in.');
      setNotice(requestError.code === 'EMAIL_NOT_VERIFIED' ? 'Your account email is not verified yet.' : '');
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    setError('');
    try { const result = await resendCustomerVerification(email); setNotice(result.message); }
    catch (requestError) { setError(requestError.message || 'Could not resend verification email.'); }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4efe3] px-4 py-28">
      <SEO title="Customer Sign In | Apex Himalaya Treks" />
      <section className="w-full max-w-md rounded-3xl border border-[#4b635033] bg-[#eae1cb] p-6 shadow-xl sm:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-900">Customer Account</p>
        <h1 className="mt-2 text-center font-display text-3xl italic text-slate-900">Welcome back</h1>
        {error && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <div role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{notice}{notice.includes('not verified') && <button onClick={resendVerification} className="ml-2 font-semibold underline">Resend email</button>}</div>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-800/10" /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-800/10" /></label>
          <p className="-mt-2 text-right text-sm"><Link to="/forgot-password" className="font-semibold text-emerald-900 underline">Forgot password?</Link></p>
          <button disabled={submitting} className="w-full rounded-xl bg-emerald-950 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">New to Apex? <Link to="/signup" className="font-semibold text-emerald-900 underline underline-offset-2">Create an account</Link></p>
        <p className="mt-3 text-center text-xs text-slate-500">Company admin? <Link to="/login" className="underline underline-offset-2">Admin sign in</Link></p>
      </section>
    </main>
  );
}
