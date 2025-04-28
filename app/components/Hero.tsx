'use client'
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shimmerElementsRef = useRef<Array<{width: number, top: number, rotation: number, duration: number, delay: number}>>([]);
  const router = useRouter();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Initialize shimmer elements data with fixed values to avoid hydration mismatch
  useEffect(() => {
    // Only generate random values on the client side
    if (!shimmerElementsRef.current.length) {
      shimmerElementsRef.current = Array(10).fill(0).map(() => ({
        width: Math.random() * 100 + 50,
        top: Math.random() * 100,
        rotation: Math.random() * 180,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2
      }));

      // Force a re-render to apply the client-side generated values
      const shimmerElements = document.querySelectorAll('.shimmer-line');
      shimmerElements.forEach((element, i) => {
        const htmlElement = element as HTMLElement;
        const data = shimmerElementsRef.current[i];
        if (data) {
          htmlElement.style.width = `${data.width}px`;
          htmlElement.style.top = `${data.top}%`;
          htmlElement.style.transform = `rotate(${data.rotation}deg)`;
          htmlElement.style.animation = `shimmer ${data.duration}s infinite linear ${data.delay}s`;
        }
      });
    }
  }, []);

  // Handle wallet connection and redirect
  const handleOpenApp = () => {
    if (isConnected) {
      // If already connected, redirect to dashboard
      router.push('/dashboard');
    } else {
      // If not connected, open wallet connect modal
      openConnectModal?.();
    }
  };

  // Effect to redirect to dashboard when connected
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const glowElements = heroRef.current.querySelectorAll('.hero-glow');
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      glowElements.forEach((glow, index: number) => {
        const glowElement = glow as HTMLElement;
        const offsetX = (x - 0.5) * (30 + index * 10);
        const offsetY = (y - 0.5) * (30 + index * 10);
        glowElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="pt-32 pb-20 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f8fafa] to-[#f2f7f7]"></div>
      <div className="hero-glow w-[600px] h-[600px] opacity-30 top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-[#81D7B4]/20 blur-3xl rounded-full"></div>
      <div className="hero-glow w-[500px] h-[500px] opacity-20 bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 bg-[#81D7B4]/20 blur-3xl rounded-full"></div>
      
      {/* Animated grid pattern with enhanced random light effect */}
      <div className="absolute inset-0 -z-5 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, #81D7B4 1px, transparent 1px), linear-gradient(to bottom, #81D7B4 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        <div className="absolute inset-0 grid-shimmer"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} 
              className="absolute bg-[#81D7B4] opacity-30 blur-sm shimmer-line" 
              style={{
                width: '100px', // Default width, will be updated by useEffect
                height: '1px',
                top: '50%', // Default position, will be updated by useEffect
                left: '-100px',
                transform: 'rotate(0deg)', // Default rotation, will be updated by useEffect
                animation: 'shimmer 4s infinite linear' // Default animation, will be updated by useEffect
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-[#81D7B4]">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#81D7B4] animate-pulse"></span>
                Secured, Easier and Faster
              </span>
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#4a9e8a]">The savings Protocol</span> of <span className="text-[#81D7B4]">#web3</span> Finance
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-xl">
            Bitsave Protocol helps you save and earn in Crypto without losing your savings to Crypto Market volatility.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleOpenApp}
              className="bg-[#81D7B4] hover:bg-[#6bc4a3] text-white font-medium px-8 py-3 rounded-lg flex items-center justify-center gap-2 group shadow-md hover:shadow-lg transition-all"
            >
              <span>Open App</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <a 
              href="https://youtube.com/shorts/CWRQ7rgtHzU?si=xd8ia_IQyonxOXFM" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 text-gray-700 font-medium px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#81D7B4]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </a>
          </div>
          
          {/* Supported Chains */}
          <div className="flex flex-wrap gap-4 pt-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 px-6 relative overflow-hidden group hover:scale-105 transition-all duration-300 w-full md:w-auto shadow-md">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#81D7B4]/10 rounded-full blur-xl"></div>
              <p className="text-xs font-semibold text-[#81D7B4] mb-2">SUPPORTED CHAINS</p>
              <div className="flex items-center gap-5">
                <div className="flex -space-x-3">
                  {/* Lisk Logo */}
                  <div className="w-10 h-10 rounded-full border-2 border-white z-30 overflow-hidden shadow-sm">
                    <Image src="/lisk-logo.svg" alt="Lisk" width={40} height={40} />
                  </div>
                  {/* Base Logo */}
                  <div className="w-10 h-10 rounded-full border-2 border-white z-20 overflow-hidden shadow-sm">
                    <Image src="/base-logo.svg" alt="Base" width={40} height={40} />
                  </div>
                  {/* ETH Logo */}
                  <div className="w-10 h-10 rounded-full border-2 border-white z-10 overflow-hidden shadow-sm">
                    <Image src="/eth-logo.svg" alt="Ethereum" width={40} height={40} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#81D7B4]">Multi-chain Support</span>
                  <span className="text-xs text-gray-600">Seamless cross-chain savings</span>
                </div>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-[#e0f5f0] to-[#81D7B4] mt-3 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 relative z-10 overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f9f7] to-[#e0f5f0] z-0"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden relative z-10 shadow-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e0f5f0] to-[#81D7B4]"></div>
              <div className="relative">
                <Image 
                  src="/bitsavedashboard.png" 
                  alt="BitSave Dashboard Preview" 
                  width={600} 
                  height={400}
                  className="w-full h-auto transform group-hover:scale-[1.03] transition-all duration-700"
                />
                
                {/* Overlapping Cards */}
                <div className="absolute -right-16 top-10 transform rotate-6 z-20 animate-float-delayed-2 shadow-xl">
                  <Image 
                    src="/savings-form-card.svg" 
                    alt="Create Savings Plan" 
                    width={240} 
                    height={300}
                    className="h-auto"
                  />
                </div>
                
                <div className="absolute -right-8 bottom-10 transform -rotate-3 z-30 animate-float shadow-xl">
                  <Image 
                    src="/transaction-success.svg" 
                    alt="Transaction Successful" 
                    width={220} 
                    height={180}
                    className="h-auto"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Savings Plan Cards - Column Layout */}
            {/* Right side cards */}
            <div className="absolute top-6 right-6 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-float shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">Bitcoin Plan</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '65%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$4,800 saved</p>
            </div>
            
            <div className="absolute top-28 right-6 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-float-delayed shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">Stablecoin</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '90%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$7,200 saved</p>
            </div>
            
            <div className="absolute top-50 right-6 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-float-delayed-2 shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">Crypto Index</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '45%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$3,600 saved</p>
            </div>
            
            {/* Left side cards */}
            <div className="absolute top-10 left-6 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-float-delayed shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">Gold & Crypto</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '30%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$2,400 saved</p>
            </div>
            
            <div className="absolute top-32 left-6 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-pulse-slow shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">ETH Savings</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '55%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$5,500 saved</p>
            </div>
            
            <div className="absolute top-54 left-6 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-float shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">Lisk Savings</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '40%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$3,200 saved</p>
            </div>
            
            {/* Additional floating cards */}
            <div className="absolute bottom-20 right-20 w-36 h-20 bg-white border border-gray-200 rounded-lg p-3 animate-float-delayed-2 shadow-md">
              <p className="text-xs font-semibold text-[#81D7B4] mb-1">Base Savings</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#81D7B4] h-full rounded-full" style={{width: '70%'}}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">$6,800 saved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}