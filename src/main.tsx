import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useAccount, useConnect, WagmiProvider } from 'wagmi';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { QueryClientRootProvider } from '@/app/providers/query-client-provider';
import { routeTree } from '@/app/routes/routeTree.gen';
import { config } from '@/shared/config/wagmiConfig';

import './index.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AutoConnect() {
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const triedToConnect = useRef(false);

  useEffect(() => {
    if (triedToConnect.current) return;

    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0]! });
      triedToConnect.current = true;
    }
  }, [isConnected, connectors, connect]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientRootProvider>
      <AutoConnect />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientRootProvider>
  </WagmiProvider>
);
