import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useAccount, useConnect, WagmiProvider } from 'wagmi';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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

const MineBlock = () => {
  const mineBlock = () =>
    fetch('https://virtual.sepolia.eu.rpc.tenderly.co/e2172497-f7b1-463c-9f29-ff6f2051d41e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'evm_mine',
        params: [],
        id: 1
      })
    });

  useEffect(() => {
    mineBlock();
  }, []);

  return null;
};

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
      <MineBlock />
      <RouterProvider router={router} />
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientRootProvider>
  </WagmiProvider>
);
