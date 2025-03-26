'use client'
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FAQItemProps = {
  question: string;
  answer: string;
  index: number;
  isActive: boolean;
  onToggle: () => void;
};

function FAQItem({ question, answer, index, isActive, onToggle }: FAQItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
  };

  return (
    <motion.div
      ref={itemRef}
      className={`backdrop-blur-md bg-white/90 border ${isActive ? 'border-primary/30' : 'border-gray-200'} rounded-2xl relative overflow-hidden transition-all duration-500 ${isActive ? 'shadow-[0_0_25px_rgba(129,215,180,0.15)]' : 'shadow-sm'}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={index}
      variants={variants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-30"></div>
      
      {/* Shimmer effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -z-5 transform -translate-x-full ${hovered ? 'animate-shimmer' : ''}`}></div>
      
      <button 
        className="flex justify-between items-center w-full text-left p-6"
        onClick={onToggle}
        aria-expanded={isActive}
      >
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${isActive ? 'bg-gradient-to-r from-[#81D7B4] to-secondary text-white' : 'bg-[#81D7B4]/10 text-[#81D7B4]'}`}>
            {index + 1}
          </div>
          <span className={`text-xl font-medium transition-colors duration-300 ${isActive ? 'text-black' : 'text-black'}`}>{question}</span>
        </div>
        <div className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'bg-[#81D7B4] text-white rotate-180' : 'bg-[#81D7B4]/10 text-[#81D7B4]'}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 border-t border-primary/10">
              <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-gray-600 text-lg leading-relaxed">{answer}</p>
              </div>
              
              {/* Decorative elements */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 w-3 rounded-full bg-primary/30"></div>
                <div className="h-1 w-6 rounded-full bg-primary/50"></div>
                <div className="h-1 w-3 rounded-full bg-primary/30"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Handle mouse movement for interactive background elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      
      const glowElements = sectionRef.current.querySelectorAll('.glow-element');
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
      
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      glowElements.forEach((glow, index) => {
        const glowElement = glow as HTMLElement;
        const offsetX = (x - 0.5) * (20 + index * 5);
        const offsetY = (y - 0.5) * (20 + index * 5);
        glowElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const faqItems = [
    {
      question: "What fees do I pay to use BitSave?",
      answer: "You pay a $1 fee per savings plan, split evenly between the CryptoSmart wallet (for operational costs) and the Buy Back Wallet (for $BTS buybacks)."
    },
    {
      question: "Can I create multiple savings plans?",
      answer: "Yes, users can create multiple savings plans, each with its own principal, lock period, and penalty settings (1%–5%)."
    },
    {
      question: "What is the penalty for breaking a savings plan?",
      answer: "You set the penalty (1%–5% of your savings) when creating the plan. If you break it early, this penalty is deducted and sent to the CryptoSmart wallet."
    }
];


  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white to-[#f8fafa]">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(129,215,180,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="absolute -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] bottom-1/4 right-0 transform translate-x-1/2 animate-pulse-slow glow-element"></div>
      <div className="absolute -z-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] top-1/4 left-0 transform -translate-x-1/3 animate-pulse-slow-delayed glow-element"></div>
      
      {/* Decorative elements - increased opacity and ensured visibility */}
      <div className="absolute top-20 right-20 w-24 h-24 border-2 border-primary/30 rounded-lg rotate-12 opacity-60 lg:block hidden"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-secondary/30 rounded-lg -rotate-12 opacity-60 lg:block hidden"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-24 h-24 border border-primary/20 rounded-lg rotate-12 opacity-30 hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 border border-secondary/20 rounded-lg -rotate-12 opacity-30 hidden lg:block"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Enhanced badge with glow effect - fixed centering and text visibility */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(129,215,180,0.2)] mx-auto relative overflow-hidden group">
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/20 to-[#81D7B4]/0 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer-slow"></div>
              
              <div className="w-3 h-3 rounded-full bg-[#81D7B4] animate-pulse relative z-10"></div>
              <span className="text-sm font-semibold text-[#81D7B4] uppercase tracking-wider relative z-10">Common Questions</span>
            </div>
          </div>
          
          {/* Decorative box elements - added to ensure visibility */}
          <div className="absolute top-0 right-20 w-24 h-24 border border-[#81D7B4] rounded-lg rotate-12 opacity-50 lg:block hidden"></div>
          <div className="absolute bottom-0 left-20 w-16 h-16 border border-[#81D7B4] rounded-lg -rotate-12 opacity-50 lg:block hidden"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
              Frequently Asked Questions
            </span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about savings with BitSave&apos;s innovative crypto platform
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index} 
              question={item.question} 
              answer={item.answer} 
              index={index}
              isActive={activeIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
        
        {/* Enhanced Call to action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="backdrop-blur-2xl bg-white/70 border border-[#81D7B4]/20 p-8 md:p-10 rounded-2xl max-w-2xl mx-auto relative overflow-hidden group shadow-lg">
            {/* Grain texture overlay */}
            <div className="absolute inset-0 bg-[url('/grain-texture.png')] opacity-[0.07] mix-blend-overlay pointer-events-none"></div>
            
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#81D7B4]/10 via-transparent to-secondary/10 opacity-70"></div>
            
            {/* Floating blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#81D7B4]/10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            
            {/* Decorative elements - increased visibility */}
            <div className="absolute top-6 left-6 w-20 h-20 border-2 border-primary/30 rounded-lg rotate-12 opacity-60"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-2 border-secondary/30 rounded-lg -rotate-12 opacity-60"></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/60"
                  style={{
                    top: `${10 + (i * 15)}%`,
                    left: `${5 + (i * 16)}%`,
                    animation: `float-particle ${3 + i}s ease-in-out infinite ${i * 0.5}s`
                  }}
                ></div>
              ))}
            </div>
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl border border-primary/10 opacity-50 group-hover:border-primary/30 transition-colors duration-500"></div>
            <div className="absolute inset-[1px] rounded-[14px] border border-primary/5 group-hover:border-primary/20 transition-colors duration-500"></div>
            
            <div className="relative z-10">
              {/* Modern badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Support Available 24/7</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Still have questions?</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#81D7B4" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Expert Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#7F66F9" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Quick Response</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#F97066" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">Personalized Help</span>
                </div>
              </div>
                
              <p className="text-lg text-gray-600 mb-8">Our team is here to help you navigate the world of crypto savings</p>
              
              <a 
                href="#contact" 
                className="relative inline-flex items-center gap-2 px-8 py-3 text-lg font-medium text-white rounded-xl overflow-hidden group/button"
              >
                {/* Button background with animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100 group-hover/button:opacity-90 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover/button:opacity-100 blur-xl transition-opacity duration-300"></div>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative z-10">Contact Our Team</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 relative z-10 group-hover/button:translate-x-1 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 w-24 h-24 border border-primary/20 rounded-lg rotate-12 opacity-30 hidden lg:block"></div>
      <div className="absolute top-10 left-10 w-16 h-16 border border-secondary/20 rounded-lg -rotate-12 opacity-30 hidden lg:block"></div>
      
      {/* styles for the security-card class */}
      <style jsx global>{`
        .security-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(129, 215, 180, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .security-card:hover {
          border-color: rgba(129, 215, 180, 0.3);
          box-shadow: 0 8px 32px rgba(129, 215, 180, 0.1);
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, 10px);
          }
          50% {
            transform: translate(-5px, 20px);
          }
          75% {
            transform: translate(-10px, 5px);
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
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 5s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-slow-delayed {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s;
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -15px) scale(1.1);
          }
          50% {
            transform: translate(-10px, 20px) scale(0.9);
          }
          75% {
            transform: translate(-15px, -10px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}