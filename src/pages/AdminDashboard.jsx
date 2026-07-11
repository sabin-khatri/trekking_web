/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, Calendar, MapPin } from 'lucide-react';
import SEO from '../components/common/SEO';
import StatCard from '../components/admin/StatCard';
import StatusBadge from '../components/admin/StatusBadge';
import BookingDetailModal from '../components/admin/BookingDetailModal';
import CustomersTab from '../components/admin/CustomersTab';
import CustomerDetailModal from '../components/admin/CustomerDetailModal';
import SettingsTab from '../components/admin/SettingsTab';
import PackagesTab from '../components/admin/PackagesTab';
import dummyBookings from '../data/dummyBookings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO title="Admin Dashboard | Apex Himalaya" />

      {/* Header */}
      <div className="bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-300 mt-2 font-light">Welcome back, Admin. Here is what's happening today.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Revenue" value="$45,230" icon={DollarSign} trend="+12% this month" />
          <StatCard title="Active Bookings" value="128" icon={Calendar} trend="+5% this week" />
          <StatCard title="Total Customers" value="892" icon={Users} trend="+18 new" />
          <StatCard title="Active Treks" value="9" icon={MapPin} trend="All operational" />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

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
                  {dummyBookings.map((booking) => (
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
          {activeTab === 'customers' && (
            <CustomersTab onSelectCustomer={setSelectedCustomer} />
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && <PackagesTab />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsTab />}

        </div>
      </div>

      <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}