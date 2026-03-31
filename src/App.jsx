// src/App.jsx
import React from 'react';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';




function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ScrollToTop />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='/packages' element={<Packages />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/contact' element={<Contact />} />
          
        </Routes>
      </main>

      <Footer />
    </div>
  );
}