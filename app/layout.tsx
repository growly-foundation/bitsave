import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

// Configure Space Grotesk font with all weights
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

import { Providers } from './providers';
import ReferralTracker from '@/components/ReferralTracker';

// Add this import to your layout file
// import "../styles/date-picker.css";

export const metadata: Metadata = {
  title: 'BitSave - Simplified Crypto Savings',
  description: 'BitSave offers a simplified approach to crypto investing with professionally managed portfolios.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className={`${spaceGrotesk.className}`}>
        <Providers>
          <ReferralTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
