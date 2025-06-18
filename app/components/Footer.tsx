'use client'

import { motion } from 'framer-motion';

import { useState } from 'react';

const footerLinks = {
  product: [
    { name: 'Download', href: '#download' },
    { name: 'Security', href: '#security' },
    { name: 'Support', href: '#support' },
    { name: 'Feature Requests', href: '#features' }
  ],
  resources: [
    { name: 'Explore', href: '#explore' },
    { name: 'Learn', href: '#learn' },
    { name: 'Blog', href: '#blog' },
    { name: 'Docs', href: '#docs' }
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Terms', href: '#terms' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press Kit', href: '#press' }
  ]
};

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/bitsave',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/bitsave',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    )
  },
  {
    name: 'Telegram',
    href: 'https://t.me/bitsave',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    )
  }
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden bg-[#f8fafa] border-t border-[#81D7B4]/10">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grain-texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute -z-10 w-[800px] h-[800px] bg-[#81D7B4]/5 rounded-full blur-[100px] -bottom-1/2 -right-1/2"></div>
      <div className="absolute -z-10 w-[600px] h-[600px] bg-[#81D7B4]/5 rounded-full blur-[100px] -top-1/2 -left-1/2"></div>

      {/* Newsletter Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-xl border border-[#81D7B4]/20 p-8 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80 mb-2">
                Join our newsletter
              </h2>
              <p className="text-gray-600">
                Sign up for our newsletter and join our growing community.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-4">
              <div className="flex-1">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="email-address"
                  name="email"
                  required
                  className="w-full rounded-xl border-0 bg-white/70 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-[#81D7B4]/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-[#81D7B4] backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="flex-none rounded-xl bg-[#81D7B4] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#81D7B4]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#81D7B4] transition-all duration-300"
              >
                Sign up
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
           
              <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
                BitSave
              </span>
            <p className="text-sm leading-6 text-gray-600 max-w-md">
              BitSave is revolutionizing crypto savings with our innovative stablecoin protocol. 
              Save, earn rewards, and achieve your financial goals with confidence.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-[#81D7B4] transition-colors duration-300"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.product.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-600 hover:text-[#81D7B4] transition-colors duration-300"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.resources.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href} 
                        className="text-sm leading-6 text-gray-600 hover:text-[#81D7B4] transition-colors duration-300"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <a 
                      href={item.href} 
                      className="text-sm leading-6 text-gray-600 hover:text-[#81D7B4] transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-[#81D7B4]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} BitSave. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-500">
              <a href="#privacy" className="hover:text-[#81D7B4] transition-colors duration-300">Privacy Policy</a>
              <span className="select-none">·</span>
              <a href="#terms" className="hover:text-[#81D7B4] transition-colors duration-300">Terms of Service</a>
              <span className="select-none">·</span>
              <a href="#cookies" className="hover:text-[#81D7B4] transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 