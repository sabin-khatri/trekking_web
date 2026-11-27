import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Search, Download, RefreshCw, CircleDollarSign, Hourglass, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import StatCard from '../components/admin/StatCard';
import StatusBadge from '../components/admin/StatusBadge';
import BookingDetailModal from '../components/admin/BookingDetailModal';
import CustomersTab from '../components/admin/Customerstab';
import CustomerDetailModal from '../components/admin/Customerdetailmodal';
import SettingsTab from '../components/admin/Settingstab';
import PackagesTab from '../components/admin/Packagestab';
import SystemTab from '../components/admin/Systemtab';
import NewsletterTab from '../components/admin/Newslettertab';
import DeparturesTab from '../components/admin/DeparturesTab';
import OverviewTab from '../components/admin/OverviewTab';
import HistoryTab from '../components/admin/HistoryTab';
import ReviewsTab from '../components/admin/ReviewsTab';
import { fetchAdminBookings, sendAdminPaymentLink, updateAdminBookingStatus } from '../services/adminBookings';
import { signOutAdmin } from '../services/adminAuth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsState, setBookingsState] = useState('loading');
  const [bookingsError, setBookingsError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusNotice, setStatusNotice] = useState('');
  const [statusPaymentUrl, setStatusPaymentUrl] = useState('');
  const [statusAction, setStatusAction] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const customers = useMemo(() => {
    const grouped = new Map();
    bookings.forEach((booking) => {
      const history = grouped.get(booking.email) || [];
      history.push(booking);
      grouped.set(booking.email, history);
    });
    return [...grouped.entries()].map(([email, history]) => {
      const latest = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const earliest = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
      return {
        id: email,
        name: latest.name,
        email,
        phone: latest.phone,
        country: 'Not provided',
        joined: earliest.createdAt ? new Date(earliest.createdAt).toLocaleDateString() : '—',
        totalTreks: history.length,
        totalSpend: `Rs. ${history.reduce((total, booking) => total + booking.amountValue, 0).toLocaleString()}`,
        lastTrek: latest.trek,
        type: history.length > 1 ? 'returning' : 'new',
        history: history.map((booking) => ({
          trek: booking.trek,
          date: booking.date,
          amount: `Booking estimate: ${booking.amount}`,
        })),
      };
    });
  }, [bookings]);

  const refreshBookings = useCallback(async () => {
    setRefreshing(true);
    setBookingsError('');
    try {
      const data = await fetchAdminBookings();
      setBookings(data);
      setBookingsState('ready');
    } catch (error) {
      setBookingsState('error');
      setBookingsError(error.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { refreshBookings(); }, [refreshBookings]);

  const filteredBookings = useMemo(() => {
    const query = bookingSearch.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = bookingFilter === 'all'
        || (bookingFilter.startsWith('payment:')
          ? (bookingFilter === 'payment:due' ? booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' : booking.paymentStatus === 'paid')
          : booking.status === bookingFilter);
      const matchesSearch = !query || [booking.reference, booking.id, booking.name, booking.email, booking.trek, booking.phone]
        .some((value) => String(value || '').toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, bookingFilter, bookingSearch]);

  const upcomingBookings = useMemo(() => bookings
    .filter((booking) => booking.status === 'confirmed' && booking.date && new Date(booking.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5), [bookings]);

  const openBookings = (filter) => {
    setBookingFilter(filter);
    setActiveTab('bookings');
  };

  const exportBookings = () => {
    const fields = [
      ['Booking reference', 'reference'], ['Customer', 'name'], ['Email', 'email'], ['Phone', 'phone'],
      ['Trek', 'trek'], ['Start date', 'date'], ['Travelers', 'pax'], ['Quoted amount (NPR)', 'amountValue'], ['Status', 'status'],
    ];
    const escapeCell = (value) => {
      const raw = String(value ?? '');
      const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const csv = [fields.map(([label]) => escapeCell(label)).join(','), ...filteredBookings.map((booking) => fields.map(([, key]) => escapeCell(booking[key])).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apex-himalaya-bookings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleBookingStatusChange = async (booking, status) => {
    setStatusError('');
    setStatusNotice('');
    setStatusPaymentUrl('');
    setStatusAction(status);
    try {
      const updated = await updateAdminBookingStatus(booking.id, status);
      setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelectedBooking(updated);
      const notification = updated.notification;
      setStatusPaymentUrl(notification?.payment_url || '');
      if (notification?.status === 'sent' && notification.payment_status === 'ready') {
        setStatusNotice(`Booking confirmed. Secure eSewa payment options were emailed to ${updated.email}.`);
      } else if (notification?.status === 'sent' && notification.payment_status === 'not_configured') {
        setStatusNotice(`Booking confirmed and email sent to ${updated.email}, but eSewa credentials are not configured.`);
      } else if (notification?.status === 'sent') {
        setStatusNotice(`Booking status updated and email sent to ${updated.email}.`);
      } else if (updated.notification?.status === 'not_configured') {
        setStatusNotice('Booking status saved. Email is not configured; call the customer with the update.');
      } else if (updated.notification?.status === 'failed') {
        setStatusNotice('Booking status saved, but email delivery failed. Check backend SMTP settings and logs.');
      }
    } catch (error) {
      setStatusError(error.message || 'Could not update this booking.');
      setStatusNotice('');
      setStatusPaymentUrl('');
    } finally {
      setStatusAction('');
    }
  };

  const copyPaymentUrl = async () => {
    try {
      await navigator.clipboard.writeText(statusPaymentUrl);
      setStatusNotice('eSewa payment link copied. You can send it to the customer manually.');
    } catch {
      setStatusError('Could not copy the eSewa payment link.');
    }
  };

  const handleSendPaymentLink = async (booking, paymentMethod = 'deposit', provider = 'esewa') => {
    setStatusError('');
    setStatusNotice('');
    setStatusPaymentUrl('');
    setStatusAction('payment-link');
    try {
      const updated = await sendAdminPaymentLink(booking.id, paymentMethod, provider);
      setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelectedBooking(updated);
      setStatusPaymentUrl(updated.notification?.payment_url || '');
      setStatusNotice(updated.notification?.status === 'sent'
        ? `${provider === 'khalti' ? 'Khalti' : 'eSewa'} payment link emailed to ${updated.email}.`
        : 'Payment link created, but email is not configured. Copy the link and call the customer with payment instructions.');
    } catch (error) {
      setStatusError(error.message || 'Could not create a payment link.');
    } finally {
      setStatusAction('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO title="Admin Dashboard | Apex Himalaya" />

      {/* Header */}
      <div className="bg-slate-950 pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden mb-8 shadow-xl sm:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="text-slate-300 mt-2 font-light">Booking, customer and payment operations</p>
            <button onClick={handleSignOut} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">

        {/* Stats Grid */}
        <div className="mb-7 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 xl:grid-cols-4">
          <StatCard title="Bookings" value={bookings.length} icon={ClipboardList} detail="All requests" tone="blue" />
          <StatCard title="Needs review" value={bookings.filter((booking) => booking.status === 'pending').length} icon={Hourglass} detail="Awaiting your decision" tone="amber" />
          <StatCard title="Payments received" value={`Rs. ${bookings.reduce((total, booking) => total + booking.paidValue, 0).toLocaleString()}`} icon={CircleDollarSign} detail="Verified payments" tone="emerald" />
          <StatCard title="Payment due" value={`Rs. ${bookings.filter((booking) => booking.status !== 'cancelled').reduce((total, booking) => total + Math.max(0, booking.amountValue - booking.paidValue), 0).toLocaleString()}`} icon={Wallet} detail="Confirmed and pending trips" tone="violet" />
        </div>

        {/* Main Content Area */}
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:sticky lg:top-24">
          <p className="hidden px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">Workspace</p>
          <nav aria-label="Admin dashboard sections" className="flex gap-1 overflow-x-auto lg:flex-col">
            {[
              ['overview', 'Overview'], ['bookings', 'Bookings'], ['departures', 'Departures'],
              ['customers', 'Customers'], ['packages', 'Packages'], ['newsletter', 'Newsletter'],
              ['reviews', 'Reviews'], ['history', 'Activity history'], ['system', 'System status'], ['settings', 'Settings'],
            ].map(([tab, label]) => <button key={tab} onClick={() => setActiveTab(tab)} aria-current={activeTab === tab ? 'page' : undefined} className={`shrink-0 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition lg:w-full ${activeTab === tab ? 'bg-emerald-50 text-emerald-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>{label}{tab === 'bookings' && bookings.filter((booking) => booking.status === 'pending').length > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900">{bookings.filter((booking) => booking.status === 'pending').length}</span>}</button>)}
          </nav>
        </aside>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {statusError && !selectedBooking && <p role="alert" className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{statusError}</p>}
          {statusNotice && !selectedBooking && <p role="status" className="mx-6 mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{statusNotice}</p>}

          {activeTab === 'overview' && <OverviewTab bookings={bookings} upcomingBookings={upcomingBookings} refreshing={refreshing} onRefresh={refreshBookings} onOpenBookings={openBookings} onSelectBooking={setSelectedBooking} />}

          {/* Bookings Table */}
          {activeTab === 'bookings' && (
            <>
            <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between border-b border-slate-100">
              <div className="relative w-full sm:max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={bookingSearch} onChange={(event) => setBookingSearch(event.target.value)} placeholder="Search name, email, trek, phone…" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div className="flex gap-2">
                <select value={bookingFilter} onChange={(event) => setBookingFilter(event.target.value)} aria-label="Filter bookings" className="min-w-32 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500">
                  <option value="all">All bookings</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="payment:due">Payment due</option><option value="payment:paid">Paid in full</option>
                </select>
                <button onClick={refreshBookings} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50" aria-label="Refresh bookings"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /><span className="hidden sm:inline">Refresh</span></button>
                <button onClick={exportBookings} disabled={!filteredBookings.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"><Download size={15} /><span className="hidden sm:inline">Export</span></button>
              </div>
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Trek Package</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Pax</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingsState === 'loading' && <tr><td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-500">Loading booking requests…</td></tr>}
                  {bookingsState === 'error' && <tr><td colSpan="8" className="px-6 py-12 text-center text-sm text-red-700">{bookingsError}</td></tr>}
                  {bookingsState === 'ready' && bookings.length === 0 && <tr><td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-500">No booking requests yet.</td></tr>}
                  {bookingsState === 'ready' && bookings.length > 0 && filteredBookings.length === 0 && <tr><td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-500">No bookings match these filters.</td></tr>}
                  {filteredBookings.map((booking) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={booking.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4"><span className="font-mono text-xs font-semibold tracking-wide text-slate-700">{booking.reference || booking.id.slice(-8).toUpperCase()}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-700">{booking.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.trek}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.pax}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{booking.amount}</td>
                      <td className="px-6 py-4"><div className="space-y-2"><StatusBadge status={booking.status} /><span className={`block w-max rounded-full px-2.5 py-1 text-[11px] font-semibold ${booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{booking.paymentStatus?.replaceAll('_', ' ') || 'unpaid'}</span></div></td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => { setStatusError(''); setStatusNotice(''); setStatusPaymentUrl(''); setSelectedBooking(booking); }}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 md:hidden">
              {bookingsState === 'loading' && <p className="px-5 py-12 text-center text-sm text-slate-500">Loading booking requests…</p>}
              {bookingsState === 'error' && <div className="px-5 py-10 text-center"><p role="alert" className="text-sm text-rose-700">{bookingsError}</p><button onClick={refreshBookings} className="mt-3 text-sm font-semibold text-emerald-800 underline">Try again</button></div>}
              {bookingsState === 'ready' && filteredBookings.length === 0 && <p className="px-5 py-12 text-center text-sm text-slate-500">{bookings.length ? 'No bookings match these filters.' : 'No booking requests yet.'}</p>}
              {bookingsState === 'ready' && filteredBookings.map((booking) => (
                <motion.article key={booking.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{booking.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{booking.email}</p></div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="mt-3 font-medium text-slate-800">{booking.trek}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500"><span>{booking.date}</span><span>·</span><span>{booking.pax} traveler{booking.pax === 1 ? '' : 's'}</span><span>·</span><span>{booking.amount}</span></div>
                  <div className="mt-3 flex items-center justify-between gap-3"><div><p className="font-mono text-[11px] tracking-wide text-slate-500">{booking.reference || booking.id.slice(-8).toUpperCase()}</p><span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{booking.paymentStatus?.replaceAll('_', ' ') || 'unpaid'}</span></div><button onClick={() => { setStatusError(''); setStatusNotice(''); setStatusPaymentUrl(''); setSelectedBooking(booking); }} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">View details</button></div>
                </motion.article>
              ))}
            </div>
            </>
          )}

          {/* Customers Tab */}
          {activeTab === 'departures' && <DeparturesTab />}
          {activeTab === 'customers' && <CustomersTab customers={customers} onSelectCustomer={setSelectedCustomer} />}

          {/* Packages Tab */}
          {activeTab === 'packages' && <PackagesTab />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'system' && <SystemTab />}
          {activeTab === 'newsletter' && <NewsletterTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'history' && <HistoryTab />}

        </div>
        </div>
      </div>

      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onStatusChange={handleBookingStatusChange} onSendPaymentLink={handleSendPaymentLink} statusAction={statusAction} statusError={statusError} statusNotice={statusNotice} paymentUrl={statusPaymentUrl} onCopyPaymentUrl={copyPaymentUrl} />
      <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}
