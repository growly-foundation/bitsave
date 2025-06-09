'use client'
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import TopUpModal from '../../components/TopUpModal';
import WithdrawModal from '../../components/WithdrawModal';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import contractABI from '../abi/contractABI.js';
import childContractABI from '../abi/childContractABI.js';
import axios from 'axios';

// Initialize the Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk'
});


// Contract addresses
// const MAIN_CONTRACT_ADDRESS = "0x3593546078eecd0ffd1c19317f53ee565be6ca13";
const BASE_CONTRACT_ADDRESS = "0x3593546078eecd0ffd1c19317f53ee565be6ca13";
const CELO_CONTRACT_ADDRESS = "0x7d839923Eb2DAc3A0d1cABb270102E481A208F33";
const BitSaveABI = contractABI;


export default function Dashboard() {
  const [, setCurrentNetwork] = useState<{ chainId: bigint, name: string } | null>(null);
  const [isBaseNetwork, setIsBaseNetwork] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('current');
  const [, setEthPrice] = useState<number | null>(null);
  const [topUpModal, setTopUpModal] = useState({
    isOpen: false,
    planName: '',
    planId: '',
    isEth: false,
    isGToken: false
  });
  const [displayName, setDisplayName] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{ title: string, content: string, date: string } | null>(null);


  const [updates, setUpdates] = useState<Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    isNew: boolean;
  }>>([]);

  

  useEffect(() => {
    if (mounted && address) {
      const savedName = localStorage.getItem(`bitsave_displayname_${address}`);
      if (savedName) {
        setDisplayName(savedName);
      }
    }
  }, [mounted, address]);

  interface LeaderboardEntry {
    useraddress: string;
    totalamount: number;
    chain: string;
    datetime?: string;
    rank?: number;
  }

  interface Update {
    id: string;
    title: string;
    content: string;
    date: string;
    isNew: boolean;
  }

  interface ReadUpdate {
    id: string;
    isNew: boolean;
  }

  // Function to fetch all updates
  const fetchAllUpdates = async () => {
    try {
      const response = await fetch('https://bitsaveapi.vercel.app/updates/', {
        method: 'GET',
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch updates');
      }

      const allUpdates = await response.json();

      // If user is connected, fetch read status
      if (address) {
        const userResponse = await fetch(`https://bitsaveapi.vercel.app/updates/user/${address}`, {
          method: 'GET',
          headers: {
            'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
          }
        });

        if (userResponse.ok) {
          const userReadUpdates = await userResponse.json() as ReadUpdate[];

          // Mark updates as read or unread based on user data
          const processedUpdates = allUpdates.map((update: Update) => {
            const isRead = userReadUpdates.some((readUpdate: ReadUpdate) =>
              readUpdate.id === update.id && !readUpdate.isNew
            );
            return {
              ...update,
              isNew: !isRead
            };
          });

          setUpdates(processedUpdates);
        } else {
          // If user endpoint fails, assume all updates are new
          setUpdates(allUpdates.map((update: Update) => ({ ...update, isNew: true })));
        }
      } else {
        // If no user connected, assume all updates are new
        setUpdates(allUpdates.map((update: Update) => ({ ...update, isNew: true })));
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      setUpdates([]);
    }
  };

  // Function to mark an update as read
  const markUpdateAsRead = async (updateId: string) => {
    if (!address) return;

    try {
      const response = await fetch(`https://bitsaveapi.vercel.app/updates/${updateId}/read`, {
        method: 'PUT',
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          useraddress: address
        })
      });

      if (response.ok) {
        // Update local state to reflect the change
        setUpdates(prevUpdates =>
          prevUpdates.map(update =>
            update.id === updateId ? { ...update, isNew: false } : update
          )
        );
      }
    } catch (error) {
      console.error('Error marking update as read:', error);
    }
  };


  const [savingsData, setSavingsData] = useState({
    totalLocked: "0.00",
    deposits: 0,
    rewards: "0.00",
    currentPlans: [] as Array<{
      id: string;
      address: string;
      name: string;
      currentAmount: string;
      targetAmount: string;
      progress: number;
      isEth: boolean;
      maturityTime?: number;
      penaltyPercentage: number;
      tokenName: string; // Add this property
    }>,
    completedPlans: [] as Array<{
      id: string;
      address: string;
      name: string;
      currentAmount: string;
      targetAmount: string;
      progress: number;
      isEth: boolean;
      maturityTime?: number;
      penaltyPercentage: number;
      tokenName: string; // Add this property
    }>
  });

  const [isLoading, setIsLoading] = useState(true);


  const openUpdateModal = (update: Update) => {
    setSelectedUpdate(update);
    setShowUpdateModal(true);

    // Mark as read if it's new
    if (update.isNew) {
      markUpdateAsRead(update.id);
    }
  };


  useEffect(() => {
    if (mounted) {
      fetchAllUpdates();
    }
  }, [mounted, address]);

  // Function to close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };

  // Add useEffect to handle clicking outside the notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const notificationButton = document.getElementById('notification-button');
      const notificationDropdown = document.getElementById('notification-dropdown');

      if (
        showNotifications &&
        notificationButton &&
        notificationDropdown &&
        !notificationButton.contains(event.target as Node) &&
        !notificationDropdown.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to get signer
  // const getSigner = async () => {
  //   if (typeof window === 'undefined' || !window.ethereum) {
  //     throw new Error('No wallet detected');
  //   }

  //   await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   const provider = new ethers.BrowserProvider(window.ethereum);

  //   // Check if on Base network
  //   const network = await provider.getNetwork();
  //   const BASE_CHAIN_ID = 8453; // Base network chain ID

  //   if (Number(network.chainId) !== BASE_CHAIN_ID) {
  //     setIsCorrectNetwork(false);
  //     return null;
  //   }

  //   setIsCorrectNetwork(true);
  //   return provider.getSigner();
  // };


  // Function to switch to Base network
  const switchToNetwork = async (networkName: string) => {
    if (!window.ethereum) return;

    setSwitchingNetwork(true);
    try {
      if (networkName === 'Base') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // Base chainId in hex (8453)
        });

        // Refresh data after switching
        setIsCorrectNetwork(true);
        fetchSavingsData();
      } else if (networkName === 'Celo') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xA4EC' }], // Celo chainId in hex (42220)
        });

        // Refresh data after switching
        setIsCorrectNetwork(true);
        fetchSavingsData();
      }
    } catch (error: unknown) {
      // Type guard to check if error is an object with a code property
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          if (networkName === 'Base') {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x2105', // Base chainId in hex
                  chainName: 'Base',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org'],
                },
              ],
            });
          } else if (networkName === 'Celo') {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xA4EC', // Celo chainId in hex
                  chainName: 'Celo',
                  nativeCurrency: {
                    name: 'CELO',
                    symbol: 'CELO',
                    decimals: 18,
                  },
                  rpcUrls: ['https://forno.celo.org'],
                  blockExplorerUrls: ['https://explorer.celo.org'],
                },
              ],
            });
          }

          // Try switching again after adding
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: networkName === 'Base' ? '0x2105' : '0xA4EC' }],
          });

          setIsCorrectNetwork(true);
          fetchSavingsData();
        } catch (addError) {
          console.error(`Error adding ${networkName} network:`, addError);
        }
      } else {
        console.error(`Error switching to ${networkName} network:`, error);
      }
    } finally {
      setSwitchingNetwork(false);
    }
  };


  const fetchEthPrice = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      return response.data.ethereum.usd; // ETH price in USD
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return 3500; // Fallback price if API fails
    }
  };

  const fetchSavingsData = async () => {
    if (!isConnected || !address) return;
  
    try {
      setIsLoading(true);
  
      const currentEthPrice = await fetchEthPrice();
      console.log(`Current ETH price: ${currentEthPrice}`);
      setEthPrice(currentEthPrice || 3500);
  
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet detected. Please install MetaMask.");
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
  
      const BASE_CHAIN_ID = BigInt(8453);
      const CELO_CHAIN_ID = BigInt(42220);
  
      setCurrentNetwork(network);
      setIsBaseNetwork(network.chainId === BASE_CHAIN_ID);
  
      if (network.chainId !== BASE_CHAIN_ID && network.chainId !== CELO_CHAIN_ID) {
        setIsCorrectNetwork(false);
        return;
      }
  
      setIsCorrectNetwork(true);
  
      const contractAddress = (network.chainId === BASE_CHAIN_ID)
        ? BASE_CONTRACT_ADDRESS
        : CELO_CONTRACT_ADDRESS;
  
      const contract = new ethers.Contract(contractAddress, BitSaveABI, signer);
  
      // Get user's child contract
      let userChildContractAddress;
      try {
        userChildContractAddress = await contract.getUserChildContractAddress();
        console.log("User child contract address:", userChildContractAddress);
  
        if (!userChildContractAddress || userChildContractAddress === ethers.ZeroAddress) {
          console.log("User doesn't have a child contract yet");
          setSavingsData({
            totalLocked: "0.00",
            deposits: 0,
            rewards: "0.00",
            currentPlans: [],
            completedPlans: []
          });
          return;
        }
      } catch (error) {
        console.error("Error getting user child contract:", error);
        setSavingsData({
          totalLocked: "0.00",
          deposits: 0,
          rewards: "0.00",
          currentPlans: [],
          completedPlans: []
        });
        return;
      }
  
      const childContract = new ethers.Contract(
        userChildContractAddress,
        childContractABI,
        signer
      );
  
      const savingsNamesObj = await childContract.getSavingsNames();
      const savingsNamesArray = savingsNamesObj?.savingsNames || [];
      
      const currentPlans = [];
      const completedPlans = [];
      let totalDeposits = 0;
      let totalUsdValue = 0;
      const processedPlanNames = new Set();
  
      for (const savingName of savingsNamesArray) {
        try {
          // Basic validation
          if (!savingName || typeof savingName !== "string" || savingName.trim() === "") continue;
          if (processedPlanNames.has(savingName)) continue;
          processedPlanNames.add(savingName);
  
          console.log("Fetching data for:", savingName);
          const savingData = await childContract.getSaving(savingName);
          console.log(savingData)
  
          if (!savingData?.isValid) continue;
  
          const tokenId = savingData.tokenId;
          const isEth = tokenId.toLowerCase() === ethers.ZeroAddress.toLowerCase();
  
          let tokenName = "USDC";
          let decimals = 6;
  
          if (isEth) {
            tokenName = "ETH";
            decimals = 18;
          } else if (network.chainId === CELO_CHAIN_ID) {
            if (tokenId.toLowerCase() === "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A".toLowerCase()) {
              tokenName = "$G";
              decimals = 18;
            } else {
              tokenName = "USDGLO";
            }
          } else if (network.chainId === BASE_CHAIN_ID) {
            if (tokenId.toLowerCase() === "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".toLowerCase()) {
              tokenName = "USDC";
            }
          }
          console.log('Savings Name Array:', savingsNamesArray)
          console.log('Savings Name Object:', savingsNamesObj)
  
          const targetFormatted = ethers.formatUnits(savingData.amount, decimals);
          const currentFormatted = ethers.formatUnits(savingData.amount, decimals);
  
          const now = Date.now();
          const startTime = Number(savingData.startTime) * 1000;
          const maturityTime = Number(savingData.maturityTime) * 1000;
  
          const progress = Math.min(Math.floor(((now - startTime) / (maturityTime - startTime)) * 100), 100);
          const penaltyPercentage = Number(savingData.penaltyPercentage);
  
          if (isEth) {
            const ethAmount = parseFloat(currentFormatted);
            totalUsdValue += ethAmount * currentEthPrice;
          } else {
            totalUsdValue += parseFloat(currentFormatted);
          }
  
          totalDeposits++;
  
          const planData = {
            id: savingName,
            address: userChildContractAddress,
            name: savingName,
            currentAmount: currentFormatted,
            targetAmount: targetFormatted,
            progress,
            isEth,
            startTime: startTime / 1000,
            maturityTime: maturityTime / 1000,
            penaltyPercentage,
            tokenName
          };
  
          if (progress >= 100 || now >= maturityTime) {
            completedPlans.push(planData);
          } else {
            currentPlans.push(planData);
          }
  
        } catch (err) {
          console.error(`Failed to process plan "${savingName}":`, err);
        }
      }
    
  
      // Sort by most recent
      currentPlans.sort((a, b) => b.startTime - a.startTime);
      completedPlans.sort((a, b) => b.startTime - a.startTime);
  
      setSavingsData({
        totalLocked: totalUsdValue.toFixed(2),
        deposits: totalDeposits,
        rewards: "0.00",
        currentPlans,
        completedPlans
      });
  
    } catch (error) {
      console.error("Unhandled error in fetchSavingsData:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const openTopUpModal = (planName: string, planId: string, isEth: boolean, tokenName: string = '') => {
    setTopUpModal({ 
      isOpen: true, 
      planName, 
      planId, 
      isEth,
      isGToken: tokenName === '$G'
    });
  };

  const closeTopUpModal = () => {
    setTopUpModal({ isOpen: false, planName: '', planId: '', isEth: false, isGToken: false });
  };

  const [withdrawModal, setWithdrawModal] = useState({
    isOpen: false,
    planName: '',
    planId: '',
    isEth: false,
    penaltyPercentage: 0
  });

  const openWithdrawModal = (planId: string, planName: string, isEth: boolean, penaltyPercentage: number = 5) => {
    setWithdrawModal({
      isOpen: true,
      planName,
      planId,
      isEth,
      penaltyPercentage
    });
  };

  const closeWithdrawModal = () => {
    setWithdrawModal({ isOpen: false, planId: '', planName: '', isEth: false, penaltyPercentage: 0 });
  };

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    setIsLeaderboardLoading(true);
    try {
      const response = await fetch('https://bitsaveapi.vercel.app/leaderboard', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || ''
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await response.json() as LeaderboardEntry[];

      const rankedData = data
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.totalamount - a.totalamount)
        .slice(0, 4)
        .map((user: LeaderboardEntry, index: number) => ({
          ...user,
          rank: index + 1,
          datetime: new Date().toISOString().split('T')[0]
        }));

      setLeaderboardData(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLeaderboardData([]);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchLeaderboardData();
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);


  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  useEffect(() => {
    if (mounted && address) {
      fetchSavingsData();
    }
  }, [mounted, address]);

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push('/');
    }
  }, [isConnected, mounted, router]);

  if (!mounted) {
    return (
      <div className={`${spaceGrotesk.variable} min-h-screen flex items-center justify-center bg-[#f2f2f2]`}>
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
      </div>
    );
  }

  const EmptyCurrentSavings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-8 text-center"
    >
      <div className="mx-auto w-24 h-24 bg-[#81D7B4]/10 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-[#81D7B4]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-8-6h16" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No Savings Plans Yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">Start your savings journey by creating your first savings plan.</p>
      <Link href="/dashboard/create-savings" className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 text-white font-medium rounded-xl shadow-[0_4px_10px_rgba(129,215,180,0.3)] hover:shadow-[0_6px_15px_rgba(129,215,180,0.4)] transition-all duration-300 transform hover:translate-y-[-2px]">
        Create Your First Plan
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Link>
    </motion.div>
  );

  const EmptyCompletedSavings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-8 text-center"
    >
      <div className="mx-auto w-24 h-24 bg-green-100/50 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-green-500/70">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No Completed Plans Yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">Your completed savings plans will appear here. Keep saving to reach your goals!</p>
      <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200/50 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Keep Saving
      </div>
    </motion.div>
  );

  return (
    <div className={`${spaceGrotesk.variable} font-sans p-4 sm:p-6 md:p-8 bg-[#f2f2f2] text-gray-800 relative min-h-screen pb-8 overflow-x-hidden`}>
      {/* Network Warning Banner - Only show if not on Base or Celo */}
      {!isCorrectNetwork && address && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-200 z-50 p-3 flex items-center justify-center">
          <div className="flex items-center max-w-4xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-800 text-sm">Please switch to Base or Celo network to use BitSave</span>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => switchToNetwork('Base')}
                disabled={switchingNetwork}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium py-1 px-3 rounded-full transition-colors disabled:opacity-70"
              >
                {switchingNetwork ? 'Switching...' : 'Switch to Base'}
              </button>
              <button
                onClick={() => switchToNetwork('Celo')}
                disabled={switchingNetwork}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium py-1 px-3 rounded-full transition-colors disabled:opacity-70"
              >
                {switchingNetwork ? 'Switching...' : 'Switch to Celo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={topUpModal.isOpen}
        onClose={closeTopUpModal}
        planName={topUpModal.planName}
        planId={topUpModal.planId}
        isEth={topUpModal.isEth}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={withdrawModal.isOpen}
        onClose={closeWithdrawModal}
        planName={withdrawModal.planName}
        planId={withdrawModal.planId}
        isEth={withdrawModal.isEth}
        penaltyPercentage={withdrawModal.penaltyPercentage}
      />

      {/* Update Modal */}
      {showUpdateModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden border border-white/60">
            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{selectedUpdate.title}</h3>
                <button
                  onClick={closeUpdateModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                {new Date(selectedUpdate.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              <div className="text-gray-700 mb-6">
                {selectedUpdate.content}
              </div>

              <button
                onClick={closeUpdateModal}
                className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 rounded-xl shadow-[0_4px_12px_rgba(129,215,180,0.4)] hover:shadow-[0_8px_20px_rgba(129,215,180,0.5)] transition-all duration-300"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grain overlay */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[url('/noise.jpg')] mix-blend-overlay" ></div>

      {/* Decorative elements - adjusted for mobile */}
      <div className="absolute top-20 right-10 md:right-20 w-40 md:w-64 h-40 md:h-64 bg-[#81D7B4]/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 md:left-20 w-40 md:w-80 h-40 md:h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>


      {/* Header - responsive adjustments */}
      <div className="flex justify-between items-center mb-6 md:mb-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Welcome back, {displayName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User')}
          </p>
        </div>
        {/* Notification bell with responsive positioning - aligned with menu bar */}
        <div className="flex items-center space-x-3 relative mr-12 md:mr-0 mb-10 px-3 py-3">
          <button
            id="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {updates.some(update => update.isNew) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#81D7B4] rounded-full border-2 border-white"></span>
            )}
          </button>


          {/* Notifications dropdown - improved positioning for mobile */}
          {showNotifications && (
            <div className="fixed right-4 md:right-4 top-20 w-[calc(100vw-2rem)] md:w-80 max-w-sm bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/60 z-[9999] overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Updates</h3>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {updates.length > 0 ? (
                  updates.map(update => (
                    <button
                      key={update.id}
                      onClick={() => openUpdateModal(update)}
                      className="w-full text-left p-4 hover:bg-[#81D7B4]/5 border-b border-gray-100 last:border-b-0 transition-colors relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm">{update.title}</h4>
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{update.content}</p>
                          <span className="text-gray-400 text-xs mt-2 block">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        </div>
                        {update.isNew && (
                          <span className="bg-[#81D7B4] text-white text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No new updates
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50/80 border-t border-gray-100">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Total Value Card - responsive padding */}
        <div className="md:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-5 md:p-8 border border-white/50 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#81D7B4]/10 rounded-full blur-2xl group-hover:bg-[#81D7B4]/20 transition-all duration-500"></div>

                   {/* Card header with token selector */}
                   <div className="flex items-center mb-6 md:mb-8">
            <div className="relative">
              <button
                onClick={() => document.getElementById('chain-dropdown')?.classList.toggle('hidden')}
                className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2.5 border border-gray-200/50 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="bg-gray-100 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center mr-2 shadow-sm overflow-hidden">
                  <img
                    src={`/${isBaseNetwork ? 'base.svg' : 'celo.png'}`}
                    alt={isBaseNetwork ? 'Base' : 'Celo'}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain"
                  />
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">{isBaseNetwork ? 'Base' : 'Celo'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5 ml-2 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div id="chain-dropdown" className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 z-10 hidden">
                {['Base', 'Arbitrum', 'Celo'].map((chain) => (
                  <button
                    key={chain}
                    onClick={() => {
                      if (chain === 'Base' || chain === 'Celo') {
                        document.getElementById('chain-dropdown')?.classList.add('hidden');
                        // Switch network when chain is selected
                        switchToNetwork(chain);
                      }
                    }}
                    className={`flex items-center w-full px-4 py-2 hover:bg-gray-100/80 text-left text-sm ${chain === 'Arbitrum' ? 'opacity-50 pointer-events-none' : ''} ${(chain === 'Base' && isBaseNetwork) || (chain === 'Celo' && !isBaseNetwork) ? 'bg-gray-100/80' : ''}`}
                  >
                    <div className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center mr-2 overflow-hidden">
                      <img
                        src={`/${chain.toLowerCase()}${chain === 'Arbitrum' || chain === 'Celo' ? '.png' : '.svg'}`}
                        alt={chain}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <div className="flex items-center">
                      {chain}
                      {chain === 'Arbitrum' && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded whitespace-nowrap">Coming Soon</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main value display - responsive text sizes */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-10 md:h-12 bg-gradient-to-b from-[#81D7B4] to-green-400 rounded-full"></div>
            <div className="pl-4">
              <span className="block text-gray-500 text-xs md:text-sm mb-1">Total Value Locked</span>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800 tracking-tight flex items-baseline">
                ${parseFloat(savingsData.totalLocked).toFixed(2)}
                <span className="text-xs md:text-sm font-medium text-gray-500 ml-2">USD</span>
              </h2>
            </div>
          </div>

          {/* Card footer with stats - updated to use real data */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-200/50 flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Total Savings Plan</span>
              <span className="text-base md:text-lg font-semibold text-gray-800">{savingsData.deposits}</span>
            </div>

            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-200/50 flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Rewards</span>
              <span className="text-base md:text-lg font-semibold text-gray-800">${savingsData.rewards}</span>
            </div>
          </div>
        </div>

        {/* Leaderboard - responsive adjustments */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/50 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-[#81D7B4]/5 rounded-full blur-3xl"></div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
            <Link href="/dashboard/leaderboard" className="text-xs font-medium text-[#81D7B4] bg-[#81D7B4]/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#81D7B4]/20 hover:bg-[#81D7B4]/20 transition-all duration-300 flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-4">
            {isLeaderboardLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
              </div>
            ) : leaderboardData.length > 0 ? (
              leaderboardData.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#81D7B4]/5 transition-all duration-300 border border-transparent hover:border-[#81D7B4]/20">
                  <div className="flex items-center">
                    <div className="w-7 h-7 flex items-center justify-center font-bold text-sm bg-[#81D7B4]/10 rounded-full mr-3 text-[#81D7B4] border border-[#81D7B4]/30">
                      {item.rank}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">
                        {item.useraddress.slice(0, 6)}...{item.useraddress.slice(-4)}
                      </span>
                      <span className="text-xs text-gray-500">{item.chain}</span>
                    </div>
                  </div>
                  <span className="font-medium text-[#81D7B4] bg-[#81D7B4]/10 px-2.5 py-1 rounded-full text-sm shadow-sm">${item.totalamount.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No leaderboard data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Savings Button - responsive padding */}
      <div className="mt-4 md:mt-6 bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)] transition-all duration-500 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.04] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tl from-[#81D7B4]/20 to-blue-300/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/30 transition-all duration-700"></div>
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-gradient-to-br from-purple-300/10 to-transparent rounded-full blur-3xl opacity-70"></div>

        <Link href="/dashboard/create-savings" className="flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300">
          <div className="bg-gradient-to-br from-[#81D7B4] to-[#81D7B4]/90 rounded-full p-3.5 mr-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_10px_rgba(129,215,180,0.4),0_1px_2px_rgba(0,0,0,0.3)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_15px_rgba(129,215,180,0.5),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6 drop-shadow-sm">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">Create Savings</span>
        </Link>
      </div>

      {/* Savings Plans - responsive spacing */}
      <div className="mt-6 md:mt-8 mb-8">

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4 md:mb-6">
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm ${activeTab === 'current' ? 'text-[#81D7B4] border-b-2 border-[#81D7B4]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('current')}
          >
            Current
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm ${activeTab === 'completed' ? 'text-[#81D7B4] border-b-2 border-[#81D7B4]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>

          {/* Fixed View All Plans button - show only when there are more than 3 plans */}
          <div className="ml-auto">
            {((activeTab === 'current' && savingsData.currentPlans.length > 3) ||
              (activeTab === 'completed' && savingsData.completedPlans.length > 3)) && (
                <Link
                  href="/dashboard/plans"
                  className="text-xs font-medium text-[#81D7B4] bg-[#81D7B4]/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#81D7B4]/20 hover:bg-[#81D7B4]/20 transition-all duration-300 flex items-center"
                >
                  View All Plans
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
          </div>
        </div>

        {/* Savings plan cards with empty states */}
        {activeTab === 'current' && (
          <div className="flex flex-col gap-4 md:gap-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
              </div>
            ) : savingsData.currentPlans.length > 0 ? (
              <>
                {/* Show only first 3 plans on dashboard */}
                {savingsData.currentPlans.slice(0, 3).map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 hover:shadow-[0_8px_32px_rgba(129,215,180,0.2)] transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Enhanced glassmorphism effects */}
                    <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#81D7B4]/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/20 transition-all duration-500"></div>
                    <div className="absolute -left-10 -top-10 w-60 h-60 bg-[#81D7B4]/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/20 transition-all duration-500"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80"></div>

                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 bg-[#81D7B4]/10 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#81D7B4]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 truncate max-w-[180px] sm:max-w-[220px] md:max-w-[300px]">{plan.name}</h3>
                          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200/40 shadow-sm">
                            <img
                              src={plan.isEth ? '/eth.png' : `/${plan.tokenName.toLowerCase()}.png`}
                              alt={plan.isEth ? 'ETH' : plan.tokenName}
                              className="w-4 h-4 mr-2"
                            />
                            <span className="text-xs font-medium text-gray-700">
                              {plan.isEth ? 'ETH' : plan.tokenName} on {isBaseNetwork ? 'Base' : 'Celo'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openTopUpModal(plan.name, plan.id, plan.isEth)}
                        className="bg-gradient-to-r from-[#81D7B4]/20 to-[#81D7B4]/10 text-[#81D7B4] text-xs font-medium px-4 py-2 rounded-full border border-[#81D7B4]/30 hover:from-[#81D7B4]/30 hover:to-[#81D7B4]/20 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <span>Top Up</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-800">{Math.round(plan.progress)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100/80 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#81D7B4] to-green-400 rounded-full shadow-[0_0_12px_rgba(129,215,180,0.6)]"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-500">
                          {(() => {
                            // Calculate remaining time
                            const currentDate = new Date();
                            const maturityTimestamp = Number(plan.maturityTime || 0);
                            const maturityDate = new Date(maturityTimestamp * 1000);

                            if (isNaN(maturityDate.getTime())) return '';

                            const remainingTime = maturityDate.getTime() - currentDate.getTime();
                            const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

                            if (remainingDays === 0) return 'Completed';
                            if (remainingDays === 1) return '1 day remaining';
                            if (remainingDays < 30) return `${remainingDays} days remaining`;

                            const remainingMonths = Math.ceil(remainingDays / 30);
                            return remainingMonths === 1 ? '1 month remaining' : `${remainingMonths} months remaining`;
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced amount display with stronger neomorphism */}
                    <div className="mb-5 bg-gradient-to-br from-white to-gray-50/90 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_16px_rgba(129,215,180,0.1)] relative overflow-hidden group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_20px_rgba(129,215,180,0.2)] transition-all duration-300">
                      <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#81D7B4]/5 rounded-full blur-xl"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Current Amount</span>
                        <span className="text-lg font-semibold text-gray-800 flex items-baseline">
                          {plan.isEth ? (
                            <>
                              {parseFloat(plan.currentAmount).toFixed(4)}
                              <span className="text-xs font-medium text-gray-500 ml-1">ETH</span>
                            </>
                          ) : (
                            <>
                              {parseFloat(plan.currentAmount).toFixed(2)}
                              <span className="text-xs font-medium text-gray-500 ml-1">{plan.tokenName}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Updated view details button with #81D7B4 color */}
                    <button
                      onClick={() => openWithdrawModal(plan.id, plan.name, plan.isEth, plan.penaltyPercentage)}
                      className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 rounded-xl shadow-[0_4px_12px_rgba(129,215,180,0.4)] hover:shadow-[0_8px_20px_rgba(129,215,180,0.5)] transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        Withdraw
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  </motion.div>
                ))}
              </>
            ) : (
              <EmptyCurrentSavings />
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="flex flex-col gap-4 md:gap-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
              </div>
            ) : savingsData.completedPlans.length > 0 ? (
              <>
                {/* Show only first 3 completed plans on dashboard */}
                {savingsData.completedPlans.slice(0, 3).map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.1)] p-6 hover:shadow-[0_8px_32px_rgba(129,215,180,0.2)] transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Enhanced glassmorphism effects */}
                    <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#81D7B4]/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/20 transition-all duration-500"></div>
                    <div className="absolute -left-10 -top-10 w-60 h-60 bg-[#81D7B4]/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/20 transition-all duration-500"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80"></div>

                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                        <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200/40 shadow-sm">
                          <img
                            src={plan.isEth ? '/eth.png' : `/${plan.tokenName.toLowerCase()}.png`}
                            alt={plan.isEth ? 'ETH' : plan.tokenName}
                            className="w-4 h-4 mr-2"
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {plan.isEth ? 'ETH' : plan.tokenName} on {isBaseNetwork ? 'Base' : 'Celo'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => openTopUpModal(plan.name, plan.id, plan.isEth)}
                        className="bg-gradient-to-r from-[#81D7B4]/20 to-[#81D7B4]/10 text-[#81D7B4] text-xs font-medium px-4 py-2 rounded-full border border-[#81D7B4]/30 hover:from-[#81D7B4]/30 hover:to-[#81D7B4]/20 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <span>Top Up</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-800">100%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100/80 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80 rounded-full shadow-[0_0_12px_rgba(129,215,180,0.6)]"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>

                    {/* Enhanced amount display with stronger neomorphism */}
                    <div className="mb-5 bg-gradient-to-br from-white to-gray-50/90 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_16px_rgba(129,215,180,0.1)] relative overflow-hidden group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_20px_rgba(129,215,180,0.2)] transition-all duration-300">
                      <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#81D7B4]/5 rounded-full blur-xl"></div>
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold text-gray-800">${parseFloat(plan.currentAmount).toFixed(2)}</span>
                        <span className="block text-xs text-gray-500 mt-1">Amount Saved</span>
                      </div>
                    </div>

                    {/* Updated view details button with #81D7B4 color */}
                    <button
                      onClick={() => openWithdrawModal(plan.id, plan.name, plan.isEth)}
                      className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 rounded-xl shadow-[0_4px_12px_rgba(129,215,180,0.4)] hover:shadow-[0_8px_20px_rgba(129,215,180,0.5)] transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden group"
                    >

                    </button>
                  </motion.div>
                ))}
              </>
            ) : (
              <EmptyCompletedSavings />
            )}
          </div>
        )}
      </div>
    </div>
  );
}



