// src/pages/About.jsx
import React, { useEffect } from 'react';

// Import only needed icons (tree-shaking friendly)
import { 
  FaMountain, 
  FaHeartbeat, 
  FaLeaf, 
  FaFire 
} from 'react-icons/fa';

import { 
  GiMountainRoad, 
  GiHiking, 
  GiBackpack, 
  GiCompass 
} from 'react-icons/gi';

import { HiOutlineShieldCheck } from 'react-icons/hi';

export default function About() {
  useEffect(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 800);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
    
<header
  id="top"
  className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
  style={{
    backgroundImage: `url('src/assets/img/about.avif')`, 
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
      Our Story
    </h1>

    <p
      className="
        mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto
        text-slate-100 font-light animate-on-scroll
      "
      style={{ animationDelay: '0.25s' }}
    >
      Our Journey, Our Passion, Our Promise
    </p>

    <div
      className="mt-8 sm:mt-10 animate-on-scroll"
      style={{ animationDelay: '0.5s' }}
    >
      <a
        href="#mission"  
        className="
          inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-700
          hover:from-green-700 hover:to-emerald-800 text-white
          px-7 py-3.5 rounded-full font-semibold text-base sm:text-lg
          transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg
        "
      >
        <GiMountainRoad className="text-xl sm:text-2xl" />
        Discover Our Mission
      </a>
    </div>
  </div>
</header>

      {/* Our Mission */}
      <section id="mission" className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="animate-on-scroll slideInLeft order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Our Mission
            </h2>
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
              We believe trekking is more than just a walk; it's a journey into the heart of nature, culture, and oneself.
            </p>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
              Our mission is to provide authentic, safe, and sustainable trekking experiences that forge a lasting connection between our guests and Nepal.
            </p>
          </div>

          <div className="animate-on-scroll slideInRight order-1 md:order-2">
            <img
              src="src/assets/img/about1.avif"  
              alt="Trekking in Himalayas"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3] md:aspect-auto"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Key Milestones */}
      <section className="py-16 md:py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Key Milestones
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600">
              Moments that define our journey
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                year: '2010',
                title: 'Founded',
                desc: "Dorje Sherpa's vision begins.",
                img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
                delay: '0.1s',
              },
              {
                year: '2015',
                title: 'First Int\'l Group',
                desc: 'Everest Base Camp success.',
                img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
                delay: '0.2s',
              },
              {
                year: '2018',
                title: 'Sustainability',
                desc: 'Eco-friendly pledge made.',
                img: 'https://images.unsplash.com/photo-1573153098012-67bdee4c62f1?auto=format&fit=crop&w=400&q=80',
                delay: '0.3s',
              },
              {
                year: '2023',
                title: '1000th Trekker',
                desc: 'Milestone celebration.',
                img: '/assets/img/about1.avif',
                delay: '0.4s',
              },
            ].map((item) => (
              <div
                key={item.year}
                className="
                  bg-white rounded-2xl shadow-lg p-5 text-center 
                  hover:-translate-y-2 transition-all duration-300 animate-on-scroll
                "
                style={{ animationDelay: item.delay }}
              >
                <img
                  src={item.img}
                  alt={item.year}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mx-auto border-4 border-green-100"
                  loading="lazy"
                />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-green-700">
                  {item.year}: {item.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Meet Our Team
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600">
              The Heart and Soul of Your Adventure
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                name: 'Dorje Sherpa',
                role: 'Founder & Lead Guide',
                desc: '20+ years of high-altitude expertise.',
                quote: 'The mountains teach us humility and strength.',
                img: '/assets/images/dorje.png',
                icon: <GiHiking className="text-5xl text-green-600" />,
                delay: '0.1s',
              },
              {
                name: 'Pema Lama',
                role: 'Operations Manager',
                desc: 'Ensures seamless trip planning.',
                quote: 'Planning your adventure is my adventure!',
                img: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=500&q=80',
                icon: <GiCompass className="text-5xl text-green-600" />,
                delay: '0.2s',
              },
              {
                name: 'Rinzin Gurung',
                role: 'Cultural Guide',
                desc: "Shares Nepal's rich heritage.",
                quote: "I'm a Nepali, but I'm also a traveler. I love to explore new places.",
                img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=500&q=80',
                icon: <GiBackpack className="text-5xl text-green-600" />,
                delay: '0.3s',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="
                  bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center 
                  hover:-translate-y-2 transition-all duration-300 animate-on-scroll
                "
                style={{ animationDelay: member.delay }}
              >
                <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-green-100 mb-5">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{member.name}</h3>
                <p className="text-green-600 font-semibold text-base sm:text-lg">{member.role}</p>
                <p className="mt-3 text-sm sm:text-base text-slate-600">{member.desc}</p>

                <div className="mt-5 flex justify-center">
                  {member.icon}
                </div>

                <p
                  className="
                    mt-5 text-sm sm:text-base italic text-white 
                    bg-gradient-to-r from-green-600 to-green-800 
                    p-4 rounded-xl shadow-inner
                  "
                >
                  "{member.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moments Gallery */}
      <section className="py-16 md:py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Moments from Our Treks
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600">
              A glimpse into shared adventures
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                caption: 'Sunrise at Everest Base Camp',
                img: 'src/assets/img/everest.jpg',
                delay: '0.1s',
              },
              {
                caption: 'Annapurna Circuit',
                img: 'src/assets/img/annapurna.jpg',
                delay: '0.2s',
              },
              {
                caption: 'Langtang Valley Culture',
                img: 'src/assets/img/langtang.webp',    
                delay: '0.3s',
              },
            ].map((item) => (
              <div
                key={item.caption}
                className="
                  relative overflow-hidden rounded-2xl shadow-lg 
                  hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-on-scroll
                "
                style={{ animationDelay: item.delay }}
              >
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                  <p className="text-white font-medium text-base sm:text-lg">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800">
              Our Core Values
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600">
              Principles that guide every step
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: 'Authenticity',
                desc: 'Real Nepal through local eyes.',
                icon: <GiMountainRoad className="h-8 w-8" />,
                delay: '0.1s',
              },
              {
                title: 'Safety',
                desc: 'Top gear, strict protocols.',
                icon: <HiOutlineShieldCheck className="h-8 w-8" />,
                delay: '0.2s',
              },
              {
                title: 'Sustainability',
                desc: 'Leave no trace, give back.',
                icon: <FaLeaf className="h-8 w-8" />,
                delay: '0.3s',
              },
              {
                title: 'Passion',
                desc: 'We live for the mountains!',
                icon: <FaFire className="h-8 w-8" />,
                delay: '0.4s',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="
                  text-center p-6 md:p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white 
                  shadow-md hover:shadow-xl transition-all duration-300 animate-on-scroll
                "
                style={{ animationDelay: value.delay }}
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-5">
                  {value.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">{value.title}</h3>
                <p className="mt-3 text-base text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="call-to-action" className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-5 animate-on-scroll">
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