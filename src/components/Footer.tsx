import React, { useState } from 'react';
import { Mail, Check, Shield, Lock, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 transition-colors duration-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper footer grids */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-900">
          
          {/* Column 1: Brand details */}
          <div className="md:col-span-4 space-y-6 text-left">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                N
              </div>
              <span className="text-xl font-extrabold tracking-tight font-display">NovaX</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs">
              NovaX is an institutional-grade digital investment architecture facilitating risk-adjusted growth portfolios and predictive AI asset modeling.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
              <Shield size={14} className="text-emerald-500" />
              <span>Full Custody Compliance</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-white transition-colors">Investment Planning</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Wealth Management</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Portfolio Analysis</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Retirement Accounts</a></li>
            </ul>
          </div>

          {/* Column 3: Platform links */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Executive Team</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Advisory Board</a></li>
              <li><a href="#home" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Investor Bulletin</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Subscribe to our weekly asset reviews, risk analysis projections, and system feature releases.
            </p>

            {subscribed ? (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-xl flex items-center gap-2 font-medium">
                <Check size={14} className="text-blue-400 stroke-[3]" />
                <span>Successfully added to investor newsletter!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    placeholder="investor@novax.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Lower footer: Legal disclaimer & copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-medium text-center sm:text-left">
          
          <div className="space-y-1">
            <p>© {currentYear} NovaX Technologies Inc. All simulated rights reserved.</p>
            <p className="max-w-2xl text-slate-700 leading-normal">
              Disclaimer: All account balances, transactions, deposit activities, indices, stock performance, and AI-generated insights displayed within this website are entirely sandbox simulations and do not reflect real monetary capital, actual financial instruments, or certified professional investment advice.
            </p>
          </div>

          <div className="flex gap-4 shrink-0 text-slate-500">
            <a href="#terms" className="hover:text-slate-400">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-400">Terms of Use</a>
          </div>

        </div>

      </div>
    </footer>
  );
}
