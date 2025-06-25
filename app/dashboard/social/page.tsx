"use client"
import { useState, useEffect, ReactNode, useRef } from 'react'
import { motion } from 'framer-motion'
import { Space_Grotesk } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

// Mock data for demonstration
const MOCK_USER_DATA = {
  hasSavingsPlan: true,
  hasConnectedX: true,
  hasConnectedFarcaster: true,
  hasEmail: true,
  userPoints: 0,
  referralLink: 'https://bitsave.com/ref/123xyz',
}

const testimonials = [
  {
    quote: "Bitsave has completely changed how I approach my savings in Web3. It's simple, secure, and the rewards are a great bonus!",
    name: 'Glory',
    handle: '@glory.eth',
    avatar: '/images/glory.jpg',
  },
  {
    quote: "Finally, a DeFi protocol that prioritizes savings. The child-parent contract structure gives me peace of mind. Highly recommend!",
    name: 'Nissi',
    handle: '@nissi.eth',
    avatar: '/images/nissi.jpg',
  },
  {
    quote: "As someone who's been rugged before, security is my top priority. Bitsave's transparent and audited contracts make it a no-brainer for me.",
    name: 'Karlagod',
    handle: '@karlagod',
    avatar: '/images/karlagod.jpg',
  },
  {
    quote: "The goal-based savings plans are a game-changer. I'm actually motivated to save regularly now. Plus, earning $BTS tokens is awesome.",
    name: 'Xpan',
    handle: '@xpan',
    avatar: '/images/xpan.jpg',
  },
  {
    quote: "I love the UI/UX. It doesn't feel like a complicated DeFi app. It's as easy as using my traditional banking app, but with all the benefits of web3.",
    name: 'Primidac',
    handle: '@primidac',
    avatar: '/images/primidac.png',
  },
]

const communityVideos = [
  {
    id: 1,
    title: 'How to Setup Your First Bitsave Plan',
    creator: 'CryptoSavvy',
    thumbnail: '/bitsavedashboard.png',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 2,
    title: 'Maximizing Your $BTS Rewards on Bitsave',
    creator: 'DeFi Don',
    thumbnail: '/dashboard-preview.svg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 3,
    title: "A Deep Dive into Bitsave's Security",
    creator: 'Onchain Analyst',
    thumbnail: '/bitsave-dashboard.svg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 4,
    title: "A Deep Dive into Bitsave's Security",
    creator: 'Onchain Analyst',
    thumbnail: '/bitsave-dashboard-new.svg',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
]

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  href: string;
  icon: string;
}

export default function SavvySpacePage() {
  const [userData] = useState(MOCK_USER_DATA)

  const tasks: Task[] = [
    {
      id: 'tweet_after_saving',
      title: 'Tweet after Saving',
      description: 'Get 1 point for the tweet you send after creating a new savings plan.',
      points: 1,
      isCompleted: false, // This would be tracked via backend
      href: '/dashboard/create-savings',
      icon: 'tweet',
    },
    {
      id: 'connect_x',
      title: 'Connect X (Twitter)',
      description: 'Link your X account to earn points and unlock social features.',
      points: 1,
      isCompleted: userData.hasConnectedX,
      href: '/dashboard/settings',
      icon: 'twitter',
    },
    {
      id: 'connect_farcaster',
      title: 'Connect Farcaster',
      description: 'Link your Farcaster account for onchain perks and rewards.',
      points: 1,
      isCompleted: userData.hasConnectedFarcaster,
      href: '/dashboard/settings',
      icon: 'farcaster',
    },
    {
      id: 'add_email',
      title: 'Add Email Address',
      description: 'Secure your account and get important notifications.',
      points: 1,
      isCompleted: userData.hasEmail,
      href: '/dashboard/settings',
      icon: 'email',
    },
    {
      id: 'tweet_about_bitsave',
      title: 'Tweet about BitSave',
      description: 'Share your experience with BitSave on X.',
      points: 5,
      isCompleted: false, // This would be tracked via backend
      href: `https://twitter.com/intent/tweet?text=Exploring%20the%20world%20of%20DeFi%20savings%20with%20@bitsaveprotocol!%20%23SaveFi%20%23Web3&url=${userData.referralLink}`,
      icon: 'tweet',
    },
    {
      id: 'cast_about_bitsave',
      title: 'Cast about BitSave',
      description: 'Post about BitSave on Farcaster.',
      points: 5,
      isCompleted: false, // This would be tracked via backend
      href: `https://warpcast.com/~/compose?text=Exploring%20the%20world%20of%20DeFi%20savings%20with%20@bitsave!%20&embeds[]=${userData.referralLink}`,
      icon: 'cast',
    },
    {
      id: 'referral_signup',
      title: 'Refer a Friend',
      description: 'Earn points for every friend who signs up using your link.',
      points: 5,
      isCompleted: false, // This is an ongoing task
      href: '/dashboard/settings', // a dedicated referral page could be better
      icon: 'referral',
    },
    {
      id: 'complete_plan',
      title: 'Complete a Savings Plan',
      description: 'Reach your savings goal to earn a streak bonus.',
      points: 10,
      isCompleted: false, // Depends on plan completion
      href: '/dashboard/plans',
      icon: 'streak',
    },
    {
      id: 'weekly_saving',
      title: '4-Week Saving Streak',
      description: 'Save consistently every week for a month.',
      points: 10,
      isCompleted: false, // Depends on saving history
      href: '/dashboard/plans',
      icon: 'calendar',
    },
  ]

  const TaskIcon = ({ icon }: { icon: string }) => {
    const icons: { [key: string]: ReactNode } = {
      twitter: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
      farcaster: <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 10.5C21.5 9.67157 20.8284 9 20 9H12C11.1716 9 10.5 9.67157 10.5 10.5V21.5C10.5 22.3284 11.1716 23 12 23H20C20.8284 23 21.5 22.3284 21.5 21.5V10.5Z" fill="currentColor"/><path d="M16 13.5C17.3807 13.5 18.5 14.6193 18.5 16C18.5 17.3807 17.3807 18.5 16 18.5C14.6193 18.5 13.5 17.3807 13.5 16C13.5 14.6193 14.6193 13.5 16 13.5Z" fill="white"/></svg>,
      email: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>,
      tweet: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      cast: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      referral: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.5a9 9 0 0118 0" /></svg>,
      streak: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
      calendar: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    }
    return icons[icon] || null
  }

  const TestimonialCard = ({ quote, name, handle, avatar }: { quote: string, name: string, handle: string, avatar: string }) => (
    <div className="flex-shrink-0 w-[300px] md:w-[350px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
      <div className="relative z-10">
        <p className="text-gray-600 mb-4 h-24 line-clamp-4">&quot;{quote}&quot;</p>
        <div className="flex items-center">
          <Image src={avatar} alt={name} width={40} height={40} className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-md" />
          <div>
            <p className="font-bold text-gray-800">{name}</p>
            <p className="text-sm text-gray-500">{handle}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const Testimonials = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      let animationFrameId: number;
      const scroll = () => {
        if (!isHovered) {
          scroller.scrollLeft += 1;
          if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
            scroller.scrollLeft = 0;
          }
        }
        animationFrameId = requestAnimationFrame(scroll);
      };

      animationFrameId = requestAnimationFrame(scroll);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [isHovered]);

    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
      <div
        ref={scrollerRef}
        className="relative w-full overflow-x-auto scrollbar-hide [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex w-max gap-6 pb-4">
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    );
  };

  const CommunityVideos = () => (
    <div className="relative">
      <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-[#81D7B4]/50 scrollbar-track-transparent">
        {communityVideos.map((video) => (
          <a href={video.url} key={video.id} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-[280px] group">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
              <Image src={video.thumbnail} alt={video.title} width={280} height={158} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 truncate">{video.title}</h4>
                <p className="text-sm text-gray-500">by {video.creator}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  const SavvySpace = () => (
    <div className="space-y-12">
      {/* User points and referral link section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 flex-1 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Your Points</h3>
            <p className="text-4xl font-bold text-gray-800 tracking-tight">{userData.userPoints.toLocaleString()}</p>
            <p className="text-sm text-[#81D7B4] font-medium mt-1">≈ ${(userData.userPoints * 0.1).toFixed(2)} USD</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 flex-1 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Your Referral Link</h3>
            <div className="flex items-center mt-2">
              <input
                type="text"
                readOnly
                value={userData.referralLink}
                className="w-full bg-gray-100/50 rounded-l-lg px-3 py-2 border-y border-l border-gray-200/50 text-sm focus:outline-none"
              />
              <button
                onClick={() => navigator.clipboard.writeText(userData.referralLink)}
                className="bg-[#81D7B4] text-white px-3 py-2 rounded-r-lg hover:bg-[#6bc4a1] transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share this link to earn 5 points for every sign-up!</p>
          </div>
        </div>
      </div>

      {/* Community Videos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Community Videos</h2>
        <CommunityVideos />
      </div>

      {/* Earn Points section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Earn More Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link href={task.href} target={task.href.startsWith('http') ? '_blank' : '_self'}>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#81D7B4]/20 rounded-full p-3 border border-[#81D7B4]/30">
                        <TaskIcon icon={task.icon} />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 ml-auto">To Do</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mt-4">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex-grow">{task.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center relative z-10">
                    <span className="text-sm font-bold text-[#81D7B4]">+{task.points} {task.points > 1 ? 'Points' : 'Point'}</span>
                    <div className="text-gray-400 group-hover:text-[#81D7B4] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* User Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
        <Testimonials />
      </div>
    </div>
  )

  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800`}>
      <div className="fixed inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
      <div className="fixed top-0 -left-1/4 w-full h-full bg-gradient-to-br from-[#81D7B4]/20 via-transparent to-transparent -z-10 blur-3xl"></div>
      <div className="fixed top-0 -right-1/4 w-full h-full bg-gradient-to-tl from-blue-500/10 via-transparent to-transparent -z-10 blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Savvy Space</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">Engage with the community, complete tasks to earn points, and climb the leaderboard!</p>
        </header>

        <SavvySpace />
      </div>
    </div>
  )
} 