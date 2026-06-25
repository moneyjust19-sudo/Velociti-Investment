import React from 'react';
import { motion } from 'motion/react';
import { Landmark, Shield, Cpu, Compass, Globe } from 'lucide-react';

export default function TrustedBy() {
  const partners = [
    { name: 'NCENT Ventures', icon: <Cpu size={18} /> },
    { name: 'Black Ben Corp', icon: <Landmark size={18} /> },
    { name: 'Hunobree Capital', icon: <Shield size={18} /> },
    { name: 'guanchao', icon: <Compass size={18} /> },
    { name: 'mackm Global', icon: <Globe size={18} /> }
  ];

  return (
    <section className="py-10 border-y border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
          Empowering financial growth with global leading organizations
        </p>

        {/* Responsive Horizontal Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {partners.map((partner, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200"
            >
              <div className="text-slate-300 dark:text-slate-700">
                {partner.icon}
              </div>
              <span className="text-sm font-bold tracking-tight font-display">
                // {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
