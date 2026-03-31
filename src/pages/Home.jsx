// src/pages/Home.jsx
import React, { useEffect } from 'react';

// Import only the icons you actually use (tree-shaking friendly)
import { 
  FaMountain, 
  FaCompass, 
  FaHeartbeat, 
  FaLeaf 
} from 'react-icons/fa';

import { 
  GiMountainRoad, 
  GiHiking, 
  GiBackpack 
} from 'react-icons/gi';

import { HiOutlineShieldCheck } from 'react-icons/hi';

export default function Home() {
  useEffect(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 800);
    }
  }, []);

  return (
    <>
      
<header
  id="top"
  className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
  style={{
    backgroundImage: `url('src/assets/img/home.avif')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="absolute inset-0 bg-black/65" /> 

  <div className="relative z-10 px-5 sm:px-8 lg:px-12 max-w-5xl mx-auto">
    <h1
      className="
        text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
        bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent
        leading-tight drop-shadow-lg animate-on-scroll
      "
    >
      Discover the Himalayas
    </h1>

    <p
      className="
        mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto
        text-slate-100 font-light animate-on-scroll
      "
      style={{ animationDelay: '0.25s' }}
    >
      Embark on a transformative journey with Nepal Treks, where adventure meets serenity.
    </p>

    <div
      className="mt-8 sm:mt-10 animate-on-scroll"
      style={{ animationDelay: '0.5s' }}
    >
      <a
        href="#treks"
        className="
          inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-700
          hover:from-green-700 hover:to-emerald-800 text-white
          px-7 py-3.5 rounded-full font-semibold text-base sm:text-lg
          transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg
        "
      >
        <GiHiking className="text-xl sm:text-2xl" />
        Explore Treks
      </a>
    </div>
  </div>
</header>
      
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Why Choose Nepal Treks?
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600">
              Your adventure, our expertise – a perfect blend for an unforgettable journey.
            </p>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {/* Card 1 */}
            <div className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white shadow-md hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-5">
                <GiMountainRoad className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">Expert Guides</h3>
              <p className="mt-3 text-slate-600 text-base">
                Local experts with deep Himalayan knowledge.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white shadow-md hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-5">
                <GiBackpack className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">Authentic Experiences</h3>
              <p className="mt-3 text-slate-600 text-base">
                Homestays and real cultural immersion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white shadow-md hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-5">
                <HiOutlineShieldCheck className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">Safety First</h3>
              <p className="mt-3 text-slate-600 text-base">
                Top gear and strict safety protocols.
              </p>
            </div>

            {/* Card 4 */}
            <div className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white shadow-md hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-5">
                <FaLeaf className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">Eco-Conscious</h3>
              <p className="mt-3 text-slate-600 text-base">
                Sustainable and community-focused.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      <section id="treks" className="py-16 md:py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Featured Treks
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600">
              Handpicked adventures for every explorer.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {/* Trek Card 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group">
              <img
                src="src/assets/img/everest.jpg"
                alt="Everest Base Camp Trek"
                className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                  <FaMountain className="text-green-600" />
                  Everest Base Camp
                </h3>
                <p className="mt-2 text-slate-600">
                  14 days to the foot of the world’s highest peak.
                </p>
                <div className="mt-5 flex justify-between items-center text-sm font-medium">
                  <span className="text-green-600">Moderate</span>
                  <a href="/packages" className="text-green-600 hover:text-green-800">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

            {/* trek card 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group"> 
              <img
                src="src/assets/img/annapurna.jpg"
                alt="Annapurna Circuit Trek"
                className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                  <FaMountain className="text-green-600" />
                  Annapurna Circuit
                </h3>
                <p className="mt-2 text-slate-600">
                  Diverse landscapes from subtropical forests to high-altitude deserts.
                </p>
                <div className="mt-5 flex justify-between items-center text-sm font-medium">
                  <span className="text-green-600">Moderate</span>
                  <a href="/packages" className="text-green-600 hover:text-green-800">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>
            {/* trek card 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group"> 
              <img
                src="src/assets/img/langtang.webp"
                alt="Langtang Valley Trek"
                className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                  <FaMountain className="text-green-600" />
                  Langtang Valley
                </h3>
                <p className="mt-2 text-slate-600">
                  A peaceful, less-crowded trail with stunning views and rich Tamang culture.
                </p>
                <div className="mt-5 flex justify-between items-center text-sm font-medium">
                  <span className="text-green-600">Moderate</span>
                  <a href="/packages" className="text-green-600 hover:text-green-800">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

         
          </div>

          <div className="mt-12 text-center">
            <a
              href="/packages"
              className="
                inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-green-800 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                hover:from-green-700 hover:to-green-900 transition-all duration-300 hover:scale-105 shadow-lg
              "
            >
              <FaCompass className="text-xl" />
              View All Treks
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA – minor polish */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Ready for your adventure?
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-green-100">
            Let’s find the perfect trek. Start planning today.
          </p>
          <a
            href="/packages"
            className="
              mt-8 inline-flex items-center gap-2.5 bg-white text-green-800
              px-8 py-4 rounded-full font-semibold text-base sm:text-lg
              hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-xl
            "
          >
            <GiHiking className="text-xl" />
            View Trekking Packages
          </a>
        </div>
      </section>
    </>
  );
}