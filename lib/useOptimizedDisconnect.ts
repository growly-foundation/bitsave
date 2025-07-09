import { useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Optimized disconnect hook that provides immediate UI feedback
 * and faster disconnection experience
 */
export function useOptimizedDisconnect() {
  const router = useRouter();
  
  const { disconnect: wagmiDisconnect, isPending } = useDisconnect({
    mutation: {
      onSuccess: () => {
        // Immediate redirect on successful disconnect
        router.push('/');
      },
      onError: (error) => {
        console.error('Disconnect error:', error);
        // Still redirect even on error to prevent stuck state
        router.push('/');
      }
    }
  });

  const optimizedDisconnect = useCallback(() => {
    // Immediate UI feedback - start disconnect process
    wagmiDisconnect();
  }, [wagmiDisconnect]);

  return {
    disconnect: optimizedDisconnect,
    isDisconnecting: isPending
  };
}