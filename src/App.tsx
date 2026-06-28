import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TrustedBy from './components/TrustedBy';
import ServicesSection from './components/ServicesSection';
import FeatureSection from './components/FeatureSection';
import HowItWorks from './components/HowItWorks';
import StatisticsSection from './components/StatisticsSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import DashboardSimulation from './components/DashboardSimulation';
import { User as UserType } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { loadUserData } from './lib/supabaseDb';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(() => {
    try {
      const saved = localStorage.getItem('novax_logged_in_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to restore user from localStorage:', e);
      return null;
    }
  });

  // Initialize dark mode class on element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Synchronize Supabase authentication state and session changes
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Check and restore active Supabase session on startup
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          loadUserData(session.user.id, session.user.email!).then((userData) => {
            if (userData) {
              const fullUser = { ...userData, id: session.user.id };
              setUser(fullUser);
              localStorage.setItem('novax_logged_in_user', JSON.stringify(fullUser));
            }
          });
        }
      });

      // 2. Listen to real-time authentication events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session && session.user) {
          const userData = await loadUserData(session.user.id, session.user.email!);
          if (userData) {
            const fullUser = { ...userData, id: session.user.id };
            setUser(fullUser);
            localStorage.setItem('novax_logged_in_user', JSON.stringify(fullUser));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('novax_logged_in_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (name: string, email: string, customUser?: UserType) => {
    let finalUser: UserType;
    if (customUser) {
      finalUser = customUser;
    } else {
      finalUser = {
        name,
        email,
        balance: 0.00,
        invested: 0.00,
        returns: 0.00,
        history: [],
        portfolio: {}
      };
    }
    setUser(finalUser);
    localStorage.setItem('novax_logged_in_user', JSON.stringify(finalUser));
    setIsLoginOpen(false);
  };

  // Handle updates inside the active dashboard simulation
  const handleUserUpdate = (updatedUser: UserType) => {
    setUser(updatedUser);
    localStorage.setItem('novax_logged_in_user', JSON.stringify(updatedUser));
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('novax_logged_in_user');
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
  };

  // Toggle theme callback
  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* If logged in, show the complete simulation dashboard */}
      {user ? (
        <DashboardSimulation 
          user={user} 
          onLogout={handleLogout} 
          isDark={isDark} 
          onToggleTheme={handleToggleTheme}
          onUserUpdate={handleUserUpdate}
        />
      ) : (
        /* Landing page matching visual structure */
        <div className="flex flex-col">
          {/* Header */}
          <Navbar 
            onLoginClick={() => setIsLoginOpen(true)} 
            isDark={isDark} 
            onToggleTheme={handleToggleTheme}
            isLoggedIn={false}
            onLogoutClick={handleLogout}
          />

          {/* Sections */}
          <HeroSection onCtaClick={() => setIsLoginOpen(true)} />
          <TrustedBy />
          <ServicesSection />
          <FeatureSection />
          <HowItWorks />
          <StatisticsSection />
          <TestimonialsSection />
          <FaqSection />
          <FinalCta onCtaClick={() => setIsLoginOpen(true)} />
          <Footer />
        </div>
      )}

      {/* Secure Login & Registration Modal Overlay */}
      {isLoginOpen && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onClose={() => setIsLoginOpen(false)} 
          isModal={true} 
        />
      )}

    </div>
  );
}
