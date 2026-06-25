import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Landmark, Compass, ShieldCheck, Mail, Sparkles, MessageSquare } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Open Your Account',
      description: 'Register and set up your personal investor profile to gain instant access to custom builders.',
      icon: <UserCheck size={18} className="text-blue-600 dark:text-blue-400" />
    },
    {
      id: '02',
      title: 'Deposit Funds Securely',
      description: 'Easily link your bank account or deposit liquidity using multiple safe payment gateways.',
      icon: <Landmark size={18} className="text-indigo-600 dark:text-indigo-400" />
    },
    {
      id: '03',
      title: 'Invest & Grow Strategy',
      description: 'Select from our wide range of institutional-grade securities, ETFs, or index options.',
      icon: <Compass size={18} className="text-emerald-600 dark:text-emerald-400" />
    },
    {
      id: '04',
      title: 'Monitor & Manage Portfolio',
      description: 'Track aggregate yields, generate customized AI strategic reviews, and adjust allocations.',
      icon: <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center md:text-left max-w-3xl mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Success Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Guided Financial Steps <br />
            <span className="text-gradient dark:text-gradient-dark">for Your Success</span>
          </h2>
        </div>

        {/* Dual Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium visual representing personal wealth managers (Sophia Bennett as seen in reference image) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            
            {/* Elegant glass profile mockup matching Sophia Bennett reference */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-left"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 bg-blue-50">
                <img 
                  className="w-full h-full object-cover object-top filter contrast-[1.02]" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" 
                  alt="Sophia Bennett" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-[9px] font-bold text-white tracking-widest uppercase">
                  ONLINE ADVISOR
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sophia Bennett</h3>
                <p className="text-xs text-slate-400 font-medium">Head of Investment Relations, Velociti</p>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                "Our dedicated advisory team ensures your onboarding transition is smooth, compliant, and optimized for immediate wealth execution."
              </p>

              <div className="flex gap-2 mt-5">
                <button className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <MessageSquare size={13} />
                  <span>Live Chat</span>
                </button>
                <button className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <Mail size={13} />
                  <span>Book Call</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Progressive steps with side timeline lines */}
          <div className="lg:col-span-7 space-y-8 relative">
            {/* Vertical timeline connector */}
            <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex gap-5 items-start relative z-10 text-left group"
              >
                {/* Timeline circle badge */}
                <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors shrink-0">
                  {step.icon}
                </div>

                {/* Content block */}
                <div className="space-y-1 pt-1.5">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                    PHASE {step.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
