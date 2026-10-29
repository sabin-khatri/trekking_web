import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";

export default function Signup() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 pb-16 pt-24"
      style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }}
    >
      <SEO title="Account Access | Apex Himalaya Treks" description="Information about account access for Apex Himalaya Treks." />
      <section
        className="w-full max-w-lg rounded-2xl p-8 text-center shadow-xl sm:p-10"
        style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
      >
        <h1 className="mb-4 text-3xl italic" style={{ color: INK, fontFamily: FONT_DISPLAY }}>
          Account Access
        </h1>
        <p className="leading-relaxed" style={{ color: '#5B6660' }}>
          Customer accounts are not available yet. You can send a booking request for any trek without creating an account.
          The sign-in area is reserved for authorized company administrators.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/packages"
            className="rounded-full px-6 py-3 font-semibold"
            style={{ backgroundColor: INK, color: PARCHMENT }}
          >
            Browse Trek Packages
          </Link>
          <Link
            to="/login"
            className="rounded-full border px-6 py-3 font-semibold"
            style={{ borderColor: JUNIPER, color: JUNIPER }}
          >
            Administrator Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}
