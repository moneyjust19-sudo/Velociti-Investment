import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  const faqs: FAQItem[] = [
    {
      question: "How does Velociti protect my capital and investments?",
      answer: "We utilize multi-signature custodial architectures, state-of-the-art AES-256 end-to-end transport layer encryption, and secure linked bank authentication gateways. Your cash balances are protected by premium tier-1 clearing banks up to statutory clearing insurance limits."
    },
    {
      question: "Are these investment balances real or simulated?",
      answer: "On our public landing page, all transactions, deposits, and returns are generated within our high-fidelity, sandbox-simulated ledger environment. This allows users to trial advanced asset allocations, buy/sell real index assets, and trigger AI insights with zero capital risk."
    },
    {
      question: "How does the AI Investment Insight feature work?",
      answer: "Our neural insights model analyzes your current holdings, asset categories (Tech Mega-caps, Crypto, S&P 500), and available cash reserves relative to standard volatility benchmarks. It immediately highlights over-concentration risks and drafts tailored diversification recommendations."
    },
    {
      question: "Can I link multiple bank accounts to my profile?",
      answer: "Yes! In our secure dashboard, you can link multiple simulated bank accounts or deposit funds using virtual wire transfers, debit cards, or global clearinghouses instantly with zero lag."
    },
    {
      question: "What are the fees associated with investing?",
      answer: "Velociti is dedicated to democratization. There are zero account maintenance fees, zero management commissions on automated index portfolios, and zero trading fees on stock micro-shares."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={12} />
            <span>Support Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Frequently Asked <br />
            <span className="text-gradient dark:text-gradient-dark">Financial Queries</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Find immediate answers regarding platform security, custodial protection policies, and our advanced AI engine.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-150 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden transition-all duration-200"
              >
                {/* Trigger Button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-sm sm:text-base gap-4"
                >
                  <span className="font-display">{faq.question}</span>
                  <ChevronDown 
                    size={18} 
                    className={`transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} 
                  />
                </button>

                {/* Collapsible Answer block */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100/50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
