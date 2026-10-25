import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession } from '../../services/adminAuth';
import { isSupabaseConfigured } from '../../services/supabase';

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured');
  const location = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    getAdminSession()
      .then((session) => active && setStatus(session ? 'authorized' : 'unauthorized'))
      .catch(() => active && setStatus('unauthorized'));
    return () => { active = false; };
  }, []);

  if (status === 'loading') {
    return <div className="flex min-h-[70vh] items-center justify-center text-slate-600" role="status">Checking admin access…</div>;
  }
  if (status === 'unconfigured') {
    return (
      <div className="mx-auto my-24 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        Admin access is unavailable until Supabase is configured. Add the required Vite environment variables and reload.
      </div>
    );
  }
  if (status !== 'authorized') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
