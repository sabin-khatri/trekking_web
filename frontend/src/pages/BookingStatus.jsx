import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock3, Compass, CreditCard, Search, ShieldCheck, XCircle } from 'lucide-react';
import { trackBooking } from '../services/api';

const bookingSteps = [
  { key: 'pending', label: 'Request received', description: 'We have received your booking request.' },
  { key: 'confirmed', label: 'Booking confirmed', description: 'Your trek is confirmed by our team.' },
];

export default function BookingStatus() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [reference, setReference] = useState(location.state?.bookingReference || searchParams.get('ref') || '');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const bookingEmailDelivery = location.state?.bookingEmailDelivery;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBooking(null);
    setLoading(true);
    try {
      setBooking(await trackBooking(reference, email));
    } catch (requestError) {
      setError(requestError.message || 'Booking details could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = booking?.status === 'confirmed' ? 'Confirmed'
    : booking?.status === 'cancelled' ? 'Cancelled' : 'Awaiting review';
  const paymentLabel = booking?.payment_status === 'paid' ? 'Paid in full'
    : booking?.payment_status === 'partially_paid' ? 'Deposit received'
      : booking?.payment_status === 'pending' ? 'Payment processing'
        : booking?.payment_status === 'failed' ? 'Payment failed' : 'Not paid yet';

  return (
    <section className="relative flex-1 overflow-hidden bg-[#f7f8f5] px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
      <div className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-72 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-900 text-amber-300 shadow-lg shadow-emerald-950/15"><Compass size={26} /></span>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">Your adventure starts here</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Track your booking</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">Use the reference from your booking submission and the email address you entered to see the latest status.</p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          {bookingEmailDelivery && <p role="status" className={`lg:col-span-2 rounded-2xl border p-4 text-sm ${bookingEmailDelivery === 'sent' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            {bookingEmailDelivery === 'sent'
              ? 'We sent a booking confirmation email. If it is not in your inbox, check your spam folder.'
              : bookingEmailDelivery === 'failed'
                ? 'Your booking is saved, but the confirmation email failed to send. Save the booking reference shown below.'
                : 'Your booking is saved, but email notifications are not configured. Save the booking reference shown below.'}
          </p>}
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            <div className="mb-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Search size={19} /></span><div><h2 className="font-semibold text-slate-900">Find your booking</h2><p className="text-sm text-slate-500">Both details are required for privacy.</p></div></div>
            <label htmlFor="booking-reference" className="mb-2 block text-sm font-semibold text-slate-700">Booking reference</label>
            <input id="booking-reference" required minLength={18} maxLength={18} value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} placeholder="18-character reference" autoComplete="off" className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-mono text-sm tracking-wider text-slate-900 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-800/10" />
            <label htmlFor="booking-email" className="mb-2 block text-sm font-semibold text-slate-700">Booking email</label>
            <input id="booking-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-800/10" />
            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
            <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-65">{loading ? 'Checking booking…' : 'Check booking status'} {!loading && <ArrowRight size={17} />}</button>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-700" />Your email is only used to match your booking and is not shown on this page.</p>
          </motion.form>

          <motion.div layout className="min-h-80 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            {!booking ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-700"><Clock3 size={25} /></span>
                <h2 className="mt-5 text-lg font-semibold text-slate-900">Booking updates, all in one place</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">After checking, you can see confirmation and payment progress here whenever you need it.</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Booking reference</p><p className="mt-1 font-mono text-lg font-bold tracking-wider text-emerald-950">{booking.booking_reference}</p></div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-900' : booking.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`}>{statusLabel}</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-900">{booking.trek_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{new Date(`${booking.start_date}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} <span className="px-1.5">·</span> {booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}</p>

                {booking.status === 'cancelled' ? (
                  <div className="mt-7 flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-rose-900"><XCircle size={20} className="mt-0.5 shrink-0" /><div><p className="font-semibold">This booking was cancelled</p><p className="mt-1 text-sm leading-5">Contact our team if you need help or believe this is a mistake.</p></div></div>
                ) : (
                  <div className="mt-7 space-y-5">
                    {bookingSteps.map((step, index) => {
                      const complete = booking.status === 'confirmed' || index === 0;
                      return <div key={step.key} className="flex gap-3"><span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${complete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>{complete ? <CheckCircle2 size={17} /> : <Clock3 size={16} />}</span><div><p className={`text-sm font-semibold ${complete ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{booking.status === 'pending' && index === 1 ? 'Our team is reviewing your request.' : step.description}</p></div></div>;
                    })}
                  </div>
                )}

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Booking total</p><p className="mt-1 font-semibold text-slate-900">Rs. {Number(booking.grand_total).toLocaleString()}</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="flex items-center gap-1.5 text-xs text-slate-500"><CreditCard size={13} /> Payment</p><p className="mt-1 font-semibold text-slate-900">{paymentLabel}</p>{booking.paid_amount > 0 && <p className="mt-1 text-xs text-slate-500">Rs. {Number(booking.paid_amount).toLocaleString()} received</p>}</div>
                </div>
                <p className="mt-5 text-xs leading-5 text-slate-500">Payment instructions are shared after the team confirms your booking. If you need assistance, <Link to="/contact" className="font-semibold text-emerald-800 underline underline-offset-2">contact us</Link>.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
