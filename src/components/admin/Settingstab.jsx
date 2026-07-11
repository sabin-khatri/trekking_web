/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { User, Lock, Bell, Save } from 'lucide-react';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
      checked ? 'bg-emerald-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SectionCard = ({ icon: Icon, title, description, children }) => (
  <div className="border border-slate-100 rounded-2xl p-6">
    <div className="flex items-start gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Field = ({ label, type = 'text', defaultValue, placeholder }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
    />
  </div>
);

export default function SettingsTab() {
  const [notifications, setNotifications] = useState({
    newBooking: true,
    cancellation: true,
    paymentReceived: true,
    weeklyReport: false,
  });
  const [saved, setSaved] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const notificationLabels = {
    newBooking: 'New booking received',
    cancellation: 'Booking cancelled',
    paymentReceived: 'Payment received',
    weeklyReport: 'Weekly summary report',
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">

      <SectionCard icon={User} title="Admin Profile" description="Your account details shown across the dashboard.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" defaultValue="Admin User" />
          <Field label="Email" type="email" defaultValue="admin@apexhimalaya.com" />
        </div>
      </SectionCard>

      <SectionCard icon={Lock} title="Password" description="Update the password used to sign in.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Current Password" type="password" placeholder="••••••••" />
          <div className="hidden sm:block" />
          <Field label="New Password" type="password" placeholder="••••••••" />
          <Field label="Confirm New Password" type="password" placeholder="••••••••" />
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications" description="Choose what you get notified about.">
        <div className="divide-y divide-slate-100">
          {Object.keys(notifications).map((key) => (
            <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-medium text-slate-700">{notificationLabels[key]}</p>
              <Toggle checked={notifications[key]} onChange={() => toggleNotification(key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center gap-3 justify-end">
        {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}