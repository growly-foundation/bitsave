'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, base } from 'wagmi/chains';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet,
  coinbaseWallet,
  trustWallet,
  rabbyWallet,
  imTokenWallet,
  oktoWallet,
  bitgetWallet,
  bybitWallet,
  phantomWallet,
  walletConnectWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets';

// Import Rainbow Kit styles
import '@rainbow-me/rainbowkit/styles.css';

// Define the project ID for WalletConnect
const projectId = 'dfffb9bb51c39516580c01f134de2345';

// Define the supported chains - needs to be a tuple type with at least one chain
const chains = [mainnet, sepolia, base] as const;

// Create wallet groups with connectorsForWallets
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        trustWallet,
        rabbyWallet,
        imTokenWallet,
        oktoWallet,
        bitgetWallet,
        bybitWallet,
        phantomWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'BitSave',
    projectId,
    // chains,
  }
);

const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
  },
  connectors,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#81D7B4',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}