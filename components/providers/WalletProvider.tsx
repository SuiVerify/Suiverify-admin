'use client';

import { SuiClientProvider, WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { NETWORK_CONFIG } from '@/config/contracts';

// Import dApp Kit styles
import '@mysten/dapp-kit/dist/index.css';

interface Props {
  children: ReactNode;
}

export function WalletProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  const networks = {
    testnet: { url: getFullnodeUrl('testnet') },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <SuiWalletProvider autoConnect>
          {children}
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
