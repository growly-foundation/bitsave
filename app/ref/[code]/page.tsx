'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useReferrals } from '@/lib/useReferrals'
import { motion } from 'framer-motion'
import { Space_Grotesk } from 'next/font/google'
import Link from 'next/link'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

export default function ReferralPage() {
  const params = useParams()

  const { address } = useAccount()
  const { trackReferralVisit, markReferralConversion } = useReferrals()
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [isTracked, setIsTracked] = useState(false)

  useEffect(() => {
    if (params.code && typeof params.code === 'string') {
      setReferralCode(params.code)
    }
  }, [params.code])

  useEffect(() => {
    if (referralCode && !isTracked) {
      trackReferralVisit(referralCode)
      setIsTracked(true)
      
      // Store referral code for later conversion tracking
      localStorage.setItem('pendingReferralCode', referralCode)
    }
  }, [referralCode, isTracked, trackReferralVisit])

  useEffect(() => {
    if (address && referralCode) {
      // User is already connected, mark as conversion
      markReferralConversion(referralCode)
      localStorage.removeItem('pendingReferralCode')
    }
  }, [address, referralCode, markReferralConversion])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${spaceGrotesk.className}`}>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
                Welcome to BitSave
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              You&apos;ve been invited to join the future of crypto savings!
            </p>
            <p className="text-lg text-gray-500">
              Start your DeFi savings journey with BitSave&apos;s innovative stablecoin protocol.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#81D7B4]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#81D7B4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure Savings</h3>
              <p className="text-gray-600">Your funds are protected by smart contracts and decentralized protocols.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#81D7B4]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#81D7B4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Earn Interest</h3>
              <p className="text-gray-600">Grow your savings with competitive interest rates on stablecoins.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#81D7B4]/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-[#81D7B4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Goal-Based</h3>
              <p className="text-gray-600">Set savings goals and track your progress with our intuitive dashboard.</p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#81D7B4] text-white font-semibold rounded-full hover:bg-[#81D7B4]/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/#features"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-[#81D7B4] hover:text-[#81D7B4] transition-colors duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Referral Info */}
          {referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 p-6 bg-[#81D7B4]/5 rounded-2xl border border-[#81D7B4]/20"
            >
              <p className="text-sm text-gray-600">
                🎉 You&apos;re joining through a referral! Both you and your friend will earn rewards when you create your first savings plan.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}