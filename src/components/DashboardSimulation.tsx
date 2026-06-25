import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, 
  ArrowDownLeft, LogOut, Search, PlusCircle, MinusCircle, 
  User, Bell, FileText, ChevronRight, BarChart3, LineChart, 
  Sparkles, RefreshCw, Layers, ShieldCheck, ArrowRightLeft,
  Briefcase, Landmark, PieChart, Info, HelpCircle
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
}

const STOCK_ASSETS = [
  { id: 'AAPL', name: 'Apple Inc.', category: 'Stocks', price: 185.40, change: 1.25, logo: '' },
  { id: 'TSLA', name: 'Tesla Motors', category: 'Stocks', price: 215.80, change: -2.40, logo: '⚡' },
  { id: 'NVDA', name: 'NVIDIA Corp.', category: 'Stocks', price: 475.20, change: 4.80, logo: '🟩' },
  { id: 'VOO', name: 'S&P 500 ETF (Vanguard)', category: 'ETFs', price: 435.50, change: 0.85, logo: '📊' },
  { id: 'BTC', name: 'Bitcoin (Digital Gold)', category: 'Crypto', price: 67200.00, change: 3.12, logo: '₿' },
  { id: 'GLD', name: 'SPDR Gold Trust', category: 'Commodities', price: 215.10, change: 0.15, logo: '🪙' },
];

export default function DashboardSimulation({ user, onLogout, isDark, onToggleTheme }: DashboardSimulationProps) {
  const [balance, setBalance] = useState(user.balance);
  const [invested, setInvested] = useState(user.invested);
  const [history, setHistory] = useState<Transaction[]>(user.history);
  const [selectedAsset, setSelectedAsset] = useState(STOCK_ASSETS[3]); // VOO default
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'insights' | 'history'>('overview');
  
  // Custom user owned quantities
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({
    'VOO': 15,
    'AAPL': 10,
    'NVDA': 5,
  });

  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string>('Welcome to your premium portfolio assistant. Click the button below to generate a deep strategic review of your current holdings based on market fluctuations.');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

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

  // Handle Simulated Quick Deposit
  const handleDeposit = () => {
    const amount = 5000;
    setBalance(prev => prev + amount);
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      type: 'deposit',
      amount,
      title: 'Linked Bank Transfer',
      date: new Date().toLocaleDateString(),
      status: 'completed'
    };
    setHistory(prev => [newTx, ...prev]);
  };

  // Handle Trade Execution
  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(tradeAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (tradeType === 'buy') {
      if (balance < amountNum) {
        alert('Insufficient cash balance to execute this trade.');
        return;
      }
      setBalance(prev => prev - amountNum);
      setInvested(prev => prev + amountNum);
      
      const qty = amountNum / selectedAsset.price;
      setPortfolio(prev => ({
        ...prev,
        [selectedAsset.id]: (prev[selectedAsset.id] || 0) + qty
      }));

      const newTx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substr(2, 9),
        type: 'investment',
        amount: amountNum,
        title: `Purchased ${selectedAsset.name} (${selectedAsset.id})`,
        date: new Date().toLocaleDateString(),
        status: 'completed'
      };
      setHistory(prev => [newTx, ...prev]);
    } else {
      const ownedQty = portfolio[selectedAsset.id] || 0;
      const ownedValue = ownedQty * selectedAsset.price;
      if (ownedValue < amountNum) {
        alert('You do not own enough of this asset to sell this amount.');
        return;
      }
      setBalance(prev => prev + amountNum);
      setInvested(prev => prev - amountNum);

      const qtySold = amountNum / selectedAsset.price;
      setPortfolio(prev => ({
        ...prev,
        [selectedAsset.id]: Math.max(0, ownedQty - qtySold)
      }));

      const newTx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substr(2, 9),
        type: 'withdrawal',
        amount: amountNum,
        title: `Sold ${selectedAsset.name} (${selectedAsset.id})`,
        date: new Date().toLocaleDateString(),
        status: 'completed'
      };
      setHistory(prev => [newTx, ...prev]);
    }
  };

  // Simulate AI insight generation
  const generateInsights = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      const totalWealth = balance + invested;
      const stockWeight = ((portfolio['AAPL'] || 0) * 185.4 + (portfolio['NVDA'] || 0) * 475.2) / (invested || 1);
      
      let insightText = '';
      if (stockWeight > 0.4) {
        insightText = `📈 Strategic Review for ${user.name}: Your portfolio shows high concentration in tech-heavy mega-caps like NVDA and AAPL (approximately ${(stockWeight * 100).toFixed(0)}% of investments). While tech sectors are rallying due to high computing demand, we recommend balancing your risk by accumulating more S&P 500 ETF (VOO) or allocating 5% into gold (GLD) to protect against interest rate fluctuations. Your current liquid reserve of $${balance.toLocaleString()} is optimal.`;
      } else {
        insightText = `🛡️ Strategic Review for ${user.name}: Outstanding diversification! Your core holdings in index ETFs like VOO provide a highly resilient foundation for financial growth. Since you have $${balance.toLocaleString()} in liquid cash, you might consider starting a Dollar-Cost-Averaging (DCA) strategy to buy small shares of high-conviction growth equities (e.g. NVDA) on pullbacks, enhancing long-term capital appreciation.`;
      }
      setAiInsight(insightText);
    }, 1500);
  };

  const totalPortfolioValue = balance + invested;
  const netReturnPercent = 14.85;

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
                V
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Velociti</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                Simulated Portfolios
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

              {/* User badge */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-900 bg-slate-50 dark:bg-slate-900">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 tracking-tight leading-none mt-0.5">Premium Investor</p>
                </div>
              </div>

              {/* Logout */}
              <button 
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3 py-2 rounded-xl transition-all cursor-pointer font-medium"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Welcoming Greeting & Quick Deposit */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Good day, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Your investment portfolios are secured and showing healthy growth signals today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDeposit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer text-sm"
            >
              <PlusCircle size={16} />
              <span>Simulate $5,000 Deposit</span>
            </button>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
              <button 
                onClick={() => setChartPeriod('1W')} 
                className={`px-3 py-1 text-xs rounded-md cursor-pointer transition-colors ${chartPeriod === '1W' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
              >
                1W
              </button>
              <button 
                onClick={() => setChartPeriod('1M')} 
                className={`px-3 py-1 text-xs rounded-md cursor-pointer transition-colors ${chartPeriod === '1M' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
              >
                1M
              </button>
              <button 
                onClick={() => setChartPeriod('1Y')} 
                className={`px-3 py-1 text-xs rounded-md cursor-pointer transition-colors ${chartPeriod === '1Y' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
              >
                1Y
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Cash Balance */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Simulated Cash Reserve</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Wallet size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <ArrowUpRight size={14} />
              <span>Ready to Invest</span>
            </div>
          </div>

          {/* Invested Funds */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invested Capital</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Briefcase size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              ${invested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <TrendingUp size={14} />
              <span>Active Portfolios</span>
            </div>
          </div>

          {/* Total Net Worth */}
          <div className="p-6 bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden text-white">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Net Wealth</span>
              <div className="w-8 h-8 rounded-xl bg-white/10 text-blue-400 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold font-mono text-white">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <ArrowUpRight size={14} />
              <span>Combined Position</span>
            </div>
          </div>

          {/* Average Yield */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">All-Time Returns</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              +{netReturnPercent}%
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
              <span>+$14,242.45 Net Gain</span>
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
            onClick={() => setActiveTab('insights')}
            className={`pb-4 px-6 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'insights' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span>AI Investment Insights</span>
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
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Simulated Wealth Projection</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Tracking aggregate portfolio valuation adjustments</p>
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
                      <span className="font-mono font-bold">${entry.value.toLocaleString()}</span>
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
                              <span className="text-[10px] text-slate-400 font-mono tracking-wider">{asset.id} • {asset.category}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${asset.change >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </span>
                        </div>

                        <div className="mt-5 flex justify-between items-end">
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Market Price</p>
                            <p className="text-lg font-extrabold text-slate-800 dark:text-slate-200 font-mono">${asset.price.toFixed(2)}</p>
                          </div>
                          {ownedQty > 0 && (
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-medium">Your Position</p>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
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
                    <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white block">{selectedAsset.id}</span>
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
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-mono text-sm"
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
                  <span>Trade clears instantly using Velociti ledger</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-3xl shadow-sm relative overflow-hidden"
            >
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

              <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <Sparkles size={14} className="animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Velociti AI Advisor • Active Analysis</span>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                  Strategic Artificial Intelligence Insight Engine
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Our advanced neural model analyzes your simulated asset concentrations, cash reserves, and market volatility indexes to generate bespoke diversification warnings and target opportunities.
                </p>

                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-left relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-xs text-slate-300 dark:text-slate-700 font-mono">
                    MODEL: VELOCITI-AI-PRO
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {aiInsight}
                  </p>
                </div>

                <button
                  onClick={generateInsights}
                  disabled={isGeneratingAi}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Synthesizing Holdings Analysis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Generate Fresh Strategic Advice</span>
                    </>
                  )}
                </button>
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
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Simulated Clearing Ledger</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Instant ledger clearing verification registry</p>
                </div>
                <span className="text-xs font-mono text-slate-400">Total: {history.length} transactions logged</span>
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
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">
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

      </main>
    </div>
  );
}
