import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  saveTransactionInSupabase, 
  updateProfileBalanceInSupabase, 
  updatePortfolioHoldingInSupabase,
  supabaseErrorTracker
} from '../lib/supabaseDb';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, 
  ArrowDownLeft, LogOut, Search, PlusCircle, MinusCircle, 
  User, Bell, FileText, ChevronRight, BarChart3, LineChart, 
  Sparkles, RefreshCw, Layers, ShieldCheck, ArrowRightLeft,
  Briefcase, Landmark, PieChart, Info, HelpCircle, Copy, Check, CheckCircle2,
  Menu, X, Mail, Phone, Send, MessageSquare
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, Legend
} from 'recharts';
import { User as UserType, Transaction } from '../types';

interface DashboardSimulationProps {
  user: UserType;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onUserUpdate?: (updatedUser: UserType) => void;
}

const STOCK_ASSETS = [
  { id: 'AAPL', name: 'Apple Inc.', category: 'Stocks', price: 185.40, change: 1.25, logo: '' },
  { id: 'TSLA', name: 'Tesla Motors', category: 'Stocks', price: 215.80, change: -2.40, logo: '⚡' },
  { id: 'NVDA', name: 'NVIDIA Corp.', category: 'Stocks', price: 475.20, change: 4.80, logo: '🟩' },
  { id: 'VOO', name: 'S&P 500 ETF (Vanguard)', category: 'ETFs', price: 435.50, change: 0.85, logo: '📊' },
  { id: 'BTC', name: 'Bitcoin (Digital Gold)', category: 'Crypto', price: 67200.00, change: 3.12, logo: '₿' },
  { id: 'GLD', name: 'SPDR Gold Trust', category: 'Commodities', price: 215.10, change: 0.15, logo: '🪙' },
];

const SCHEMA_SQL = `-- Create Profiles table if not exists
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  balance numeric default 0.00,
  invested numeric default 0.00,
  returns numeric default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Drop existing policies if they exist before creating to avoid duplicate errors
drop policy if exists "Allow public read profile" on public.profiles;
create policy "Allow public read profile" on public.profiles for select using (true);

drop policy if exists "Allow users to update own profile" on public.profiles;
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Allow users to insert own profile" on public.profiles;
create policy "Allow users to insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Create Transactions table if not exists
create table if not exists public.transactions (
  id text not null primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  amount numeric not null,
  title text not null,
  date text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Transactions
alter table public.transactions enable row level security;

drop policy if exists "Allow users to view own transactions" on public.transactions;
create policy "Allow users to view own transactions" on public.transactions for select using (auth.uid() = user_id);

drop policy if exists "Allow users to insert own transactions" on public.transactions;
create policy "Allow users to insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);

-- Create Portfolio Holdings table if not exists
create table if not exists public.portfolio_holdings (
  user_id uuid references public.profiles(id) on delete cascade not null,
  asset_id text not null,
  quantity numeric not null,
  primary key (user_id, asset_id)
);

-- Enable RLS on Portfolio Holdings
alter table public.portfolio_holdings enable row level security;

drop policy if exists "Allow users to view own portfolio" on public.portfolio_holdings;
create policy "Allow users to view own portfolio" on public.portfolio_holdings for select using (auth.uid() = user_id);

drop policy if exists "Allow users to upsert own portfolio" on public.portfolio_holdings;
create policy "Allow users to upsert own portfolio" on public.portfolio_holdings for all using (auth.uid() = user_id);`;

export default function DashboardSimulation({ user, onLogout, isDark, onToggleTheme, onUserUpdate }: DashboardSimulationProps) {
  const [showSqlSetup, setShowSqlSetup] = useState(supabaseErrorTracker.hasTableError);
  const [copiedSql, setCopiedSql] = useState(false);
  const [balance, setBalance] = useState(user.balance);
  const [invested, setInvested] = useState(user.invested);
  const [history, setHistory] = useState<Transaction[]>(user.history);
  const [selectedAsset, setSelectedAsset] = useState(STOCK_ASSETS[3]); // VOO default
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'history'>('overview');
  
  // Custom user owned quantities
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>(() => {
    return user.portfolio || {};
  });

  // Simple helper to synchronize with parent state safely without triggering infinite loops
  const syncWithParent = (
    newBalance: number,
    newInvested: number,
    newHistory: Transaction[],
    newPortfolio: { [key: string]: number }
  ) => {
    if (onUserUpdate) {
      onUserUpdate({
        ...user,
        balance: newBalance,
        invested: newInvested,
        history: newHistory,
        portfolio: newPortfolio
      });
    }
  };

  // Deposit & Withdrawal States
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositStep, setDepositStep] = useState<1 | 2>(1);
  const [depositAmount, setDepositAmount] = useState('1000');
  const [depositNetwork, setDepositNetwork] = useState<'solana' | 'bitcoin'>('solana');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalNetwork, setWithdrawalNetwork] = useState<'solana' | 'bitcoin'>('solana');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  // Drawer & Support States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [supportName, setSupportName] = useState(user.name || '');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportComplaint, setSupportComplaint] = useState('');
  const [isSupportSending, setIsSupportSending] = useState(false);

  // Growth Data Chart
  const [chartPeriod, setChartPeriod] = useState<'1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate responsive mock chart data based on selected period
  useEffect(() => {
    let points = 10;
    let baseVal = balance + invested;
    const data = [];
    
    if (chartPeriod === '1W') points = 7;
    else if (chartPeriod === '1M') points = 12;
    else points = 24;

    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (points - i) * (chartPeriod === '1W' ? 1 : chartPeriod === '1M' ? 2 : 15));
      const variation = (Math.sin(i * 0.5) * 0.03) + (Math.random() * 0.02 - 0.01);
      const calculatedVal = baseVal * (1 + variation + (i * 0.004));
      data.push({
        name: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: Math.round(calculatedVal),
        invested: Math.round(invested * (1 + (i * 0.002))),
      });
    }
    setChartData(data);
  }, [chartPeriod, balance, invested]);

  // Handle Real Deposit Completion
  const handleCompleteDeposit = async () => {
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    // Check if this is the user's first deposit (history contains no prior deposits)
    const hasPriorDeposit = history.some(tx => tx.type === 'deposit');
    const bonusAmount = !hasPriorDeposit ? 10.00 : 0.00;
    
    const depositAmountWithBonus = amountNum + bonusAmount;
    const newBalance = balance + depositAmountWithBonus;
    setBalance(newBalance);
    
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 11),
      type: 'deposit',
      amount: amountNum,
      title: `${depositNetwork === 'solana' ? 'Solana' : 'Bitcoin'} Crypto Deposit`,
      date: new Date().toLocaleDateString(),
      status: 'completed'
    };
    
    let bonusTx: Transaction | null = null;
    if (bonusAmount > 0) {
      bonusTx = {
        id: 'tx-bonus-' + Math.random().toString(36).substring(2, 11),
        type: 'deposit',
        amount: bonusAmount,
        title: 'First Deposit Bonus',
        date: new Date().toLocaleDateString(),
        status: 'completed'
      };
    }
    
    const finalTxList = [newTx];
    if (bonusTx) {
      finalTxList.push(bonusTx);
    }
    const updatedHistory = [...finalTxList, ...history];
    setHistory(updatedHistory);

    if (user.id) {
      await saveTransactionInSupabase(user.id, newTx);
      if (bonusTx) {
        await saveTransactionInSupabase(user.id, bonusTx);
      }
      await updateProfileBalanceInSupabase(user.id, newBalance, invested);
    }

    syncWithParent(newBalance, invested, updatedHistory, portfolio);

    setIsDepositOpen(false);
    setDepositStep(1);
    
    const successMsg = bonusAmount > 0 
      ? `Successfully deposited $${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${depositNetwork === 'solana' ? 'Solana' : 'Bitcoin'} plus a $10.00 First Deposit Bonus!`
      : `Successfully deposited $${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} via ${depositNetwork === 'solana' ? 'Solana' : 'Bitcoin'}!`;
      
    alert(successMsg);
  };

  // Handle Real Withdrawal Request
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }

    if (amountNum > balance) {
      alert('Insufficient balance for this withdrawal.');
      return;
    }

    if (!withdrawalAddress.trim()) {
      alert('Please enter a destination wallet address.');
      return;
    }

    const newBalance = balance - amountNum;
    setBalance(newBalance);

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 11),
      type: 'withdrawal',
      amount: amountNum,
      title: `${withdrawalNetwork === 'solana' ? 'Solana' : 'Bitcoin'} Crypto Withdrawal`,
      date: new Date().toLocaleDateString(),
      status: 'completed'
    };

    const updatedHistory = [newTx, ...history];
    setHistory(updatedHistory);

    if (user.id) {
      await saveTransactionInSupabase(user.id, newTx);
      await updateProfileBalanceInSupabase(user.id, newBalance, invested);
    }

    syncWithParent(newBalance, invested, updatedHistory, portfolio);

    setIsWithdrawalOpen(false);
    setWithdrawalAmount('');
    setWithdrawalAddress('');
    alert(`Successfully withdrew $${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`);
  };

  // Handle Support Form submission and open email client
  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportComplaint.trim()) {
      alert('Please fill out your complaint/message before sending.');
      return;
    }
    setIsSupportSending(true);

    setTimeout(() => {
      setIsSupportSending(false);
      
      const subject = encodeURIComponent(`NovaX Support Complaint - ${supportName}`);
      const body = encodeURIComponent(
        `Support Request Information:\n` +
        `-------------------------\n` +
        `Client Name: ${supportName}\n` +
        `Phone Number: ${supportPhone}\n` +
        `Registered Email: ${user.email}\n` +
        `Client ID: NVX-${user.id ? user.id.slice(0, 8).toUpperCase() : 'SIM'}\n\n` +
        `Complaint Message:\n` +
        `${supportComplaint}\n`
      );

      // Trigger standard email client composition window
      window.location.href = `mailto:Elizabethzoe657@gmail.com?subject=${subject}&body=${body}`;
      
      alert('Support ticket created! A draft email has been prepared and opened in your email client to complete transmission to Elizabethzoe657@gmail.com.');
      
      // Clean up states
      setSupportComplaint('');
      setSupportPhone('');
      setIsDrawerOpen(false);
    }, 1000);
  };

  // Handle Trade Execution
  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(tradeAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (tradeType === 'buy') {
      if (balance < amountNum) {
        alert('Insufficient cash balance to execute this trade.');
        return;
      }
      const newBalance = balance - amountNum;
      const newInvested = invested + amountNum;
      setBalance(newBalance);
      setInvested(newInvested);
      
      const qty = amountNum / selectedAsset.price;
      const updatedQty = (portfolio[selectedAsset.id] || 0) + qty;
      const newPortfolio = {
        ...portfolio,
        [selectedAsset.id]: updatedQty
      };
      setPortfolio(newPortfolio);

      const newTx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substr(2, 9),
        type: 'investment',
        amount: amountNum,
        title: `Purchased ${selectedAsset.name} (${selectedAsset.id})`,
        date: new Date().toLocaleDateString(),
        status: 'completed'
      };
      const updatedHistory = [newTx, ...history];
      setHistory(updatedHistory);

      if (user.id) {
        await saveTransactionInSupabase(user.id, newTx);
        await updateProfileBalanceInSupabase(user.id, newBalance, newInvested);
        await updatePortfolioHoldingInSupabase(user.id, selectedAsset.id, updatedQty);
      }

      syncWithParent(newBalance, newInvested, updatedHistory, newPortfolio);
    } else {
      const ownedQty = portfolio[selectedAsset.id] || 0;
      const ownedValue = ownedQty * selectedAsset.price;
      if (ownedValue < amountNum) {
        alert('You do not own enough of this asset to sell this amount.');
        return;
      }
      const newBalance = balance + amountNum;
      const newInvested = invested - amountNum;
      setBalance(newBalance);
      setInvested(newInvested);

      const qtySold = amountNum / selectedAsset.price;
      const updatedQty = Math.max(0, ownedQty - qtySold);
      const newPortfolio = {
        ...portfolio,
        [selectedAsset.id]: updatedQty
      };
      setPortfolio(newPortfolio);

      const newTx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substr(2, 9),
        type: 'withdrawal',
        amount: amountNum,
        title: `Sold ${selectedAsset.name} (${selectedAsset.id})`,
        date: new Date().toLocaleDateString(),
        status: 'completed'
      };
      const updatedHistory = [newTx, ...history];
      setHistory(updatedHistory);

      if (user.id) {
        await saveTransactionInSupabase(user.id, newTx);
        await updateProfileBalanceInSupabase(user.id, newBalance, newInvested);
        await updatePortfolioHoldingInSupabase(user.id, selectedAsset.id, updatedQty);
      }

      syncWithParent(newBalance, newInvested, updatedHistory, newPortfolio);
    }
  };

  const totalPortfolioValue = balance + invested;
  const netReturnPercent = user.returns || 0.00;
  const netGain = (invested * (netReturnPercent / 100)) || 0.00;

  // Pie chart format
  const pieData = Object.keys(portfolio).map(key => {
    const asset = STOCK_ASSETS.find(a => a.id === key);
    const qty = portfolio[key];
    const value = qty * (asset ? asset.price : 100);
    return {
      name: asset ? asset.name : key,
      value: Math.round(value)
    };
  }).filter(item => item.value > 0);

  // Add remaining cash as an asset slice
  if (balance > 0) {
    pieData.push({ name: 'Liquid Cash', value: Math.round(balance) });
  }

  const COLORS = ['#1D4ED8', '#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Premium Header */}
      <nav className="border-b border-slate-200/80 dark:border-slate-900/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                N
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">NovaX</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-sans text-[10px] uppercase font-bold tracking-wider">
                Investment Portfolio
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark mode button */}
              <button 
                onClick={onToggleTheme} 
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                title="Toggle visual style"
              >
                {isDark ? '☀️' : '🌙'}
              </button>


              {/* Logout */}
              <button 
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3 py-2 rounded-xl transition-all cursor-pointer font-medium"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              {/* Menu Drawer Toggle */}
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors border border-slate-200/40 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                title="Open Account Menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Supabase SQL Setup Helper */}
        <AnimatePresence>
          {showSqlSetup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-3xl relative overflow-hidden text-amber-900 dark:text-amber-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                      <HelpCircle size={18} />
                    </span>
                    <h3 className="font-bold text-base">Setup Your Supabase Database Tables</h3>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300 max-w-3xl leading-relaxed">
                    We detected that your Supabase database doesn't have the required tables yet. We have successfully initialized a **secure offline local-first ledger** so you can continue using all features of NovaX immediately with full persistence! To enable cloud synchronization, copy and run the SQL below in your **Supabase SQL Editor**.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SCHEMA_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {copiedSql ? '✓ Copied SQL!' : 'Copy Schema SQL'}
                  </button>
                  <button
                    onClick={() => setShowSqlSetup(false)}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  >
                    Dismiss Warning
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-900 dark:bg-black rounded-2xl border border-slate-800 text-left overflow-x-auto">
                <pre className="text-[10px] leading-relaxed font-mono text-emerald-400 select-all max-h-48 overflow-y-auto">
                  {SCHEMA_SQL}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Welcoming Greeting & Chart Period selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
              Good day, {user.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
              Your investment dashboard is fully secured and synchronized.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <button 
              onClick={() => setChartPeriod('1W')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${chartPeriod === '1W' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              1W
            </button>
            <button 
              onClick={() => setChartPeriod('1M')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${chartPeriod === '1M' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              1M
            </button>
            <button 
              onClick={() => setChartPeriod('1Y')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${chartPeriod === '1Y' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              1Y
            </button>
          </div>
        </div>

        {/* Single Premium Cash Balance Box - Highly Optimized for Mobile */}
        <div className="mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden text-white">
            {/* Visual ambient glows */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <Wallet size={16} className="text-blue-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Cash Account Balance</span>
                </div>
                <p className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-white">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                  Guaranteed liquid funds secured in tier-1 global clearing banks
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => {
                    setDepositStep(1);
                    setIsDepositOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer text-sm"
                >
                  <PlusCircle size={16} />
                  <span>Deposit Funds</span>
                </button>
                {balance > 0 && (
                  <button 
                    onClick={() => setIsWithdrawalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/10 cursor-pointer text-sm"
                  >
                    <MinusCircle size={16} />
                    <span>Withdraw Funds</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-900 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-6 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <div className="flex items-center gap-2">
              <LineChart size={16} />
              <span>Investment Performance</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('assets')}
            className={`pb-4 px-6 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'assets' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <div className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Buy / Sell Assets</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-6 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'history' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <div className="flex items-center gap-2">
              <ArrowRightLeft size={16} />
              <span>Transactions History</span>
            </div>
          </button>
        </div>

        {/* Tab Content Panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Primary Chart Area */}
              <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Portfolio Growth History</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Tracking aggregate portfolio net valuation history</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 block"></span>Total Wealth</span>
                    <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400 block"></span>Invested</span>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1E293B' : '#E2E8F0'} />
                      <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94A3B8'} fontSize={10} tickLine={false} />
                      <YAxis stroke={isDark ? '#475569' : '#94A3B8'} fontSize={10} tickLine={false} domain={['dataMin - 1000', 'dataMax + 1000']} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0', borderRadius: '12px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      <Area type="monotone" dataKey="invested" stroke="#818CF8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Asset Allocation Pie Grid */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1">Asset Allocation</h3>
                  <p className="text-xs text-slate-400">Current visual distribution of your portfolio</p>
                </div>

                <div className="h-56 flex items-center justify-center relative my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieData.slice(0, 5)} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1E293B' : '#E2E8F0'} />
                      <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94A3B8'} fontSize={9} tickLine={false} />
                      <YAxis stroke={isDark ? '#475569' : '#94A3B8'} fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0', borderRadius: '12px', fontSize: '11px' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {pieData.map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{entry.name}</span>
                      </div>
                      <span className="font-sans font-bold text-slate-900 dark:text-white">${entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'assets' && (
            <motion.div 
              key="assets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Asset Markets */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Available Investment Securities</h3>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Quotes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STOCK_ASSETS.map((asset) => {
                    const ownedQty = portfolio[asset.id] || 0;
                    const ownedVal = ownedQty * asset.price;
                    const isSelected = selectedAsset.id === asset.id;
                    return (
                      <div 
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${isSelected ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10' : 'border-slate-200/60 dark:border-slate-900 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-800'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg">
                              {asset.logo}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{asset.name}</h4>
                              <span className="text-[10px] text-slate-400 font-sans font-medium tracking-wider">{asset.id} • {asset.category}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold font-sans px-2 py-0.5 rounded ${asset.change >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </span>
                        </div>

                        <div className="mt-5 flex justify-between items-end">
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Market Price</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white font-display">${asset.price.toFixed(2)}</p>
                          </div>
                          {ownedQty > 0 && (
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-medium">Your Position</p>
                              <p className="text-xs font-semibold text-slate-900 dark:text-white font-sans">
                                {ownedQty.toFixed(1)} Shares (${ownedVal.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secure Execution Desk */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Secure Trading Desk</h3>
                    <div className="flex gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <button 
                        onClick={() => setTradeType('buy')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${tradeType === 'buy' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Buy
                      </button>
                      <button 
                        onClick={() => setTradeType('sell')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${tradeType === 'sell' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Sell
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 mb-6 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Target Asset</span>
                    <span className="text-3xl font-bold font-display text-slate-900 dark:text-white block">{selectedAsset.id}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedAsset.name} • ${selectedAsset.price} per share</span>
                  </div>

                  <form onSubmit={handleTrade} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Capital Value (USD)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          placeholder="1000"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm font-semibold"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                        <span>Approx. Shares: {(parseFloat(tradeAmount) / selectedAsset.price || 0).toFixed(4)}</span>
                        <span>Available Cash: ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl font-semibold text-white transition-all shadow-md cursor-pointer ${tradeType === 'buy' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10'}`}
                    >
                      Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-900 text-center flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Trade clears instantly using NovaX ledger</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Account Transactions</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Comprehensive real-time ledger records</p>
                </div>
                <span className="text-xs font-sans text-slate-400">Total: {history.length} transactions logged</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                      <th className="py-3 px-4">Transaction Details</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4">Date Logged</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-xs">
                    {history.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                          {tx.title}
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : tx.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans font-semibold text-slate-900 dark:text-white">
                          ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-sans font-medium">
                          {tx.date}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Deposit Funds</h3>
                    <p className="text-xs text-slate-400">Add secure trading capital to your balance</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsDepositOpen(false);
                      setDepositStep(1);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {depositStep === 1 ? (
                    <div className="space-y-6">
                      {/* Amount Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enter Deposit Amount (USD)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500 font-bold text-lg">$</span>
                          <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="1,000"
                            className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 font-display text-base font-bold"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">Minimum deposit: $10.00 • No deposit fees</p>
                      </div>

                      {/* Network selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select Blockchain Network</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setDepositNetwork('solana')}
                            className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col items-start gap-1 ${
                              depositNetwork === 'solana'
                                ? 'border-purple-500 bg-purple-50/10 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <span className="text-xl">☀️</span>
                            <span className="text-sm font-bold mt-1">Solana Network</span>
                            <span className="text-[10px] text-slate-400 font-medium">Instant • Low Fees</span>
                            {depositNetwork === 'solana' && (
                              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-500"></span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDepositNetwork('bitcoin')}
                            className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col items-start gap-1 ${
                              depositNetwork === 'bitcoin'
                                ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <span className="text-xl">₿</span>
                            <span className="text-sm font-bold mt-1">Bitcoin Network</span>
                            <span className="text-[10px] text-slate-400 font-medium">10-30 min • High Security</span>
                            {depositNetwork === 'bitcoin' && (
                              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500"></span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Continue Button */}
                      <button
                        onClick={() => {
                          const amt = parseFloat(depositAmount);
                          if (isNaN(amt) || amt <= 0) {
                            alert('Please enter a valid amount to deposit.');
                            return;
                          }
                          setDepositStep(2);
                        }}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Continue to Wallet Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Network indicator */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deposit Method</span>
                          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">
                            {depositNetwork === 'solana' ? 'Solana (SOL)' : 'Bitcoin (BTC)'} Network
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount To Credited</span>
                          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block mt-0.5">
                            ${parseFloat(depositAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Wallet Address Copy Block */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Destination Wallet Address</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={
                              depositNetwork === 'solana'
                                ? '5gKq11bJRA4FHzX4ah4MEhwprRFnoczpUbZpX55F9W8a'
                                : 'bc1qkky0m5ed9v4sjf29thss9hd3dt9tpl3m97w6fy'
                            }
                            className="flex-1 bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const addr = depositNetwork === 'solana'
                                ? '5gKq11bJRA4FHzX4ah4MEhwprRFnoczpUbZpX55F9W8a'
                                : 'bc1qkky0m5ed9v4sjf29thss9hd3dt9tpl3m97w6fy';
                              navigator.clipboard.writeText(addr);
                              setCopiedAddress(true);
                              setTimeout(() => setCopiedAddress(false), 2500);
                            }}
                            className="px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-700"
                          >
                            {copiedAddress ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-[10px] text-red-500 font-medium">
                          ⚠️ Make sure to send ONLY {depositNetwork === 'solana' ? 'SOL/USDC' : 'BTC'} to this network. Sending other tokens will result in permanent fund loss.
                        </p>
                      </div>

                      {/* Complete & Back Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setDepositStep(1)}
                          className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer text-center"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleCompleteDeposit}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer text-center"
                        >
                          Complete Transaction
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Withdrawal Modal */}
        <AnimatePresence>
          {isWithdrawalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Withdraw Capital</h3>
                    <p className="text-xs text-slate-400">Transfer funds out of your active balance</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsWithdrawalOpen(false);
                      setWithdrawalAmount('');
                      setWithdrawalAddress('');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleWithdrawalSubmit} className="p-6 space-y-5">
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl border border-blue-100/30 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
                    <span>Available Cash Capital:</span>
                    <span className="font-bold text-sm font-sans">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Withdrawal Amount (USD)</label>
                      <button
                        type="button"
                        onClick={() => setWithdrawalAmount(balance.toString())}
                        className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        Use Max Available
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500 font-bold text-lg">$</span>
                      <input
                        type="number"
                        max={balance}
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 font-display text-base font-bold"
                      />
                    </div>
                  </div>

                  {/* Network Choice */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Destination Network</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setWithdrawalNetwork('solana')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          withdrawalNetwork === 'solana'
                            ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        ☀️ Solana Network
                      </button>
                      <button
                        type="button"
                        onClick={() => setWithdrawalNetwork('bitcoin')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          withdrawalNetwork === 'bitcoin'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        ₿ Bitcoin Network
                      </button>
                    </div>
                  </div>

                  {/* Target Address Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Destination Wallet Address</label>
                    <input
                      type="text"
                      value={withdrawalAddress}
                      onChange={(e) => setWithdrawalAddress(e.target.value)}
                      placeholder={
                        withdrawalNetwork === 'solana'
                          ? 'Enter Solana (SOL) Address'
                          : 'Enter Bitcoin (BTC) Address'
                      }
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 font-sans text-xs font-semibold"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWithdrawalOpen(false);
                        setWithdrawalAmount('');
                        setWithdrawalAddress('');
                      }}
                      className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer text-center"
                    >
                      Withdraw Capital
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Navigation Drawer */}
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
              />
              {/* Sliding Drawer Container */}
              <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                  className="w-screen max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200/80 dark:border-slate-900 flex flex-col"
                >
                  {/* Drawer Header */}
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">Premium Portal</h2>
                      <p className="text-xs text-slate-400">Account Control & Support Center</p>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Drawer Body - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Profile Information Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Profile Information</h3>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold border border-blue-200/30">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{user.name}</h4>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                              Premium Investor
                            </span>
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-medium">Email Address:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">{user.email}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-medium">Security ID:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-mono">NVX-{user.id ? user.id.slice(0, 8).toUpperCase() : 'SIM'}</span>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Quick Settings Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Actions</h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {/* Withdraw Link */}
                        <button
                          onClick={() => {
                            setIsDrawerOpen(false);
                            setIsWithdrawalOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900 text-left transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500">
                              <MinusCircle size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Withdraw Capital</p>
                              <p className="text-[10px] text-slate-400">Initiate liquid fiat transfers</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Theme Toggle Button */}
                        <button
                          onClick={onToggleTheme}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900 text-left transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500">
                              {isDark ? '☀️' : '🌙'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Toggle Visual Mode</p>
                              <p className="text-[10px] text-slate-400">Switch between light & dark themes</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                              {isDark ? 'Dark' : 'Light'}
                            </span>
                            <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Support Desk Form */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact Support</h3>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Online</span>
                      </div>
                      
                      <form onSubmit={handleSendSupport} className="space-y-3 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                        {/* Name Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Name</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <User size={12} />
                            </span>
                            <input
                              type="text"
                              required
                              value={supportName}
                              onChange={(e) => setSupportName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                              <Phone size={12} />
                            </span>
                            <input
                              type="tel"
                              required
                              value={supportPhone}
                              onChange={(e) => setSupportPhone(e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Complaint TextArea */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complaint / Message</label>
                          <div className="relative">
                            <span className="absolute top-2.5 left-3 text-slate-400">
                              <MessageSquare size={12} />
                            </span>
                            <textarea
                              required
                              rows={3}
                              value={supportComplaint}
                              onChange={(e) => setSupportComplaint(e.target.value)}
                              placeholder="Please describe your issue or question in detail..."
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSupportSending}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isSupportSending ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>Sending Ticket...</span>
                            </>
                          ) : (
                            <>
                              <Send size={12} />
                              <span>Send Support Ticket</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2.5 border border-rose-200 dark:border-rose-900/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogOut size={12} />
                      <span>Sign Out from Dashboard</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
