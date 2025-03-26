'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OptimizedSection from './OptimizedSection';

export default function Security() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Auto-rotate features
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isHovering]);
  
  const securityFeatures = [
    {
      title: "Smart Contract Audited",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      description: "All smart contracts undergo rigorous third-party security audits to ensure they're free from vulnerabilities."
    },
    {
      title: "Multi-Layer Protection",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-secondary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
        </svg>
      ),
      description: "Multiple security layers protect your assets, from encrypted communications to secure transaction validation."
    },
    {
      title: "Private Key Control",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      description: "You maintain full control of your private keys at all times. BitSave never has access to your funds."
    },
    {
      title: "Immutable Contracts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-secondary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      description: "Once deployed, our smart contracts cannot be modified, ensuring consistent and predictable behavior."
    }
  ];

  return (
    <OptimizedSection id="security" className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white to-[#f8fafa]">
      {/* Enhanced cybersecurity background elements */}
      <div className="absolute inset-0 -z-10 bg-[url('/grain-texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 -z-10 bg-[url('/circuit-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
      <div className="absolute -z-10 w-[600px] h-[600px] bg-[#81D7B4]/10 rounded-full blur-[100px] top-1/4 right-0 transform translate-x-1/3 animate-pulse-slow"></div>
      <div className="absolute -z-10 w-[500px] h-[500px] bg-[#81D7B4]/10 rounded-full blur-[100px] bottom-0 left-0 transform -translate-x-1/3 animate-pulse-slow-delayed"></div>
      
      {/* Digital code rain effect - lighter version */}
      <div className="absolute inset-0 -z-5 overflow-hidden opacity-5 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
          const height = 100 + (i * 15) % 300;
          const left = (i * 5) % 100;
          const opacity = 0.2 + ((i * 7) % 70) / 100;
          const duration = 5 + ((i * 11) % 15);
          const delay = (i * 0.25) % 5;
          
          return (
            <div 
              key={i}
              className="absolute w-px bg-gradient-to-b from-[#81D7B4]/0 via-[#81D7B4]/40 to-[#81D7B4]/0"
              style={{
                height: `${height}px`,
                left: `${left}%`,
                top: `-100px`,
                opacity,
                animation: `code-rain ${duration}s linear infinite ${delay}s`,
              }}
            ></div>
          );
        })}
      </div>
      
      {/* Floating particles - lighter version */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
          const top = (i * 7) % 100;
          const left = (i * 6) % 100;
          const opacity = 0.3 + ((i * 3) % 30) / 100;
          const duration = 8 + ((i * 4) % 12);
          const delay = (i * 0.33) % 5;
          
          return (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#81D7B4]/40" 
              style={{
                top: `${top}%`,
                left: `${left}%`,
                opacity,
                animation: `float-particle ${duration}s ease-in-out infinite ${delay}s`,
              }}
            ></div>
          );
        })}
      </div>
      
      <div className="container mx-auto font-space-grotesk">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Enhanced badge with glow effect */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/30 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(129,215,180,0.2)] mx-auto relative overflow-hidden group">
            {/* Holographic shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/20 to-[#81D7B4]/0 animate-shimmer"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer-slow"></div>
            
            <div className="w-3 h-3 rounded-full bg-[#81D7B4] animate-pulse relative z-10"></div>
            <span className="text-sm font-semibold text-[#81D7B4] uppercase tracking-wider relative z-10">Top-Tier Security Rating</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
              Enterprise-Grade Security
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your assets are protected by multiple layers of security, from smart contract audits to non-custodial architecture.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side: Interactive Security visualization - light theme */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="backdrop-blur-xl bg-white/90 p-8 rounded-2xl border border-[#81D7B4]/10 shadow-[0_0_50px_rgba(129,215,180,0.1)] relative z-10 group hover:shadow-[0_0_70px_rgba(129,215,180,0.2)] transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-[#81D7B4]/5 to-[#81D7B4]/5 rounded-2xl"></div>
              
              {/* Animated security shield in the background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-64 h-64 text-[#81D7B4]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              
              <div className="grid grid-cols-2 gap-6 relative z-10">
                {securityFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className={`backdrop-blur-md bg-white/80 p-5 rounded-xl border ${activeFeature === index ? 'border-[#81D7B4]/50' : 'border-gray-100'} flex flex-col items-center justify-center aspect-square group/card hover:scale-105 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md`}
                    onMouseEnter={() => {
                      setActiveFeature(index);
                      setIsHovering(true);
                    }}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className={`w-14 h-14 rounded-full ${activeFeature === index ? 'bg-[#81D7B4]/20' : 'bg-[#81D7B4]/10'} flex items-center justify-center mb-4 group-hover/card:bg-[#81D7B4]/20 transition-colors`}>
                      <div className="text-[#81D7B4]">{feature.icon}</div>
                    </div>
                    <span className="font-semibold text-sm text-center text-gray-800">{feature.title}</span>
                    
                    {/* Pulsing ring when active */}
                    {activeFeature === index && (
                      <div className="absolute inset-0 border border-[#81D7B4]/30 rounded-xl scale-[1.03] animate-ping-slow opacity-70"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Feature description - light theme */}
              <div className="mt-6 p-4 backdrop-blur-md bg-white/80 rounded-xl border border-gray-100 min-h-[80px] flex items-center justify-center shadow-sm">
                <p className="text-center text-sm text-gray-600">
                  {securityFeatures[activeFeature].description}
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 w-64 h-64 bg-[#81D7B4]/10 rounded-full blur-3xl -bottom-10 -left-10"></div>
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-16 h-16 bg-[#81D7B4]/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Tech decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#81D7B4]/20 rounded-lg rotate-12 opacity-30"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 border border-[#81D7B4]/20 rounded-lg -rotate-12 opacity-30"></div>
          </motion.div>
          
          {/* Right side: Security features with animated tech elements - light theme */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Terminal-like security feature - lighter version */}
            <div className="backdrop-blur-xl bg-[#f8fafa] p-1 rounded-xl border border-[#81D7B4]/20 relative overflow-hidden group hover:border-[#81D7B4]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(129,215,180,0.15)] shadow-sm">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#81D7B4]/10">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
                <div className="text-xs text-gray-500 ml-2">security_protocol.sh</div>
              </div>
              
              <div className="p-5 font-mono text-sm">
                <div className="flex">
                  <span className="text-[#81D7B4] mr-2">$</span>
                  <span className="text-gray-600">running security_check</span>
                </div>
                <div className="mt-2 flex items-start">
                  <span className="text-[#81D7B4] mr-2"></span>
                  <div>
                    <span className="text-[#81D7B4]">Smart Contract Audit</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-green-500">PASSED</span>
                    <div className="text-xs text-gray-500 mt-1">All contracts verified on-chain with public source code</div>
                  </div>
                </div>
                <div className="mt-2 flex items-start">
                  <span className="text-[#81D7B4] mr-2"></span>
                  <div>
                    <span className="text-[#81D7B4]">Vulnerability Scan</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-green-500">SECURE</span>
                    <div className="text-xs text-gray-500 mt-1">No critical vulnerabilities detected</div>
                  </div>
                </div>
                <div className="mt-2 flex items-start">
                  <span className="text-[#81D7B4] mr-2"></span>
                  <div className="flex items-center">
                    <span className="text-[#81D7B4]">Encryption</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-green-500 ml-1">ACTIVE</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blockchain security feature with animated elements - light theme */}
            <div className="backdrop-blur-xl bg-white/90 p-6 rounded-xl border border-[#81D7B4]/10 relative overflow-hidden group hover:bg-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(129,215,180,0.15)] shadow-sm">
              <div className="absolute top-0 right-0 bg-[#81D7B4] text-xs font-bold py-1 px-3 rounded-bl-lg text-white">BLOCKCHAIN</div>
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#81D7B4]/5 rounded-full blur-3xl group-hover:bg-[#81D7B4]/10 transition-colors"></div>
              
              {/* Animated blockchain in background */}
              <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#81D7B4]">
                  <path d="M60 10L100 30V90L60 110L20 90V30L60 10Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M60 40L100 20M60 40L20 20M60 40V100" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#81D7B4]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Smart Contract Security
                </h3>
                <p className="text-gray-600 mb-4">
                Our smart contracts are professionally audited and verified on-chain, with open-source code for full transparency. We prioritize robust security measures to ensure user protection and system integrity.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#81D7B4]/20 to-transparent my-4"></div>
                
                {/* Security metrics with tech styling */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="backdrop-blur-md bg-white/90 p-2 rounded-lg border border-[#81D7B4]/10 shadow-sm">
                    <div className="text-lg font-bold text-[#81D7B4]">100%</div>
                    <div className="text-xs text-gray-500 mt-1">Code Coverage</div>
                  </div>
                 
                  <div className="backdrop-blur-md bg-white/90 p-2 rounded-lg border border-[#81D7B4]/10 shadow-sm">
                    <div className="text-lg font-bold text-[#81D7B4]">0</div>
                    <div className="text-xs text-gray-500 mt-1">Vulnerabilities</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Non-custodial architecture feature */}
            <div className="backdrop-blur-xl bg-white/90 p-6 rounded-xl border border-[#81D7B4]/10 relative overflow-hidden group hover:bg-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(129,215,180,0.15)] shadow-sm">
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#81D7B4]/5 rounded-full blur-3xl group-hover:bg-[#81D7B4]/10 transition-colors"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[#81D7B4]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Non-Custodial Architecture
                </h3>
                <p className="text-gray-600 mb-4">
                  BitSave operates on a non-custodial model, meaning we never hold your private keys or have access to your funds.
                  You maintain complete control over your assets at all times through your personal wallet.
                </p>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#81D7B4]/20 to-transparent my-4"></div>
                
                {/* Tech diagram */}
                <div className="relative h-16 mb-4">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-lg backdrop-blur-md bg-white/80 border border-[#81D7B4]/10 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-[#81D7B4]">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                    </svg>
                  </div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-lg backdrop-blur-md bg-white/80 border border-[#81D7B4]/10 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-[#81D7B4]">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                    </svg>
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg backdrop-blur-md bg-white/80 border border-[#81D7B4]/10 flex items-center justify-center z-10 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#81D7B4]">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div className="absolute left-[calc(25%-6px)] top-1/2 transform -translate-y-1/2 w-[calc(25%+12px)] h-px bg-gradient-to-r from-[#81D7B4]/50 to-[#81D7B4]/20"></div>
                  <div className="absolute right-[calc(25%-6px)] top-1/2 transform -translate-y-1/2 w-[calc(25%+12px)] h-px bg-gradient-to-l from-[#81D7B4]/50 to-[#81D7B4]/20"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#81D7B4]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-[#81D7B4]">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Your keys, your crypto - always</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
  </OptimizedSection>
  )
}