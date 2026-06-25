import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, ShieldAlert, BarChart3 } from 'lucide-react';

export default function StatisticsSection() {
  const stats = [
    {
      value: '$500M+',
      label: 'Assets Under Custody',
      desc: 'Secured across tier-1 banking institutions',
      icon: <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
    },
    {
      value: '50K+',
      label: 'Active Global Investors',
      desc: 'In over 120 countries worldwide',
      icon: <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
    },
    {
      value: '98%',
      label: 'Client Retention Rate',
      desc: 'Industry-leading service score rating',
      icon: <Award size={20} className="text-emerald-600 dark:text-emerald-400" />
    },
    {
      value: '15 Yrs',
      label: 'Historical Experience',
      desc: 'Proven market cycles and robust compliance',
      icon: <ShieldAlert size={20} className="text-purple-600 dark:text-purple-400" />
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative blurred backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-blue-500/5 dark:bg-blue-500/[0.03] rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 text-left space-y-4 hover:border-slate-200 dark:hover:border-slate-800 transition-all group"
            >
              {/* Icon wrapper */}
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100/30 dark:border-slate-800 group-hover:scale-105 transition-transform">
                {stat.icon}
              </div>

              {/* Data numbers */}
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400 leading-normal">
                  {stat.desc}
                </p>
              </div>

              {/* Micro visual bar */}
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
