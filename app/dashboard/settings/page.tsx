'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Space_Grotesk } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function Settings() {
  const { address } = useAccount();
  const [displayName, setDisplayName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  // Load display name from localStorage on component mount
  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem(`bitsave_displayname_${address}`);
    if (savedName) {
      setDisplayName(savedName);
    }
  }, [address]);

  // Save display name to localStorage
  const saveDisplayName = () => {
    if (displayName.trim()) {
      localStorage.setItem(`bitsave_displayname_${address}`, displayName);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // Delete display name from localStorage
  const deleteDisplayName = () => {
    localStorage.removeItem(`bitsave_displayname_${address}`);
    setDisplayName('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Add a function to copy wallet address with feedback
  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 5000);
      } catch (err) {
        console.error('Failed to copy address: ', err);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`${spaceGrotesk.variable} font-sans p-4 sm:p-6 md:p-8 bg-[#f2f2f2] text-gray-800 relative min-h-screen pb-20`}>
      {/* Decorative elements */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[url('/noise.jpg')] mix-blend-overlay"></div>
      <div className="absolute top-20 right-10 md:right-20 w-40 md:w-64 h-40 md:h-64 bg-[#81D7B4]/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 md:left-20 w-40 md:w-80 h-40 md:h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      
      {/* Copy notification banner */}
      <AnimatePresence>
        {showCopyNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-[#81D7B4]/30 flex items-center"
          >
            <div className="bg-[#81D7B4]/10 p-1.5 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-[#81D7B4]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Address copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Settings</h1>
        <p className="text-sm md:text-base text-gray-500">
          Customize your BitSave experience
        </p>
      </div>
      
      {/* Settings Container */}
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/60 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.1)] mb-6"
        >
          <div className="flex items-center mb-6">
            <div className="bg-[#81D7B4]/10 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-[#81D7B4]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>
          </div>
          
          <div className="mb-6">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="flex-1 bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#81D7B4]/50 focus:border-[#81D7B4] transition-all"
              />
              <button
                onClick={saveDisplayName}
                disabled={!displayName.trim()}
                className="bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 text-white px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(129,215,180,0.3)] hover:shadow-[0_6px_15px_rgba(129,215,180,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              {displayName && (
                <button
                  onClick={deleteDisplayName}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200 transition-all duration-300"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Your display name will be shown instead of your wallet address
            </p>
            {isSaved && (
              <p className="text-sm text-[#81D7B4] mt-2 animate-pulse">
                Settings saved successfully!
              </p>
            )}
          </div>
          
          {/* ENS Option - Coming Soon */}
          <div className="mb-6 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Use ENS Name</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Display your ENS name instead of wallet address
                </p>
              </div>
              <div className="relative">
                <div className="opacity-50 pointer-events-none">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81D7B4]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81D7B4]"></div>
                  </label>
                </div>
                <div className="absolute top-0 right-0 bg-gray-100/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md border border-gray-200/50">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Wallet Address</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-200 transition-all duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5 mr-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/60 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.1)] mb-6"
        >
          <div className="flex items-center mb-6">
            <div className="bg-[#81D7B4]/10 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-[#81D7B4]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Appearance</h2>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-800">Dark Mode</h3>
              <p className="text-sm text-gray-500 mt-1">
                Switch between light and dark theme
              </p>
            </div>
            <div className="relative">
              <div className="opacity-50 pointer-events-none">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81D7B4]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81D7B4]"></div>
                </label>
              </div>
              <div className="absolute top-0 right-0 bg-gray-100/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md border border-gray-200/50">
                Coming Soon
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/60 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center mb-6">
            <div className="bg-[#81D7B4]/10 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-[#81D7B4]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="font-medium text-gray-800">Email Notifications</h3>
              <p className="text-sm text-gray-500 mt-1">
                Receive updates via email
              </p>
            </div>
            <div className="relative">
              <div className="opacity-50 pointer-events-none">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81D7B4]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81D7B4]"></div>
                </label>
              </div>
              <div className="absolute top-0 right-0 bg-gray-100/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md border border-gray-200/50">
                Coming Soon
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-800">Push Notifications</h3>
              <p className="text-sm text-gray-500 mt-1">
                Get notified about important updates
              </p>
            </div>
            <div className="relative">
              <div className="opacity-50 pointer-events-none">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#81D7B4]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#81D7B4]"></div>
                </label>
              </div>
              <div className="absolute top-0 right-0 bg-gray-100/80 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md border border-gray-200/50">
                Coming Soon
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}