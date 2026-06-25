import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface FinalCtaProps {
  onCtaClick: () => void;
}

export default function FinalCta({ onCtaClick }: FinalCtaProps) {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-14 rounded-[40px] bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 text-center relative overflow-hidden text-white shadow-2xl">
          
          {/* Subtle background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent)] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Visual badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mx-auto">
              <Sparkles size={12} />
              <span>Onboarding Special</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Start Building Your <br className="hidden sm:inline" />
              Financial Future Today
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
              Open your free secure portfolio builder today. Test advanced allocations, unlock real-time insight forecasts, and elevate your financial success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onCtaClick}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <span>Get Started Now</span>
                <ArrowRight size={16} />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/5 hover:border-white/10 text-white font-bold transition-all flex items-center justify-center gap-1.5 text-base"
              >
                <span>Contact Advisor</span>
              </a>
            </div>

            {/* Credibility points */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-slate-800/80 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> No setup charges
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Cancel anytime
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> $0 commissions
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
