import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, PieChart, Activity, Calendar, BarChart3, 
  ShieldCheck, ArrowRight, Sparkles, AlertCircle 
} from 'lucide-react';

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  growth: string;
  status: string;
}

export default function ServicesSection() {
  const services: ServiceItem[] = [
    {
      title: 'Investment Planning',
      description: 'Design structured asset roadmaps aligned with your custom risk tolerance thresholds and long-term liquidity targets.',
      icon: <PieChart size={24} className="text-blue-600 dark:text-blue-400" />,
      growth: '+18.2% avg',
      status: 'Active Optimize'
    },
    {
      title: 'Wealth Management',
      description: 'Exclusive custom allocations for high net-worth balances, leveraging private markets, yields, and alternative assets.',
      icon: <TrendingUp size={24} className="text-indigo-600 dark:text-indigo-400" />,
      growth: '+14.5% avg',
      status: 'Managed Vault'
    },
    {
      title: 'Portfolio Analysis',
      description: 'Continuous diagnostic audits assessing dynamic weights, sector exposures, and correlation metrics.',
      icon: <Activity size={24} className="text-emerald-600 dark:text-emerald-400" />,
      growth: 'Continuous scan',
      status: 'Diagnostic Live'
    },
    {
      title: 'Retirement Planning',
      description: 'Build robust tax-advantaged accounts designed to compound wealth safely across multiple decades.',
      icon: <Calendar size={24} className="text-amber-600 dark:text-amber-400" />,
      growth: 'Tax Safe',
      status: 'Long Term'
    },
    {
      title: 'Stock Investments',
      description: 'Direct institutional access to global equities, fractional share settlement, and real-time order execution.',
      icon: <BarChart3 size={24} className="text-purple-600 dark:text-purple-400" />,
      growth: '+22.4% volatility',
      status: 'Market Direct'
    },
    {
      title: 'Risk Assessment',
      description: 'Advanced statistical simulations evaluating drawdown expectations and hedging your portfolio against inflation.',
      icon: <ShieldCheck size={24} className="text-rose-600 dark:text-rose-400" />,
      growth: '99.9% stress-tested',
      status: 'Fully Hedged'
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden transition-colors duration-300">
      
      {/* Visual background details */}
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="text-left space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Investment Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Modern Investment Services <br />
              <span className="text-gradient dark:text-gradient-dark">with Real Value</span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md text-left md:text-right">
            We merge cutting-edge technology with high-caliber wealth management, unlocking access to elite, diversified institutional returns.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Highlight gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-blue-500/0 to-blue-500/5 rounded-full blur-xl group-hover:scale-150 transition-all duration-300" />

              <div>
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-slate-100/30 dark:border-slate-800">
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2.5">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Card Footer actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/60 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {service.status}
                  </span>
                  <span className="text-xs font-semibold text-emerald-500 font-mono mt-1">
                    {service.growth}
                  </span>
                </div>
                <button 
                  className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all flex items-center justify-center cursor-pointer group-hover:translate-x-0.5"
                  aria-label="View service details"
                >
                  <ArrowRight size={14} />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
