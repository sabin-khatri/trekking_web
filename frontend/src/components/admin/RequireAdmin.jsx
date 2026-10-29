import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminSession } from '../../services/adminAuth';

export default function RequireAdmin({ children }) {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  useEffect(() => {
    let active = true;
    getAdminSession()
      .then((session) => active && setStatus(session ? 'authorized' : 'unauthorized'))
      .catch(() => active && setStatus('unauthorized'));
    return () => { active = false; };
  }, []);

  if (status === 'loading') {
    return <div className="flex min-h-[70vh] items-center justify-center text-slate-600" role="status">Checking admin access…</div>;
  }
  if (status !== 'authorized') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
