import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, CircleX } from 'lucide-react';
import SEO from '../components/common/SEO';

const resultDetails = {
  success: {
    icon: CheckCircle2,
    title: 'Payment received',
    text: 'Your payment has been confirmed. Your booking payment status has been updated. A confirmation email has been sent to you.',
    color: 'text-emerald-700',
  },
  pending: {
    icon: Clock3,
    title: 'Payment is being verified',
    text: 'Do not pay again yet. We are checking the transaction with the payment provider. Please contact us if the status does not update shortly.',
    color: 'text-amber-700',
  },
  failed: {
    icon: CircleX,
    title: 'Payment was not completed',
    text: 'No successful payment was confirmed. Contact Apex Himalaya Treks for a fresh payment link.',
    color: 'text-red-700',
  },
};

export default function PaymentResult() {
  const [params] = useSearchParams();
  const result = resultDetails[params.get('status')] || resultDetails.pending;
  const Icon = result.icon;
  const provider = params.get('provider') === 'khalti' ? 'Khalti' : 'eSewa';

  // Update text based on actual provider used
  const displayText = params.get('status') === 'success'
    ? `${provider} confirmed your payment. Your booking payment status has been updated. A confirmation email has been sent to you.`
    : params.get('status') === 'pending'
      ? `Do not pay again yet. We are checking the transaction with ${provider}. Please contact us if the status does not update shortly.`
      : result.text;

  return (
    <section className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-20">
      <SEO title={`${result.title} | Apex Himalaya`} />
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">
        <Icon size={48} className={`mx-auto ${result.color}`} />
        <h1 className="mt-5 text-2xl font-bold text-slate-900">{result.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{displayText}</p>
        {params.get('ref') && <p className="mt-4 text-xs text-slate-500">Booking reference: {params.get('ref')}</p>}
        {params.get('ref') && <Link to={`/booking-status?ref=${encodeURIComponent(params.get('ref'))}`} className="mt-4 inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Track this booking</Link>}
        <Link to="/packages" className="mt-7 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">Back to treks</Link>
      </div>
    </section>
  );
}
