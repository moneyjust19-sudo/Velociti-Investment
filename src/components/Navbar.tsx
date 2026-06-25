import React, { useState } from 'react';
import { Menu, X, Shield, Moon, Sun, Lock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onLoginClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogoutClick: () => void;
}

export default function Navbar({ onLoginClick, isDark, onToggleTheme, isLoggedIn, userName, onLogoutClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo matching reference */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/10">
              V
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Velociti
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions Desk */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Visual Style Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Toggle visual layout"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Hi, <span className="text-slate-800 dark:text-slate-200 font-bold">{userName}</span>
                </span>
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 text-xs font-semibold text-rose-500 border border-rose-200 dark:border-rose-950/30 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Lock size={14} />
                  <span>Login</span>
                </button>

                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <span>Start Investing</span>
                  <ChevronRight size={15} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburguer Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              {menuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-3">
                {isLoggedIn ? (
                  <div className="space-y-2 px-3">
                    <p className="text-sm font-medium text-slate-500">
                      Logged in as <span className="font-bold text-slate-800 dark:text-white">{userName}</span>
                    </p>
                    <button
                      onClick={() => {
                        onLogoutClick();
                        setIsOpen(false);
                      }}
                      className="w-full text-center py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl font-bold text-sm"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setIsOpen(false);
                      }}
                      className="w-full py-2 px-3 text-center text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-blue-600"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setIsOpen(false);
                      }}
                      className="w-full py-2.5 px-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl"
                    >
                      Start Investing
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
