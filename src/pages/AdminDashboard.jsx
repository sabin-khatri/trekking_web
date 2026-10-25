/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import StatCard from '../components/admin/StatCard';
import StatusBadge from '../components/admin/StatusBadge';
import BookingDetailModal from '../components/admin/BookingDetailModal';
import CustomersTab from '../components/admin/Customerstab';
import CustomerDetailModal from '../components/admin/Customerdetailmodal';
import SettingsTab from '../components/admin/Settingstab';
import PackagesTab from '../components/admin/Packagestab';
import { fetchAdminBookings, updateAdminBookingStatus } from '../services/adminBookings';
import { signOutAdmin } from '../services/adminAuth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsState, setBookingsState] = useState('loading');
  const [bookingsError, setBookingsError] = useState('');
  const [statusError, setStatusError] = useState('');

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
        totalSpend: '—',
        lastTrek: latest.trek,
        type: history.length > 1 ? 'returning' : 'new',
        history: history.map((booking) => ({
          trek: booking.trek,
          date: booking.date,
          amount: `Estimate: ${booking.amount}`,
        })),
      };
    });
  }, [bookings]);

  useEffect(() => {
    let active = true;
    fetchAdminBookings()
      .then((data) => {
        if (!active) return;
        setBookings(data);
        setBookingsState('ready');
      })
      .catch((error) => {
        if (!active) return;
        setBookingsState('error');
        setBookingsError(error.message);
      });
    return () => { active = false; };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleBookingStatusChange = async (booking, status) => {
    setStatusError('');
    try {
      const updated = await updateAdminBookingStatus(booking.id, status);
      setBookings((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelectedBooking(updated);
    } catch (error) {
      setStatusError(error.message || 'Could not update this booking.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO title="Admin Dashboard | Apex Himalaya" />

      {/* Header */}
      <div className="bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="text-slate-300 mt-2 font-light">Booking requests from your Supabase database.</p>
            <button onClick={handleSignOut} className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Revenue" value="—" icon={DollarSign} trend="Payments not connected" />
          <StatCard title="Open Requests" value={bookings.filter((booking) => booking.status === 'pending').length} icon={Calendar} trend="Awaiting follow-up" />
          <StatCard title="Customers" value={new Set(bookings.map((booking) => booking.email)).size} icon={Users} trend="Unique booking emails" />
          <StatCard title="Requested Treks" value={new Set(bookings.map((booking) => booking.trek)).size} icon={MapPin} trend="From booking requests" />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {statusError && <p role="alert" className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{statusError}</p>}

          {/* Tabs */}
          <div className="border-b border-slate-100 px-6 flex gap-6">
            {['bookings', 'customers', 'packages', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Bookings Table */}
          {activeTab === 'bookings' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Booking ID</th>
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
                  {bookings.map((booking) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={booking.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{booking.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.trek}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{booking.pax}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{booking.amount}</td>
                      <td className="px-6 py-4"><StatusBadge status={booking.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && <CustomersTab customers={customers} onSelectCustomer={setSelectedCustomer} />}

          {/* Packages Tab */}
          {activeTab === 'packages' && <PackagesTab />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsTab />}

        </div>
      </div>

      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} onStatusChange={handleBookingStatusChange} />
      <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}
