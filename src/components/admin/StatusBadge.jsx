import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  const icons = {
    confirmed: <CheckCircle2 size={14} />,
    pending: <Clock size={14} />,
    cancelled: <XCircle size={14} />
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}