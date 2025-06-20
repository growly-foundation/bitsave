"use client"
import { motion } from 'framer-motion';

export default function SocialActivityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8fafa] relative overflow-x-hidden">
      {/* Decorative gradients and mesh */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-[#8A63D2]/10 rounded-full blur-3xl z-0"></div>
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-[#81D7B4]/10 rounded-full blur-3xl z-0"></div>
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-[#8A63D2]/5 rounded-full blur-3xl z-0"></div>
      <div className="fixed inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#8A63D2]/10 border border-[#8A63D2]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(138,99,210,0.10)] mx-auto relative overflow-hidden group mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8A63D2]/0 via-[#8A63D2]/20 to-[#8A63D2]/0 animate-shimmer"></div>
            <div className="w-4 h-4 rounded-full bg-[#8A63D2] animate-pulse relative z-10"></div>
            <span className="text-base font-semibold text-[#8A63D2] uppercase tracking-wider relative z-10">Social Activity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 gradient-text">Community & Socials</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">See the latest from BitSave on Farcaster, Twitter, Telegram, and more. Join the conversation and stay up to date with our vibrant onchain community.</p>
        </motion.div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Farcaster Card */}
          <motion.a
            href="https://warpcast.com/bitsave"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-[#8A63D2]/20 shadow-[0_8px_32px_rgba(138,99,210,0.10)] p-8 flex flex-col items-center text-center transition-all duration-300 group overflow-hidden hover:shadow-[0_12px_40px_rgba(138,99,210,0.15)]"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8A63D2]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
            <svg className="w-12 h-12 mb-4" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#8A63D2"/>
              <path d="M21.5 10.5C21.5 9.67157 20.8284 9 20 9H12C11.1716 9 10.5 9.67157 10.5 10.5V21.5C10.5 22.3284 11.1716 23 12 23H20C20.8284 23 21.5 22.3284 21.5 21.5V10.5Z" fill="white"/>
              <path d="M16 13.5C17.3807 13.5 18.5 14.6193 18.5 16C18.5 17.3807 17.3807 18.5 16 18.5C14.6193 18.5 13.5 17.3807 13.5 16C13.5 14.6193 14.6193 13.5 16 13.5Z" fill="#8A63D2"/>
            </svg>
            <h2 className="text-xl font-bold text-[#8A63D2] mb-2">Farcaster</h2>
            <p className="text-gray-700 mb-4">Follow us on Farcaster for the latest onchain updates, community threads, and announcements.</p>
            <span className="inline-block bg-[#8A63D2]/10 text-[#8A63D2] px-4 py-1.5 rounded-full font-medium text-sm border border-[#8A63D2]/20">@bitsave</span>
          </motion.a>

          {/* Twitter Card */}
          <motion.a
            href="https://twitter.com/bitsave"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-[#81D7B4]/20 shadow-[0_8px_32px_rgba(129,215,180,0.10)] p-8 flex flex-col items-center text-center transition-all duration-300 group overflow-hidden hover:shadow-[0_12px_40px_rgba(129,215,180,0.15)]"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#8A63D2]/10 rounded-full blur-2xl"></div>
            <svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <h2 className="text-xl font-bold text-[#81D7B4] mb-2">Twitter</h2>
            <p className="text-gray-700 mb-4">Join the conversation on Twitter for news, product updates, and community highlights.</p>
            <span className="inline-block bg-[#81D7B4]/10 text-[#81D7B4] px-4 py-1.5 rounded-full font-medium text-sm border border-[#81D7B4]/20">@bitsave</span>
          </motion.a>

          {/* Telegram Card */}
          <motion.a
            href="https://t.me/bitsave"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-[#229ED9]/20 shadow-[0_8px_32px_rgba(34,158,217,0.10)] p-8 flex flex-col items-center text-center transition-all duration-300 group overflow-hidden hover:shadow-[0_12px_40px_rgba(34,158,217,0.15)]"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#229ED9]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#8A63D2]/10 rounded-full blur-2xl"></div>
            <svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <h2 className="text-xl font-bold text-[#229ED9] mb-2">Telegram</h2>
            <p className="text-gray-700 mb-4">Join our Telegram for support, discussions, and real-time updates from the BitSave team.</p>
            <span className="inline-block bg-[#229ED9]/10 text-[#229ED9] px-4 py-1.5 rounded-full font-medium text-sm border border-[#229ED9]/20">@bitsave</span>
          </motion.a>
        </div>

        {/* Community Reviews Section - Carousel, No Avatars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center drop-shadow-sm">Community Reviews</h2>
          <div className="relative overflow-x-hidden">
            <div
              className="flex gap-8 w-max animate-carousel"
              style={{
                animation: 'carousel 30s linear infinite',
              }}
            >
              {/* Repeat reviews for seamless loop */}
              {[
                { name: 'Alice', review: 'BitSave made saving so easy and fun! The rewards system keeps me motivated.' },
                { name: 'Bob', review: 'I love the glassy UI and the social features. It feels like DeFi for everyone.' },
                { name: 'Carol', review: 'The best way to save onchain. I earned $BTS just for sticking to my goals!' },
                { name: 'David', review: 'BitSave is the future of onchain savings. Super smooth experience.' },
                { name: 'Eve', review: 'I never thought saving could be this fun and social. Love the rewards!' },
              ].concat([
                { name: 'Alice', review: 'BitSave made saving so easy and fun! The rewards system keeps me motivated.' },
                { name: 'Bob', review: 'I love the glassy UI and the social features. It feels like DeFi for everyone.' },
                { name: 'Carol', review: 'The best way to save onchain. I earned $BTS just for sticking to my goals!' },
                { name: 'David', review: 'BitSave is the future of onchain savings. Super smooth experience.' },
                { name: 'Eve', review: 'I never thought saving could be this fun and social. Love the rewards!' },
              ]).map((r, i) => (
                <div
                  key={i}
                  className="min-w-[320px] max-w-xs bg-white/80 backdrop-blur-xl rounded-2xl border border-[#81D7B4]/20 shadow-[0_8px_32px_rgba(129,215,180,0.10)] px-8 py-7 flex flex-col items-center text-center transition-all duration-300 group overflow-hidden hover:shadow-[0_12px_40px_rgba(129,215,180,0.15)] mx-2"
                >
                  <h3 className="text-lg font-bold text-[#229ED9] mb-2">{r.name}</h3>
                  <p className="text-gray-700 mb-2">"{r.review}"</p>
                  <span className="inline-block bg-[#81D7B4]/10 text-[#81D7B4] px-4 py-1.5 rounded-full font-medium text-xs border border-[#81D7B4]/20 mt-2">Verified User</span>
                </div>
              ))}
            </div>
            {/* Carousel animation keyframes */}
            <style jsx>{`
              @keyframes carousel {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        </motion.div>

        {/* Video Content Section - Only Provided Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center drop-shadow-sm">BitSave Video Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map((_, i) => (
              <div key={i} className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-[#229ED9]/20 shadow-[0_8px_32px_rgba(34,158,217,0.10)] p-4 flex flex-col items-center text-center transition-all duration-300 group overflow-hidden hover:shadow-[0_12px_40px_rgba(34,158,217,0.15)]">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#229ED9]/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
                <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 border-2 border-[#229ED9]/20 shadow">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/CWRQ7rgtHzU?si=923dVxvEH1N2QYQw" title="BitSave Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                <h3 className="text-lg font-bold text-[#229ED9] mb-2">BitSave Community Video</h3>
                <p className="text-gray-700">Watch the latest BitSave content and community highlights.</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 