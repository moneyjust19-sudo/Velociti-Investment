import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "NovaX has transformed how our treasury assets are allocated. The real-time risk assessment indices and smart portfolio builders have unlocked consistent yields with complete peace of mind.",
      author: "Sarah Jenkins",
      role: "VP of Treasury",
      company: "Aether Global",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
    },
    {
      quote: "The visual interface and automated clearing speed are second to none. Being able to run deep stress-testing scenarios on our balanced portfolios is a game-changer.",
      author: "Marcus Vance",
      role: "Strategic Investor",
      company: "Vance Partners",
      rating: 5,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
    },
    {
      quote: "The personalized AI strategic insights are incredibly accurate. They pointed out my tech mega-cap concentrations early and helped restructure my index exposures perfectly.",
      author: "Dr. Elena Rostova",
      role: "Founder",
      company: "Rostov Biotech",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/40 transition-colors duration-300 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Trusted by the World's Most <br />
            <span className="text-gradient dark:text-gradient-dark">Demanding Investors</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">
            Hear directly from corporate treasurers, private founders, and sophisticated retail partners who build wealth on our secure system.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              {/* Quote visual element */}
              <div className="absolute top-6 right-6 text-slate-100 dark:text-slate-800 pointer-events-none">
                <Quote size={40} className="stroke-[2.5]" />
              </div>

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                {/* Body Quote */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  "{test.quote}"
                </p>
              </div>

              {/* Profile details */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-50 dark:border-slate-800/60">
                <img 
                  className="w-10 h-10 rounded-full object-cover filter contrast-[1.02]" 
                  src={test.image} 
                  alt={test.author} 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {test.author}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {test.role} • <span className="text-blue-600 dark:text-blue-400 font-semibold">{test.company}</span>
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
