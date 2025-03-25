'use client'
import { motion } from 'framer-motion';

export default function Features() {
  const featureItems = [
    {
      title: "Designed for Growth",
      description: "Offers supervised portfolios and sustainable strategies to maximize long-term growth potential.",
      detail: "Optimized asset allocation for sustainable long-term returns.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      color: "primary"
    },
    {
      title: "Designed for Ease",
      description: "Provides a clean and intuitive interface, making crypto savings straightforward and accessible.",
      detail: "No complex trading interfaces or confusing terminology.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-secondary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      color: "secondary"
    },
    {
      title: "Designed for Peace",
      description: "Ensures peace of mind with optimal diversification, professional management, and safe custody.",
      detail: "Institutional-grade security and regulated custody solutions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-accent">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      color: "accent"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white to-[#f8fafa]">
      {/* Enhanced background elements */}
      <div className="absolute -z-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] top-1/4 left-0 transform -translate-x-1/2"></div>
      <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] bottom-0 right-0 transform translate-x-1/3"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-24 h-24 border border-primary/20 rounded-lg rotate-12 opacity-30 hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 border border-secondary/20 rounded-lg -rotate-12 opacity-30 hidden lg:block"></div>
      
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Enhanced title with decorative elements - Centered and more stunning */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(129,215,180,0.2)] mx-auto relative overflow-hidden group">
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/20 to-[#81D7B4]/0 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer-slow"></div>
              
              <div className="w-3 h-3 rounded-full bg-[#81D7B4] animate-pulse relative z-10"></div>
              <span className="text-sm font-semibold text-[#81D7B4] uppercase tracking-wider relative z-10">Powerful Features</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
              Key Features
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Designed for growth, ease, and peace of mind - everything you need for successful crypto savings
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {featureItems.map((feature, index) => (
            <motion.div 
              key={index}
              className="backdrop-blur-xl bg-white/90 p-8 rounded-xl border border-[#81D7B4]/10 relative overflow-hidden group hover:bg-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(129,215,180,0.15)] shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#81D7B4]/5 rounded-full blur-3xl group-hover:bg-[#81D7B4]/10 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#81D7B4]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#81D7B4" className="w-8 h-8">
                    {feature.icon.props.children}
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-[#81D7B4]">{feature.title}</span>
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                
                <div className="p-4 backdrop-blur-md bg-white/80 rounded-lg border border-[#81D7B4]/10 shadow-sm relative">
                  <p className="text-sm">
                    <span className="font-bold text-[#81D7B4]">Strategy: </span>
                    <span className="text-[#81D7B4]">{feature.detail}</span>
                  </p>
                  
                  {/* Add glowing dot indicator */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#81D7B4] animate-pulse"></div>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#81D7B4]/30 rounded-br-lg opacity-70"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Add any missing animation keyframes */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-15px) translateX(10px);
          }
          50% {
            transform: translateY(5px) translateX(-10px);
          }
          75% {
            transform: translateY(10px) translateX(5px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes shimmer-slow {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        
        @keyframes shimmer-delayed {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slow-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}