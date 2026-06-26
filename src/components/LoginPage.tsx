import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Wallet, CheckCircle, Shield, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { loadUserData } from '../lib/supabaseDb';

interface LoginPageProps {
  onLoginSuccess: (name: string, email: string, customUser?: any) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export default function LoginPage({ onLoginSuccess, onClose, isModal = false }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDemoLogin = async (demoType: 'premium' | 'growth') => {
    setIsLoading(true);
    setError('');
    
    const demoEmail = demoType === 'premium' ? 'sophia.bennett@novax.io' : 'alexander.wright@grow.io';
    const demoName = demoType === 'premium' ? 'Sophia Bennett' : 'Alexander Wright';
    const demoPassword = 'DemoPassword123!';

    if (isSupabaseConfigured && supabase) {
      try {
        // Attempt to sign in
        let { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: demoEmail,
          password: demoPassword
        });

        if (signInError) {
          // If sign-in fails because user does not exist, attempt to sign up automatically
          if (signInError.message.includes('Invalid login credentials') || signInError.status === 400) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: demoEmail,
              password: demoPassword,
              options: { data: { name: demoName } }
            });

            if (signUpError) {
              throw signUpError;
            }
            data = signUpData;
          } else {
            throw signInError;
          }
        }

        if (data && data.user) {
          // Load User Data from Supabase
          const userData = await loadUserData(data.user.id, demoEmail);
          if (userData) {
            userData.id = data.user.id;
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => {
              onLoginSuccess(userData.name, userData.email, userData);
            }, 1200);
            return;
          }
        }
        throw new Error('Failed to retrieve user profile from Supabase');
      } catch (err: any) {
        console.error('Demo authentication error via Supabase:', err);
        setError(`Database Demo Error: ${err.message || err}`);
        setIsLoading(false);
      }
    } else {
      // Simulation mode
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          if (demoType === 'premium') {
            onLoginSuccess('Sophia Bennett', 'sophia.bennett@novax.io');
          } else {
            onLoginSuccess('Alexander Wright', 'alex.wright@grow.io');
          }
        }, 1200);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    if (isSupabaseConfigured && supabase) {
      try {
        if (isLogin) {
          // Supabase Sign In
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInError) throw signInError;

          if (data && data.user) {
            const userData = await loadUserData(data.user.id, email);
            if (userData) {
              userData.id = data.user.id;
              setIsLoading(false);
              setSuccess(true);
              setTimeout(() => {
                onLoginSuccess(userData.name, userData.email, userData);
              }, 1200);
              return;
            }
          }
          throw new Error('Failed to load user profile');
        } else {
          // Supabase Sign Up
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name
              }
            }
          });

          if (signUpError) throw signUpError;

          if (data && data.user) {
            // Also insert profile explicitly (just in case)
            const { error: profileError } = await supabase.from('profiles').upsert({
              id: data.user.id,
              name,
              email,
              balance: 0.00,
              invested: 0.00,
              returns: 0.00
            });

            if (profileError) {
              console.error('Error creating user profile in DB:', profileError);
            }

            const userData = await loadUserData(data.user.id, email);
            if (userData) {
              userData.id = data.user.id;
              setIsLoading(false);
              setSuccess(true);
              setTimeout(() => {
                onLoginSuccess(userData.name, userData.email, userData);
              }, 1200);
              return;
            }
          }
          throw new Error('Sign up completed but profile could not be initialized.');
        }
      } catch (err: any) {
        console.error('Authentication error:', err);
        setError(err.message || 'An error occurred during authentication.');
        setIsLoading(false);
      }
    } else {
      // Simulation mode
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess(isLogin ? (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)) : name, email);
        }, 1200);
      }, 1500);
    }
  };

  const formContent = (
    <div className="w-full max-w-md p-8 glass rounded-3xl shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95">
      {/* Decorative gradients */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle size={44} className="stroke-[2.5]" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white font-display">
              Authentication Successful
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xs">
              Initializing your secure investment environment and loading your portfolio...
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-mono">
              <Shield size={14} className="animate-pulse" />
              <span>SECURE END-TO-END CONNECTION ESTABLISHED</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium mb-3">
                <Shield size={12} />
                <span>NovaX Secure Gateway</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                {isLogin
                  ? 'Access your customized investment portfolios'
                  : 'Start building your financial future with smart analytics'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="Sophia Bennett"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="sophia@novax.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
                  {isLogin && (
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); setError('Password reset simulation sent to email!'); }} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In Securely' : 'Create My Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isLogin ? "New to NovaX? " : "Already have an account? "}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                {isLogin ? 'Create Free Account' : 'Sign In Now'}
              </button>
            </div>

            {/* Quick Demo Accounts */}
            <div className="mt-6 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center mb-2 tracking-wider uppercase">
                🚀 One-Click Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDemoLogin('premium')}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 hover:dark:bg-blue-950/20 border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
                >
                  <Sparkles size={12} className="text-amber-500" />
                  <span>Sophia (Premium)</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('growth')}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 hover:dark:bg-blue-950/20 border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
                >
                  <Wallet size={12} className="text-blue-500" />
                  <span>Alexander (Growth)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative"
        >
          {/* Close trigger */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          )}
          {formContent}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Visual glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      {formContent}
    </div>
  );
}
