'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import childContractABI from '../app/abi/childContractABI.js';
import CONTRACT_ABI from '@/app/abi/contractABI.js';

const BASE_CONTRACT_ADDRESS = "0x3593546078eecd0ffd1c19317f53ee565be6ca13";
const CELO_CONTRACT_ADDRESS = "0x7d839923Eb2DAc3A0d1cABb270102E481A208F33";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planId: string;
  isEth: boolean;
  penaltyPercentage?: number;
}

export default function WithdrawModal({ 
  isOpen, 
  onClose, 
  planName, 
  planId, 
  isEth,
  penaltyPercentage 
}: WithdrawModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isBaseNetwork, setIsBaseNetwork] = useState(true);
  const [currentTokenName, setCurrentTokenName] = useState(isEth ? 'ETH' : 'USDC');

  useEffect(() => {
    const detectNetwork = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const BASE_CHAIN_ID = BigInt(8453);
        const isBase = network.chainId === BASE_CHAIN_ID;
        setIsBaseNetwork(isBase);
        
        if (isEth) {
          setCurrentTokenName('ETH');
        } else {
          setCurrentTokenName(isBase ? 'USDC' : 'USDGLO');
        }
      }
    };
    
    if (isOpen) {
      detectNetwork();
    }
  }, [isOpen, isEth]);

  const getContractAddress = () => {
    return isBaseNetwork ? BASE_CONTRACT_ADDRESS : CELO_CONTRACT_ADDRESS;
  };

  const getExplorerUrl = () => {
    return isBaseNetwork ? 'https://basescan.org/tx/' : 'https://explorer.celo.org/mainnet/tx/';
  };

  // Get the network name
  const getNetworkName = () => {
    return isBaseNetwork ? 'Base' : 'Celo';
  };

  const handleWithdraw = async () => {
    try {
      const sanitizedPlanName = planName.trim();
      console.log(`Attempting to withdraw from plan: "${sanitizedPlanName}" at address: ${planId}`);
      
      if (isEth) {
        await handleEthWithdraw(sanitizedPlanName);
      } else {
        await handleTokenWithdraw(sanitizedPlanName);
      }
    } catch (err) {
      console.error("Error in handleWithdraw:", err);
      setError(`Withdrawal failed: ${err instanceof Error ? err.message : String(err)}`);
      setShowTransactionModal(true);
    }
  };

  const handleEthWithdraw = async (nameOfSavings: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contractAddress = getContractAddress();
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      
      const userChildContractAddress = await contract.getUserChildContractAddress();

      const childContract = new ethers.Contract(userChildContractAddress, childContractABI, signer);
      const savingData = await childContract.getSaving(nameOfSavings);
      const amount = ethers.formatUnits(savingData.amount, 18); 

      const gasEstimate = await contract.withdrawSaving.estimateGas(nameOfSavings);
      console.log(`Gas estimate for withdrawal: ${gasEstimate}`);

      const tx = await contract.withdrawSaving(nameOfSavings, {
        gasLimit: gasEstimate,
      });

      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        
        if (process.env.NEXT_PUBLIC_API_KEY) {
          headers["X-API-Key"] = process.env.NEXT_PUBLIC_API_KEY;
        }
        
        const apiResponse = await fetch("https://bitsaveapi.vercel.app/transactions/", {
          method: "POST",
          headers,
          body: JSON.stringify({
            amount: parseFloat(amount), 
            txnhash: receipt.hash,
            chain: getNetworkName().toLowerCase(),
            savingsname: nameOfSavings,
            useraddress: userAddress,
            transaction_type: "withdrawal",
            currency: "ETH"
          })
        });
        console.log("API response:", apiResponse);
      } catch (apiError) {
        console.error("Error sending transaction data to API:", apiError);
      }

      setSuccess(true);
      setShowTransactionModal(true);
    } catch (error: unknown) {
      console.error("Error during ETH withdrawal:", error);
      setError(`Failed to withdraw: ${error instanceof Error ? error.message : String(error)}`);
      setShowTransactionModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenWithdraw = async (nameOfSavings: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contractAddress = getContractAddress();
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      
      const userChildContractAddress = await contract.getUserChildContractAddress();
      
      
      const childContract = new ethers.Contract(userChildContractAddress, childContractABI, signer);
      const savingData = await childContract.getSaving(nameOfSavings);
      const amount = ethers.formatUnits(savingData.amount, 6); 

      const tx = await contract.withdrawSaving(nameOfSavings, {
        gasLimit: 800000,
      });

      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        
        if (process.env.NEXT_PUBLIC_API_KEY) {
          headers["X-API-Key"] = process.env.NEXT_PUBLIC_API_KEY;
        }
        
        const apiResponse = await fetch("https://bitsaveapi.vercel.app/transactions/", {
          method: "POST",
          headers,
          body: JSON.stringify({
            amount: parseFloat(amount), 
            txnhash: receipt.hash,
            chain: getNetworkName().toLowerCase(),
            savingsname: nameOfSavings,
            useraddress: userAddress,
            transaction_type: "withdrawal",
            currency: currentTokenName
          })
        });
        console.log("API response:", apiResponse);
      } catch (apiError) {
        console.error("Error sending transaction data to API:", apiError);
      }

      setSuccess(true);
      setShowTransactionModal(true);
    } catch (error: unknown) {
      console.error(`Error during ${currentTokenName} withdrawal:`, error);
      setError(`Failed to withdraw: ${error instanceof Error ? error.message : String(error)}`);
      setShowTransactionModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    if (success) {
      onClose();
      window.location.reload();
    } else {
      onClose();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {showTransactionModal ? (
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
          <div className="p-5 sm:p-8 flex flex-col items-center">
            {/* Success or Error Icon */}
            <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6 ${success ? 'bg-green-100' : 'bg-red-100'}`}>
              {success ? (
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-red-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-1 sm:mb-2">
              {success ? 'Successful' : 'Failed'}
            </h2>
            
            {/* Message */}
            <p className="text-sm sm:text-base text-gray-500 text-center mb-5 sm:mb-8 max-w-xs sm:max-w-none mx-auto">
              {success 
                ? 'Your withdrawal has been processed and is successful.'
                : `Your withdrawal failed, please contact customer care for support.`}
              {!success && error && (
                <span className="block mt-2 text-xs text-red-500">
                  {(() => {
                    // Better error extraction
                    if (error.includes("INVALID_ARGUMENT")) {
                      return "Invalid argument: The plan name may be incorrect or contain special characters";
                    } else if (error.includes("code=")) {
                      const codeMatch = error.match(/code=([A-Z_]+)/);
                      return codeMatch ? `Error: ${codeMatch[1]}` : error;
                    } else if (error.includes(":")) {
                      return error.split(":").pop()?.trim();
                    } else {
                      return error;
                    }
                  })()}
                </span>
              )}
            </p>
            
            {/* Transaction ID Button */}
            <button 
              className="w-full py-2.5 sm:py-3 border border-gray-300 rounded-full text-gray-700 text-sm sm:text-base font-medium mb-3 sm:mb-4 hover:bg-gray-50 transition-colors"
              onClick={() => txHash && window.open(`${getExplorerUrl()}${txHash}`, '_blank')}
              disabled={!txHash}
            >
              View Transaction ID
            </button>
            
            {/* Action Buttons */}
            <div className="flex w-full gap-3 sm:gap-4 flex-col sm:flex-row">
              <button 
                className="w-full py-2.5 sm:py-3 bg-gray-100 rounded-full text-gray-700 text-sm sm:text-base font-medium flex items-center justify-center hover:bg-gray-200 transition-colors"
                onClick={() => txHash && window.open(`${getExplorerUrl()}${txHash}`, '_blank')}
                disabled={!txHash}
              >
                Go To Explorer
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </button>
              <button 
                className="w-full py-2.5 sm:py-3 bg-gray-700 rounded-full text-white text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
                onClick={handleCloseTransactionModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-6 md:p-8 border border-white/60 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#81D7B4]/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -top-20 w-60 h-60 bg-[#81D7B4]/10 rounded-full blur-3xl"></div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-[#81D7B4]/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#81D7B4]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v4h1a1 1 0 01.7 1.7l-4 4a1 1 0 01-1.4 0l-4-4A1 1 0 018 8h1V4h2v4h1l-3 3-3-3h1V4h2v4H7V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Withdraw Funds</h3>
            <p className="text-gray-600 mb-2">
              You are about to withdraw from <span className="font-medium text-gray-800">{planName}</span>
            </p>
            <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200/40 shadow-sm mb-4">
              <img 
                src={isEth ? '/eth.png' : isBaseNetwork ? '/base.svg' : '/celo.png'} 
                alt={isEth ? 'ETH' : getNetworkName()} 
                className="w-4 h-4 mr-2" 
              />
              <span className="text-xs font-medium text-gray-700">{isEth ? 'ETH' : currentTokenName} on {getNetworkName()}</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 backdrop-blur-md rounded-2xl p-5 border border-yellow-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_4px_16px_rgba(255,204,0,0.1)] mb-4">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-yellow-800">Early Withdrawal Warning</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Penalty Fee:</strong> You will lose {penaltyPercentage}% of your savings as the early withdrawal penalty fee you selected when creating this plan.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Lost Rewards:</strong> You will forfeit any potential rewards that would have been earned at maturity.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleWithdraw}
                disabled={isLoading}
                className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 rounded-xl shadow-[0_4px_12px_rgba(129,215,180,0.4)] hover:shadow-[0_8px_20px_rgba(129,215,180,0.5)] transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <span>Confirm Withdrawal</span>
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-3 text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all duration-300"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}