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

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  // Initialize dark mode class on element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle successful login
  const handleLoginSuccess = (name: string, email: string, customUser?: UserType) => {
    if (customUser) {
      setUser(customUser);
    } else {
      setUser({
        name,
        email,
        balance: 0.00,
        invested: 0.00,
        returns: 0.00,
        history: [],
        portfolio: {}
      });
    }
    setIsLoginOpen(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
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
