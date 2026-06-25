import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowUpRight, TrendingUp, Sparkles, Star, Users, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface HeroSectionProps {
  onCtaClick: () => void;
}

// Sparkline miniature data
const sparkData = [
  { val: 10 }, { val: 15 }, { val: 12 }, { val: 24 }, { val: 18 }, { val: 32 }, { val: 28 }, { val: 45 }
];

// Miniature transactions data
const miniTransData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 80 },
  { name: 'Fri', value: 55 },
];

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Dynamic Glowing Accent Blobs to simulate reference image's blue gradient background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-[20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Visual Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold font-sans uppercase tracking-wider"
            >
              <Sparkles size={12} className="animate-pulse" />
              <span>Chosen by 50K+ organizations</span>
            </motion.div>

            {/* Display Heading matching the reference image's layout and font choices */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-display leading-[1.08]"
            >
              Secure Solutions <br />
              <span className="text-gradient dark:text-gradient-dark">for Financial Growth</span>
            </motion.h1>

            {/* Premium descriptive copy */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed"
            >
              We deliver secure and innovative financial solutions that help individuals and businesses grow their wealth with confidence. Maximize yields with AI insights and enterprise-grade asset protection.
            </motion.p>

            {/* Actions Block */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={onCtaClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/15 hover:shadow-blue-500/25 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <span>Start Investing Today</span>
                <ChevronRight size={18} />
              </button>

              <a
                href="#services"
                className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold transition-all flex items-center justify-center gap-1 text-base"
              >
                Learn More
              </a>
            </motion.div>

            {/* Overlapping ratings and avatars from reference image */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-900"
            >
              {/* Overlapping circles */}
              <div className="flex -space-x-3.5">
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="User" referrerPolicy="no-referrer" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="User" referrerPolicy="no-referrer" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="User" referrerPolicy="no-referrer" />
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-950 bg-blue-100 dark:bg-slate-900 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  +1k
                </div>
              </div>

              {/* Stars & Text */}
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-slate-400 font-medium font-sans">
                  Trusted rating from 10k+ verified retail investors
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right Hero Column: Dashboard mockups as seen in reference image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Background Glow behind the phone mockup */}
            <div className="absolute w-[110%] h-[110%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />

            {/* Phone Skeleton Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-[280px] sm:w-[310px] aspect-[9/19.5] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800/90 dark:border-slate-900"
            >
              {/* Dynamic Island Notch */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-900 rounded-full mr-2" />
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
              </div>

              {/* Internal Phone Viewport */}
              <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[38px] overflow-hidden relative flex flex-col justify-between p-5 text-slate-800 dark:text-slate-100 font-sans border border-slate-200 dark:border-slate-900">
                
                {/* Internal Phone Header */}
                <div className="flex justify-between items-center mt-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      N
                    </div>
                    <span className="text-xs font-bold font-display text-slate-900 dark:text-white">NovaX</span>
                  </div>
                  <div className="w-6 h-6 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" alt="Avatar" referrerPolicy="no-referrer" />
                  </div>
                </div>

                {/* Primary Card */}
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-40">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                  <div>
                    <span className="text-[10px] text-blue-100 uppercase font-bold tracking-wider">Simulated Balance</span>
                    <h3 className="text-2xl font-black mt-1 font-mono tracking-tight">$45,543.00</h3>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 text-[10px] text-blue-100">
                    <div>
                      <p>CARD HOLDER</p>
                      <p className="font-bold text-white uppercase mt-0.5">S. Bennett</p>
                    </div>
                    <span className="font-bold text-xs">VISA</span>
                  </div>
                </div>

                {/* Miniature Transactions Spark bars */}
                <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 p-4 rounded-2xl flex-1 flex flex-col justify-between max-h-[160px]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Activity</span>
                    <span className="text-[10px] font-bold text-emerald-500 font-mono">+12.4%</span>
                  </div>
                  <div className="h-20 w-full flex items-end justify-between gap-1.5 px-2">
                    {miniTransData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full bg-blue-100 dark:bg-slate-800 rounded-md relative overflow-hidden" style={{ height: '55px' }}>
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-md transition-all" style={{ height: `${d.value}%` }} />
                        </div>
                        <span className="text-[8px] text-slate-400 font-bold">{d.name.substring(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation Pills */}
                <div className="mt-4 flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 p-2.5 rounded-2xl text-[9px] font-bold text-slate-400">
                  <span className="text-blue-600">Overview</span>
                  <span>Portfolios</span>
                  <span>Analytics</span>
                  <span>Profile</span>
                </div>

              </div>
            </motion.div>

            {/* Floating Card 1: Left Balance widget */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute left-[-45px] sm:left-[-70px] top-[30%] z-20 w-[170px] sm:w-[190px] p-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
                  <TrendingUp size={12} />
                </div>
                <div>
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Dynamic Balance</h4>
                  <p className="text-sm font-black text-slate-900 dark:text-white font-mono">$50,550.50</p>
                </div>
              </div>
              <div className="h-8 w-full mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData}>
                    <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={1.5} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Floating Card 2: Right Recent Transactions as seen in visual reference */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute right-[-45px] sm:right-[-65px] top-[15%] z-20 w-[140px] sm:w-[155px] p-3.5 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl"
            >
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Performance Yield</p>
              <div className="h-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={miniTransData}>
                    <Bar dataKey="value" fill="#4F46E5" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[8px] font-bold text-slate-500">
                <span>Active Vault</span>
                <span className="text-emerald-500 font-mono font-bold">+28.5%</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
