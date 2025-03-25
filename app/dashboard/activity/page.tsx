'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Space_Grotesk } from 'next/font/google'

// Initialize the Space Grotesk font
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
})

// Define the transaction interface
// Update the Transaction interface to include currency
interface Transaction {
  id: string;
  amount: number;
  txnhash: string;
  chain: string;
  savingsname: string;
  useraddress: string;
  transaction_type: string;
  currency: string; // Add currency field
  created_at: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedActivity, setSelectedActivity] = useState<Transaction | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [currentUserAddress, setCurrentUserAddress] = useState<string>('')
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    netChange: 0,
    planActivity: {} as Record<string, number>
  })
  
  // Get the user's wallet address
  useEffect(() => {
    const getUserWalletAddress = async () => {
      try {
        // Check if window.ethereum is available (MetaMask or other wallet)
        if (typeof window !== 'undefined' && window.ethereum) {
          // Request account access if needed
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Get the first account
          const address = accounts[0];
          setCurrentUserAddress(address);
        } else {
          console.log('Ethereum wallet not detected. Please install MetaMask or another wallet.');
          // Set a fallback for development/testing
          setCurrentUserAddress('0x0000000000000000000000000000000000000000');
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        setCurrentUserAddress('0x0000000000000000000000000000000000000000');
      }
    };
    
    getUserWalletAddress();
  }, []);
  
  useEffect(() => {
    // Fetch transactions for the current user only
    const fetchTransactions = async () => {
      if (!currentUserAddress) return;
      
      setIsLoading(true)
      try {
        // Use the user's address in the API endpoint
        const response = await fetch(`https://bitsaveapi.vercel.app/transactions/${currentUserAddress}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }
        
        const data: Transaction[] = await response.json()
        setActivities(data)
        
        // Calculate statistics
        let totalDeposits = 0
        let totalWithdrawals = 0
        const planActivity: Record<string, number> = {}
        
        data.forEach(tx => {
          if (tx.transaction_type === 'deposit') {
            totalDeposits += tx.amount
            
            // Add to plan activity
            if (planActivity[tx.savingsname]) {
              planActivity[tx.savingsname] += tx.amount
            } else {
              planActivity[tx.savingsname] = tx.amount
            }
          } else if (tx.transaction_type === 'withdrawal') {
            totalWithdrawals += tx.amount
          }
        })
        
        setStats({
          totalDeposits,
          totalWithdrawals,
          netChange: totalDeposits - totalWithdrawals,
          planActivity
        })
        
      } catch (error) {
        console.error('Error fetching transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (currentUserAddress) {
      fetchTransactions()
    }
  }, [currentUserAddress])
  
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.transaction_type === filter)
  
  const openActivityDetails = (activity: Transaction) => {
    setSelectedActivity(activity)
    setIsDetailsOpen(true)
  }
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'deposit':
        return (
          <div className="bg-[#81D7B4]/20 rounded-full p-2.5 border border-[#81D7B4]/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#81D7B4]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )
      case 'withdrawal':
        return (
          <div className="bg-orange-100 rounded-full p-2.5 border border-orange-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-orange-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="bg-blue-100 rounded-full p-2.5 border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }
  
  // Get top plan by activity
  const getTopPlan = () => {
    let topPlan = { name: '', amount: 0 }
    
    Object.entries(stats.planActivity).forEach(([name, amount]) => {
      if (amount > topPlan.amount) {
        topPlan = { name, amount }
      }
    })
    
    return topPlan.name || 'None'
  }
  
  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100`}>
      {/* Decorative elements */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-[#81D7B4]/10 rounded-full blur-3xl"></div>
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* Noise texture */}
      <div className="fixed inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Activity History</h1>
          <p className="text-gray-600 max-w-2xl">Track all your deposits, withdrawals, and rewards across your savings plans.</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="inline-flex p-1 bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-[#81D7B4]/90 to-[#81D7B4]/80 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              All Activities
            </button>
            <button 
              onClick={() => setFilter('deposit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'deposit' 
                  ? 'bg-gradient-to-r from-[#81D7B4]/90 to-[#81D7B4]/80 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Deposits
            </button>
            <button 
              onClick={() => setFilter('withdrawal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'withdrawal' 
                  ? 'bg-gradient-to-r from-[#81D7B4]/90 to-[#81D7B4]/80 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Withdrawals
            </button>
          </div>
        </div>
        
        {/* Activity List */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Subtle noise texture */}
          <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          
          {/* Activity List Header */}
          <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-gray-200/50 hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500">
            <div className="col-span-2">Transaction</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-center p-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-100/80 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No activities found</h3>
              <p className="text-gray-600">There are no {filter !== 'all' ? filter : ''} activities to display.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {filteredActivities.map((activity, index) => {
                const formattedDate = formatDate(activity.created_at);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 hover:bg-white/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => openActivityDetails(activity)}
                  >
                    <div className="md:grid md:grid-cols-5 flex flex-col space-y-2 md:space-y-0 items-start md:items-center">
                      {/* Transaction */}
                      <div className="col-span-2 flex items-center">
                        {getActivityIcon(activity.transaction_type)}
                        <div className="ml-3">
                          <p className="font-medium text-gray-800 capitalize">{activity.transaction_type}</p>
                          <p className="text-xs text-gray-500">{activity.savingsname}</p>
                        </div>
                      </div>
                      
                      {/* Date */}
                      <div className="text-sm text-gray-600 md:ml-0 ml-11">
                        <p>{formattedDate.date}</p>
                        <p className="text-xs text-gray-500">{formattedDate.time}</p>
                      </div>
                      
                      {/* Amount */}
                      <div className={`font-medium md:ml-0 ml-11 ${activity.transaction_type === 'deposit' ? 'text-[#81D7B4]' : 'text-orange-500'}`}>
                        {activity.transaction_type === 'deposit' ? '+' : '-'}{activity.amount} {activity.currency || 'ETH'}
                      </div>
                      
                      {/* Status */}
                      <div className="md:ml-0 ml-11">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          completed
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Activity Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Summary Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-4">Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-[#81D7B4]/20 rounded-full p-2 mr-3 border border-[#81D7B4]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-[#81D7B4]">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Total Deposits</span>
                </div>
                <span className="font-bold text-gray-800">
                  {stats.totalDeposits.toFixed(4)} {activities[0]?.currency || 'ETH'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-orange-100 rounded-full p-2 mr-3 border border-orange-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-orange-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Total Withdrawals</span>
                </div>
                <span className="font-bold text-gray-800">
                  {stats.totalWithdrawals.toFixed(4)} {activities[0]?.currency || 'ETH'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3 border border-purple-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-purple-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-600">Net Change</span>
                </div>
                <span className={`font-bold ${stats.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.netChange >= 0 ? '+' : ''}{stats.netChange.toFixed(4)} {activities[0]?.currency || 'ETH'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Activity by Plan Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-4">Activity by Plan</h3>
            
            <div className="space-y-4">
              {Object.entries(stats.planActivity).map(([planName, amount], index) => {
                // Calculate percentage for progress bar (max 100%)
                const totalAmount = Object.values(stats.planActivity).reduce((sum, val) => sum + val, 0);
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                
                // Assign different colors to different plans
                const colors = [
                  'from-blue-400 to-blue-500/80 shadow-[0_0_6px_rgba(96,165,250,0.5)]',
                  'from-purple-400 to-purple-500/80 shadow-[0_0_6px_rgba(168,85,247,0.5)]',
                  'from-orange-400 to-orange-500/80 shadow-[0_0_6px_rgba(251,146,60,0.5)]',
                  'from-[#81D7B4] to-[#81D7B4]/80 shadow-[0_0_6px_rgba(129,215,180,0.5)]'
                ];
                
                return (
                  <div key={planName}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{planName}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {amount.toFixed(4)} {activities.find(a => a.savingsname === planName)?.currency || 'ETH'}
                      </span>
                    </div>
                    <div className="relative h-2 bg-white rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              {Object.keys(stats.planActivity).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No plan activity data available
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Active Plan</span>
                <span className="font-medium text-gray-800">{getTopPlan()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Details Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDetailsOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDetailsOpen ? '' : 'pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsDetailsOpen(false)}
        ></div>
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ 
            scale: isDetailsOpen ? 1 : 0.95, 
            opacity: isDetailsOpen ? 1 : 0, 
            y: isDetailsOpen ? 0 : 10 
          }}
          transition={{ type: "spring", damping: 30, stiffness: 400, duration: 0.15 }}
          className="relative w-full max-w-lg overflow-hidden"
        >
          {selectedActivity && (
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
              {/* Noise texture */}
              <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
              
              {/* Decorative elements */}
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#81D7B4]/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -top-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
              
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getActivityIcon(selectedActivity.transaction_type)}
                    <div className="ml-3">
                      <h3 className="text-xl font-bold text-gray-800 capitalize">{selectedActivity.transaction_type}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedActivity.created_at).date} at {formatDate(selectedActivity.created_at).time}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDetailsOpen(false)}
                    className="bg-gray-100/80 backdrop-blur-sm rounded-full p-2 hover:bg-gray-200/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                    <p className={`text-xl font-bold ${selectedActivity.transaction_type === 'deposit' ? 'text-[#81D7B4]' : 'text-orange-500'}`}>
                      {selectedActivity.transaction_type === 'deposit' ? '+' : '-'}{selectedActivity.amount} {selectedActivity.currency || 'ETH'}
                    </p>
                  </div>
                  
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                        completed
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Plan</p>
                    <p className="font-medium text-gray-800">{selectedActivity.savingsname}</p>
                  </div>
                  
                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Network</p>
                    <div className="flex items-center">
                      <img src="/base.svg" alt="Base" className="w-4 h-4 mr-2" />
                      <span className="font-medium text-gray-800">Base</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 mb-6">
                  <p className="text-sm text-gray-500 mb-2">Transaction Hash</p>
                  <div className="flex items-center justify-between">
                    <code className="bg-white px-3 py-1 rounded-md text-sm font-mono text-gray-800 overflow-x-auto max-w-[200px]">
                      {selectedActivity.txnhash}
                    </code>
                    <a 
                      href={`https://basescan.org/tx/${selectedActivity.txnhash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Explorer
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-200/50 flex justify-end">
                <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="bg-white/70 backdrop-blur-sm text-gray-800 font-medium py-2 px-4 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

