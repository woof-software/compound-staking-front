import type { PropsWithChildren } from 'react';
import { useConnection } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SwitchNetworkModal } from '@/components/common/switch-network-modal/SwitchNetworkModal';
import { APPLICATION_CHAIN } from '@/consts/common';

export type QueryClientRootProviderProps = PropsWithChildren;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false
    }
  }
});

function NetworkGuard({ children }: PropsWithChildren) {
  const { isConnected, chainId } = useConnection();

  if (!isConnected) return <>{children}</>;

  if (chainId === APPLICATION_CHAIN) return <>{children}</>;

  return null;
}

export function QueryClientRootProvider({ children }: QueryClientRootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkGuard>{children}</NetworkGuard>
      <SwitchNetworkModal />
    </QueryClientProvider>
  );
}
