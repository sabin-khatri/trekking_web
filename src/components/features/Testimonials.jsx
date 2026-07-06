/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Adventure Enthusiast",
    content: "The Everest Base Camp trek was organized flawlessly. Our guide was incredibly knowledgeable and made sure we acclimatized properly. A truly life-changing experience!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 2,
    name: "David Chen",
    role: "Photographer",
    content: "Annapurna Circuit offered some of the most diverse landscapes I've ever photographed. The team's hospitality and attention to detail were outstanding.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=david"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "First-time Trekker",
    content: "I was nervous about my first high-altitude trek (Poon Hill), but the guides were so supportive and patient. The sunrise views were worth every step!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=emma"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-forest-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-forest-600 tracking-widest uppercase mb-2">Testimonials</h2>
          <h3 className="text-4xl font-extrabold text-slate-800 mb-4">What Our Trekkers Say</h3>
          <p className="text-slate-600 text-lg">Don't just take our word for it. Read the experiences of adventurers who have explored the Himalayas with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 relative"
            >
              <div className="flex text-yellow-400 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-600 italic mb-8 relative z-10">"{testimonial.content}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
