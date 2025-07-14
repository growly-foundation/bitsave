'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import { UserInteraction } from '@/lib/interactionTracker';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

// Chart component for analytics
const SimpleChart = ({ data, title, color }: { data: Array<{label: string, value: number}>, title: string, color: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={`h-2 rounded-full ${color}`}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 min-w-[2rem]">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Time-based activity chart
const ActivityChart = ({ interactions }: { interactions: UserInteraction[] }) => {
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const count = interactions.filter(i => {
      const interactionHour = new Date(i.timestamp).getHours();
      return interactionHour === hour;
    }).length;
    return { hour, count };
  });
  
  const maxCount = Math.max(...hourlyData.map(d => d.count));
  
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">24-Hour Activity Pattern</h3>
      <div className="flex items-end justify-between h-32 space-x-1">
        {hourlyData.map((data, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: maxCount > 0 ? `${(data.count / maxCount) * 100}%` : '2px' }}
            transition={{ delay: index * 0.02, duration: 0.6 }}
            className="bg-gradient-to-t from-[#81D7B4] to-blue-400 rounded-t-sm min-h-[2px] flex-1 relative group"
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {data.hour}:00 - {data.count} events
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bitsave2024admin'; // In production, use environment variables

export default function UserInteractionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'type'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchInteractions();
    } else {
      setError('Invalid password');
    }
  };

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user-interactions');
      if (response.ok) {
        const data = await response.json();
        setInteractions(data);
      } else {
        setError('Failed to fetch interactions');
      }
    } catch {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const filteredInteractions = interactions
    .filter(interaction => {
      if (filter === 'all') return true;
      return interaction.type === filter;
    })
    .filter(interaction => {
      if (!searchTerm) return true;
      return (
        interaction.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(interaction.data).toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = sortBy === 'timestamp' ? new Date(a.timestamp).getTime() : a.type;
      const bValue = sortBy === 'timestamp' ? new Date(b.timestamp).getTime() : b.type;
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet_connect':
        return '🔗';
      case 'wallet_disconnect':
        return '🔌';
      case 'savings_created':
        return '💰';
      case 'page_visit':
        return '👁️';
      case 'transaction':
        return '💸';
      case 'error':
        return '❌';
      default:
        return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wallet_connect':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'wallet_disconnect':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'savings_created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'page_visit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'transaction':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Enhanced statistics with trends and insights
  const calculateTrend = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${Math.round(change)}%`;
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  const todayInteractions = interactions.filter(i => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= today;
  });

  const yesterdayInteractions = interactions.filter(i => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= yesterday && interactionDate < today;
  });

  const thisWeekInteractions = interactions.filter(i => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= thisWeekStart;
  });

  const lastWeekInteractions = interactions.filter(i => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= lastWeekStart && interactionDate < thisWeekStart;
  });

  const stats = {
    total: interactions.length,
    walletConnects: interactions.filter(i => i.type === 'wallet_connect').length,
    savingsCreated: interactions.filter(i => i.type === 'savings_created').length,
    transactions: interactions.filter(i => i.type === 'transaction').length,
    uniqueWallets: new Set(interactions.filter(i => i.walletAddress).map(i => i.walletAddress)).size,
    pageVisits: interactions.filter(i => i.type === 'page_visit').length,
    errors: interactions.filter(i => i.type === 'error').length,
    todayInteractions: todayInteractions.length,
    thisWeekInteractions: thisWeekInteractions.length,
    // Previous period data for trend calculation
    yesterdayInteractions: yesterdayInteractions.length,
    lastWeekInteractions: lastWeekInteractions.length,
    previousWalletConnects: lastWeekInteractions.filter(i => i.type === 'wallet_connect').length,
    previousSavingsCreated: lastWeekInteractions.filter(i => i.type === 'savings_created').length,
    previousUniqueWallets: new Set(lastWeekInteractions.filter(i => i.walletAddress).map(i => i.walletAddress)).size,
  };

  // Data for charts
  const typeDistribution = [
    { label: 'Wallet Connects', value: stats.walletConnects },
    { label: 'Savings Created', value: stats.savingsCreated },
    { label: 'Transactions', value: stats.transactions },
    { label: 'Page Visits', value: stats.pageVisits },
    { label: 'Errors', value: stats.errors },
  ].filter(item => item.value > 0);

  const dailyActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayInteractions = interactions.filter(interaction => {
      const interactionDate = new Date(interaction.timestamp);
      return interactionDate.toDateString() === date.toDateString();
    }).length;
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayInteractions
    };
  }).reverse();

  if (!isAuthenticated) {
    return (
      <div className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4`}>
        <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#81D7B4] to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-300">Enter password to view user interactions</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent backdrop-blur-sm"
              />
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-[#81D7B4] to-blue-400 text-white font-semibold rounded-xl hover:from-[#6bc4a1] hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Access Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}>
      <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
      
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 font-medium">Real-time user behavior insights • BitSave Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          {[
          { 
            label: 'Total Events', 
            value: stats.total, 
            icon: '📊', 
            color: 'from-blue-500 to-blue-600', 
            trend: calculateTrend(stats.thisWeekInteractions, stats.lastWeekInteractions)
          },
          { 
            label: 'Today', 
            value: stats.todayInteractions, 
            icon: '📅', 
            color: 'from-emerald-500 to-emerald-600', 
            trend: calculateTrend(stats.todayInteractions, stats.yesterdayInteractions)
          },
          { 
            label: 'Wallet Connects', 
            value: stats.walletConnects, 
            icon: '🔗', 
            color: 'from-green-500 to-green-600', 
            trend: calculateTrend(thisWeekInteractions.filter(i => i.type === 'wallet_connect').length, stats.previousWalletConnects)
          },
          { 
            label: 'Savings Created', 
            value: stats.savingsCreated, 
            icon: '💰', 
            color: 'from-[#81D7B4] to-green-500', 
            trend: calculateTrend(thisWeekInteractions.filter(i => i.type === 'savings_created').length, stats.previousSavingsCreated)
          },
          { 
            label: 'Unique Wallets', 
            value: stats.uniqueWallets, 
            icon: '👥', 
            color: 'from-purple-500 to-purple-600', 
            trend: calculateTrend(new Set(thisWeekInteractions.filter(i => i.walletAddress).map(i => i.walletAddress)).size, stats.previousUniqueWallets)
          },
          { 
            label: 'This Week', 
            value: stats.thisWeekInteractions, 
            icon: '📈', 
            color: 'from-indigo-500 to-indigo-600', 
            trend: calculateTrend(stats.thisWeekInteractions, stats.lastWeekInteractions)
          },
        ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ActivityChart interactions={interactions} />
          <SimpleChart 
            data={typeDistribution} 
            title="Interaction Types Distribution" 
            color="bg-gradient-to-r from-[#81D7B4] to-blue-400" 
          />
        </div>

        {/* Weekly Activity Chart */}
        <div className="mb-8">
          <SimpleChart 
            data={dailyActivity} 
            title="7-Day Activity Trend" 
            color="bg-gradient-to-r from-purple-500 to-pink-500" 
          />
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filter & Search</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing {filteredInteractions.length} of {interactions.length} interactions</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">📊 Filter by Type</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <option value="all">🌐 All Types</option>
                <option value="wallet_connect">🔗 Wallet Connect</option>
                <option value="wallet_disconnect">🔌 Wallet Disconnect</option>
                <option value="savings_created">💰 Savings Created</option>
                <option value="page_visit">👁️ Page Visit</option>
                <option value="transaction">💸 Transaction</option>
                <option value="error">❌ Error</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">🔍 Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search wallet, type, or data..."
                  className="w-full px-4 py-3 pl-10 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">📋 Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'type')}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <option value="timestamp">⏰ Timestamp</option>
                <option value="type">🏷️ Type</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">🔄 Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <option value="desc">⬇️ Newest First</option>
                <option value="asc">⬆️ Oldest First</option>
              </select>
            </div>
          </div>
          
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Quick Filters:</span>
            {[
              { label: 'Today', action: () => setSearchTerm(new Date().toDateString()) },
              { label: 'Errors Only', action: () => setFilter('error') },
              { label: 'Wallet Activity', action: () => setFilter('wallet_connect') },
              { label: 'Clear All', action: () => { setFilter('all'); setSearchTerm(''); } }
            ].map((quickFilter, index) => (
              <button
                key={index}
                onClick={quickFilter.action}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-[#81D7B4] hover:to-blue-400 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {quickFilter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Interactions List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/30 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Interactions
                </h2>
                <p className="text-gray-600 mt-1">Live activity feed • {filteredInteractions.length} events</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchInteractions}
                  className="px-4 py-2 bg-gradient-to-r from-[#81D7B4] to-blue-400 text-white rounded-xl hover:from-[#6bc4a1] hover:to-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#81D7B4] border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Loading interactions...</p>
            </div>
          ) : (
            <div className="max-h-[800px] overflow-y-auto">
              <AnimatePresence>
                {filteredInteractions.map((interaction, index) => (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-6 border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(interaction.type).includes('green') ? 'from-green-400 to-green-500' : getTypeColor(interaction.type).includes('red') ? 'from-red-400 to-red-500' : getTypeColor(interaction.type).includes('blue') ? 'from-blue-400 to-blue-500' : getTypeColor(interaction.type).includes('purple') ? 'from-purple-400 to-purple-500' : getTypeColor(interaction.type).includes('yellow') ? 'from-yellow-400 to-yellow-500' : 'from-gray-400 to-gray-500'} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-xl">{getTypeIcon(interaction.type)}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getTypeColor(interaction.type)} shadow-sm`}>
                              {interaction.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">
                                {new Date(interaction.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {interaction.walletAddress && (
                            <div className="bg-gray-50/80 rounded-xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Wallet Address</span>
                              </div>
                              <code className="text-xs font-mono bg-white px-3 py-2 rounded-lg border block truncate">
                                {interaction.walletAddress}
                              </code>
                            </div>
                          )}
                          
                          <div className="bg-gray-50/80 rounded-xl p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-semibold text-gray-700">Session ID</span>
                            </div>
                            <code className="text-xs font-mono bg-white px-3 py-2 rounded-lg border block truncate">
                              {interaction.sessionId}
                            </code>
                          </div>
                          
                          {interaction.ip && (
                            <div className="bg-gray-50/80 rounded-xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">IP Address</span>
                              </div>
                              <code className="text-xs font-mono bg-white px-3 py-2 rounded-lg border block">
                                {interaction.ip}
                              </code>
                            </div>
                          )}
                        </div>
                        
                        <details className="group/details">
                          <summary className="cursor-pointer flex items-center space-x-2 text-sm text-[#81D7B4] hover:text-[#6bc4a1] font-semibold transition-colors duration-200 p-3 bg-gradient-to-r from-[#81D7B4]/10 to-blue-400/10 rounded-xl hover:from-[#81D7B4]/20 hover:to-blue-400/20">
                            <svg className="w-4 h-4 group-open/details:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span>View Raw Data</span>
                          </summary>
                          <div className="mt-3 p-4 bg-gray-900 rounded-xl border">
                            <pre className="text-xs text-green-400 overflow-x-auto font-mono leading-relaxed">
                              {JSON.stringify(interaction.data, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredInteractions.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📭</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No interactions found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Try adjusting your filters or search terms to find the interactions you&apos;re looking for.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}