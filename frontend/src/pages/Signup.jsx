import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { registerCustomer, resendCustomerVerification } from '../services/customerAuth';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [notice, setNotice] = useState('');

  const update = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 12) return setError('Password must be at least 12 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    setSubmitting(true);
    try {
      const result = await registerCustomer(form.name, form.email, form.password);
      setCreated(true);
      setNotice(result.email_delivery === 'sent'
        ? result.message
        : result.email_delivery === 'failed'
          ? 'Your account was created, but the verification email failed to send. Check the address or try resending after the site administrator checks email delivery.'
          : 'Your account was created, but email delivery is not configured yet. Ask the site administrator to configure SMTP, then request a new verification email.');
    } catch (requestError) {
      setError(requestError.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    setNotice('');
    try {
      const result = await resendCustomerVerification(form.email);
      setNotice(result.email_delivery === 'sent'
        ? result.message
        : 'We could not send the verification email. Check the email address or contact the site administrator.');
    }
    catch (requestError) { setError(requestError.message || 'Could not resend verification email.'); }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4efe3] px-4 py-28">
      <SEO title="Create an Account | Apex Himalaya Treks" />
      <section className="w-full max-w-lg rounded-3xl border border-[#4b635033] bg-[#eae1cb] p-6 shadow-xl sm:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-900">Apex Himalaya Treks</p>
        <h1 className="mt-2 text-center font-display text-3xl italic text-slate-900">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-600">Save your bookings and check their status in one place.</p>
        {error && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {created ? <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950"><p>{notice}</p><p className="mt-2">After the email arrives, open its link to verify your address and sign in.</p><button onClick={resend} className="mt-4 font-semibold underline">Resend verification email</button><button onClick={() => navigate('/customer-login')} className="ml-4 font-semibold underline">Go to sign in</button></div> : <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Full name<input name="name" value={form.name} onChange={update} minLength={2} maxLength={120} autoComplete="name" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-800/10" /></label>
          <label className="block text-sm font-semibold text-slate-700">Email<input name="email" type="email" value={form.email} onChange={update} maxLength={320} autoComplete="email" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-800/10" /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input name="password" type="password" value={form.password} onChange={update} minLength={12} maxLength={128} autoComplete="new-password" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-800/10" /><span className="mt-1 block text-xs font-normal text-slate-500">Use at least 12 characters.</span></label>
          <label className="block text-sm font-semibold text-slate-700">Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} minLength={12} maxLength={128} autoComplete="new-password" required className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-800/10" /></label>
          <button disabled={submitting} className="w-full rounded-xl bg-emerald-950 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">{submitting ? 'Creating account…' : 'Create account'}</button>
        </form>}
        <p className="mt-6 text-center text-sm text-slate-600">Already registered? <Link to="/customer-login" className="font-semibold text-emerald-900 underline underline-offset-2">Sign in</Link></p>
      </section>
    </main>
  );
}
