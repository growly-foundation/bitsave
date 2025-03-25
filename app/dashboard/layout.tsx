'use client'

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';

// Initialize Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push('/');
    }
  }, [isConnected, mounted, router]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return path !== '/dashboard' && pathname.startsWith(path);
  };

  return (
    <div className={`${spaceGrotesk.variable} font-sans min-h-screen bg-[#f2f2f2] text-gray-800 overflow-x-hidden`}>
      {/* Sidebar - responsive for mobile */}
      <div className={`fixed h-full bg-white/90 backdrop-blur-lg border-r border-gray-200 transition-all duration-300 z-50 ${sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!sidebarCollapsed && <span className="text-2xl font-bold text-gray-800">BitSave</span>}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:block hidden"
          >
            {sidebarCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="py-6">
          <Link href="/dashboard" className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
            isActive('/dashboard') 
              ? 'bg-[#81D7B4]/10 text-[#81D7B4]' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>
          
          <Link href="/dashboard/plans" className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
            isActive('/dashboard/plans') 
              ? 'bg-[#81D7B4]/10 text-[#81D7B4]' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3">My Plans</span>}
          </Link>
          
          <Link href="/dashboard/activity" className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
            isActive('/dashboard/activity') 
              ? 'bg-[#81D7B4]/10 text-[#81D7B4]' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3">Activity</span>}
          </Link>
          
          <Link href="/dashboard/leaderboard" className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
            isActive('/dashboard/leaderboard') 
              ? 'bg-[#81D7B4]/10 text-[#81D7B4]' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3">Leaderboard</span>}
          </Link>
          
          <Link href="/dashboard/create-savings" className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
            isActive('/dashboard/create-savings') 
              ? 'bg-[#81D7B4]/10 text-[#81D7B4]' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3">Create Plan</span>}
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button 
            onClick={() => disconnect()}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3">Disconnect</span>}
          </button>
        </div>
      </div>

      {/* Mobile sidebar toggle button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-white/90 backdrop-blur-lg rounded-lg shadow-md border border-gray-200"
        >
          {sidebarCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0 overflow-x-hidden`}>
        {children}
      </div>
    </div>
  );
}