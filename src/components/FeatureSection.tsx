import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, Activity, Eye, Zap, 
  Sparkles, ChevronRight, TrendingUp, Compass, 
  HelpCircle, RefreshCw, BarChart2 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const liveMarketData = [
  { time: '10:00', price: 412.50 },
  { time: '11:00', price: 414.80 },
  { time: '12:00', price: 413.20 },
  { time: '13:00', price: 416.90 },
  { time: '14:00', price: 415.40 },
  { time: '15:00', price: 418.10 },
  { time: '16:00', price: 420.30 },
];

const weeklyData = [
  { name: 'Mon', value: 1200 },
  { name: 'Tue', value: 1900 },
  { name: 'Wed', value: 1400 },
  { name: 'Thu', value: 2500 },
  { name: 'Fri', value: 2200 },
  { name: 'Sat', value: 3100 },
  { name: 'Sun', value: 2800 },
];

export default function FeatureSection() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'security' | 'insights' | 'tracking'>('monitoring');

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching reference */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap size={12} />
            <span>Platform Highlights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Innovative Features for Modern <br />
            <span className="text-gradient dark:text-gradient-dark">Financial Services</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Experience our premium suite of analytics, automated risk management tools, and deep-learning insights tailored for high-conviction growth.
          </p>
        </div>

        {/* Double-column grid system reminiscent of the reference layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Interactive Micro-Dashboard Widgets & Charts */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
            
            {/* Real-time Transactions line chart widget */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Market Inflow Activity</h3>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">$420.30</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                  <TrendingUp size={12} />
                  <span>+1.85% Today</span>
                </div>
              </div>

              {/* Real-Time Area Chart */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveMarketData}>
                    <defs>
                      <linearGradient id="liveGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="price" stroke="#1D4ED8" strokeWidth={2.5} fillOpacity={1} fill="url(#liveGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] text-slate-400 font-bold">
                <span>SECURE DATASTREAM</span>
                <span>UPDATED SECONDS AGO</span>
              </div>
            </div>

            {/* Smart earnings tracking widget */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Weekly Wealth Accumulation</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Aggregate multi-asset growth performance</p>
                </div>
                <span className="text-xs font-bold font-mono text-indigo-500">$14.9K Active</span>
              </div>

              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column: Elaborate Feature Cards with structured content */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6 text-left">
            
            {/* Feature Block 1: Secure Transactions */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-sm hover:border-blue-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Lock size={20} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Secure Cryptographic Transactions
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Advanced end-to-end encryption keeps your investments and linked accounts fully secure. Enjoy automated multi-signature clearing ledgers that clear with extreme precision.
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Advanced RSA Encryption
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Multi-Factor Authentication
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Real-time Fraud Alerts
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Full Cold-Storage Vaults
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature Block 2: Real-Time Market Monitoring */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-sm hover:border-indigo-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Activity size={20} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Real-Time Market Monitoring
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Always stay updated with zero-latency quote streaming. Check your portfolio valuation indices anytime, receive custom margin warnings, and trace multi-exchange order logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Block 3: AI Investment Insights */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-sm hover:border-amber-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Artificial Intelligence Insights
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Benefit from neural-network portfolio scanning. Uncover smart risk allocation models and personalized diversification actions generated directly from current market dynamics.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
