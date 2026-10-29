// src/App.jsx
import React, { Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import WhatsAppButton from './components/WhatsAppButton';
import RequireAdmin from './components/admin/RequireAdmin';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Packages = React.lazy(() => import('./pages/Packages'));
const TrekDetail = React.lazy(() => import('./pages/TrekDetail'));
const Planner = React.lazy(() => import('./pages/Planner'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));



const PageWrapper = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
    >
      {children}
    </motion.div>
  );
};

const LoadingSpinner = () => (
  <div className="flex-grow flex items-center justify-center min-h-[70vh]">
    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col min-h-[70vh] outline-none">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/packages" element={<PageWrapper><Packages /></PageWrapper>} />
              <Route path="/packages/:id" element={<PageWrapper><TrekDetail /></PageWrapper>} />
              <Route path="/planner" element={<PageWrapper><Planner /></PageWrapper>} />
              <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
              <Route path="/admin" element={<RequireAdmin><PageWrapper><AdminDashboard /></PageWrapper></RequireAdmin>} />
              <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
