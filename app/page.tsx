import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Security from './components/Security';
import Features from './components/Features';
import FAQ from './components/FAQ';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Security />
        <Features />
        <FAQ />
      </main>
      <footer className="py-16 px-6 relative overflow-hidden">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-gray-50/90 backdrop-blur-md -z-10"></div>
        
        {/* Subtle background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(129,215,180,0.03)_0%,transparent_70%)] pointer-events-none -z-5"></div>
        
        {/* Floating blobs */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#81D7B4]/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#81D7B4]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-5xl">
          {/* Neomorphic container */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-10 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),0_0_0_1px_rgba(129,215,180,0.1),inset_0_0_0_1px_rgba(255,255,255,0.5)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">BitSave</span>
              </div>
              
              <div className="flex gap-10 text-gray-600">
                <a href="#" className="hover:text-[#81D7B4] transition-colors">Terms</a>
                <a href="#" className="hover:text-[#81D7B4] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#81D7B4] transition-colors">Contact</a>
              </div>
              
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8),inset_1px_1px_1px_rgba(255,255,255,0.8)] text-[#81D7B4] hover:text-white hover:bg-[#81D7B4] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8),inset_1px_1px_1px_rgba(255,255,255,0.8)] text-[#81D7B4] hover:text-white hover:bg-[#81D7B4] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8),inset_1px_1px_1px_rgba(255,255,255,0.8)] text-[#81D7B4] hover:text-white hover:bg-[#81D7B4] transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-[#81D7B4]/10 text-center">
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} BitSave. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
