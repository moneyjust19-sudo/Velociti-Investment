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
  const handleLoginSuccess = (name: string, email: string) => {
    setUser({
      name,
      email,
      balance: 100000.00, // Pre-funded simulated capital
      invested: 45000.00,
      returns: 14.85,
      history: [
        {
          id: 'tx-1',
          type: 'deposit',
          amount: 50000.00,
          title: 'Linked Bank Account Deposit',
          date: '06/20/2026',
          status: 'completed'
        },
        {
          id: 'tx-2',
          type: 'investment',
          amount: 15000.00,
          title: 'Purchased S&P 500 ETF (VOO)',
          date: '06/21/2026',
          status: 'completed'
        },
        {
          id: 'tx-3',
          type: 'investment',
          amount: 10000.00,
          title: 'Purchased Apple Inc. (AAPL)',
          date: '06/22/2026',
          status: 'completed'
        },
        {
          id: 'tx-4',
          type: 'investment',
          amount: 20000.00,
          title: 'Purchased NVIDIA Corp. (NVDA)',
          date: '06/24/2026',
          status: 'completed'
        }
      ]
    });
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
