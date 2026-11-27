import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, LoaderCircle, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import SEO from '../components/common/SEO';
import BookingsSection from '../components/customer/BookingsSection';
import { fetchCustomerBookings, getCustomerProfile, signOutCustomer, updateCustomerPassword, updateCustomerPreparation, updateCustomerProfile } from '../services/customerAuth';

export default function CustomerAccount() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileNotice, setProfileNotice] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordNotice, setPasswordNotice] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [bookingQuery, setBookingQuery] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('account-overview');

  const loadAccount = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [account, history] = await Promise.all([getCustomerProfile(), fetchCustomerBookings()]);
      if (!account) throw new Error('Your session expired. Please sign in again.');
      setProfile(account); setProfileForm({ name: account.name || '', phone: account.phone || '' }); setBookings(history);
    } catch (requestError) { setError(requestError.message || 'Could not load your account.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadAccount(); }, [loadAccount]);

  const visibleBookings = useMemo(() => {
    const query = bookingQuery.trim().toLowerCase();
    return bookings.filter((booking) => (bookingFilter === 'all' || booking.status === bookingFilter)
      && (!query || [booking.trek_name, booking.booking_reference, booking.start_date].some((value) => String(value || '').toLowerCase().includes(query))));
  }, [bookings, bookingFilter, bookingQuery]);
  const outstanding = bookings.filter((booking) => booking.status !== 'cancelled').reduce((sum, booking) => sum + Math.max(0, Number(booking.grand_total || 0) - Number(booking.paid_amount || 0)), 0);

  const goToSection = (sectionId, navigationKey = sectionId) => {
    setActiveSection(navigationKey);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSignOut = () => { signOutCustomer(); navigate('/', { replace: true }); };
  const handleProfileSave = async (event) => {
    event.preventDefault(); setProfileError(''); setProfileNotice(''); setSavingProfile(true);
    try { const updated = await updateCustomerProfile(profileForm.name, profileForm.phone); setProfile(updated); setProfileNotice('Profile details saved.'); }
    catch (requestError) { setProfileError(requestError.message || 'Could not save your profile.'); }
    finally { setSavingProfile(false); }
  };
  const handlePasswordChange = async (event) => {
    event.preventDefault(); setPasswordError(''); setPasswordNotice('');
    if (passwords.next.length < 12) return setPasswordError('New password must be at least 12 characters.');
    if (passwords.next !== passwords.confirm) return setPasswordError('The new passwords do not match.');
    setSavingPassword(true);
    try { const result = await updateCustomerPassword(passwords.current, passwords.next); setPasswordNotice(result.message); setPasswords({ current: '', next: '', confirm: '' }); signOutCustomer(); }
    catch (requestError) { setPasswordError(requestError.message || 'Could not update your password.'); }
    finally { setSavingPassword(false); }
  };
  const handlePreparation = async (bookingId, taskId, completed) => {
    try {
      const result = await updateCustomerPreparation(bookingId, taskId, completed);
      setBookings((current) => current.map((booking) => booking._id === bookingId ? { ...booking, prep_completed_tasks: result.completed_tasks } : booking));
    } catch (requestError) { setError(requestError.message || 'Could not update the preparation checklist.'); }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
      <SEO title="My Account | Apex Himalaya Treks" />
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Customer portal</p><h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">My account</h1>{profile && <p className="mt-2 break-words text-sm text-slate-600">{profile.name} Â· <span className="break-all">{profile.email}</span></p>}</div><div className="flex gap-2"><button onClick={loadAccount} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} />Refresh</button><button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"><LogOut size={15} />Sign out</button></div></div>
        {error && <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><span>{error}</span><button onClick={() => navigate('/customer-login', { replace: true })} className="font-semibold underline">Sign in again</button></div>}
        {loading && !profile && <div className="flex justify-center py-20 text-slate-600"><LoaderCircle className="animate-spin" /></div>}
        {!loading && profile && <>
          <div id="account-overview" className="mt-8 scroll-mt-28 grid gap-3 sm:grid-cols-3"><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total bookings</p><p className="mt-2 text-2xl font-bold text-slate-900">{bookings.length}</p></article><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confirmed trips</p><p className="mt-2 text-2xl font-bold text-emerald-800">{bookings.filter((booking) => booking.status === 'confirmed').length}</p></article><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Balance to pay*</p><p className="mt-2 text-2xl font-bold text-slate-900">Rs. {outstanding.toLocaleString()}</p><p className="mt-1 text-[11px] text-slate-500">*Based on recorded payments</p></article></div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24"><p className="hidden px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">My account</p><nav aria-label="Customer account sections" className="flex gap-1 overflow-x-auto lg:flex-col">{[['overview', 'account-overview', 'Overview'], ['payments', 'account-overview', 'Payments & balance'], ['history', 'booking-history', 'Booking history'], ['preparation', 'booking-history', 'Trip preparation'], ['profile', 'personal-details', 'Personal details'], ['security', 'account-security', 'Security']].map(([key, section, label]) => <button key={key} onClick={() => goToSection(section, key)} aria-current={activeSection === key ? 'location' : undefined} className={`shrink-0 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition lg:w-full ${activeSection === key ? 'bg-emerald-50 text-emerald-900' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</button>)}</nav></aside>
            <div className="grid min-w-0 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section id="personal-details" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:col-span-2"><h2 className="text-xl font-semibold text-slate-900">Personal details</h2><p className="mt-1 text-sm text-slate-500">Your verified email is used to match your bookings.</p><form onSubmit={handleProfileSave} className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="block text-xs font-semibold text-slate-600">Full name<input required minLength={2} maxLength={120} value={profileForm.name} onChange={(event) => setProfileForm((old) => ({ ...old, name: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm" /></label><label className="block text-xs font-semibold text-slate-600">Phone number<input type="tel" maxLength={40} value={profileForm.phone} onChange={(event) => setProfileForm((old) => ({ ...old, phone: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm" /></label><button disabled={savingProfile} className="rounded-xl bg-emerald-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{savingProfile ? 'Savingâ€¦' : 'Save details'}</button></form>{profileError && <p role="alert" className="mt-3 text-sm text-rose-700">{profileError}</p>}{profileNotice && <p role="status" className="mt-3 text-sm text-emerald-800">{profileNotice}</p>}</section>
          <div id="booking-history" className="scroll-mt-28"><BookingsSection bookings={bookings} visibleBookings={visibleBookings} query={bookingQuery} onQueryChange={setBookingQuery} filter={bookingFilter} onFilterChange={setBookingFilter} onPreparation={handlePreparation} /></div>
          <section id="account-security" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><ShieldCheck size={19} /></span><div><h2 className="font-semibold text-slate-900">Account security</h2><p className="text-xs text-slate-500">Change your password any time.</p></div></div><form onSubmit={handlePasswordChange} className="mt-5 space-y-3"><label className="block text-xs font-semibold text-slate-600">Current password<input type="password" autoComplete="current-password" required value={passwords.current} onChange={(event) => setPasswords((old) => ({ ...old, current: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm" /></label><label className="block text-xs font-semibold text-slate-600">New password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwords.next} onChange={(event) => setPasswords((old) => ({ ...old, next: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm" /></label><label className="block text-xs font-semibold text-slate-600">Confirm new password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwords.confirm} onChange={(event) => setPasswords((old) => ({ ...old, confirm: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm" /></label>{passwordError && <p role="alert" className="text-xs text-rose-700">{passwordError}</p>}{passwordNotice && <p role="status" className="inline-flex items-center gap-1 text-xs text-emerald-800"><CircleCheck size={14} />{passwordNotice}</p>}<button disabled={savingPassword} className="w-full rounded-xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{savingPassword ? 'Updatingâ€¦' : 'Update password'}</button></form></section>
          </div>
        </div></>}
      </div>
    </main>
  );
}
