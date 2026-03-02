import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { QueryClientRootProvider } from '@/app/providers/query-client-provider';
import { routeTree } from '@/app/routes/routeTree.gen';
import { ENV } from '@/consts/env';
import { config } from '@/shared/config/wagmiConfig';

import './index.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientRootProvider>
      <RouterProvider router={router} />
      {ENV.MODE === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientRootProvider>
  </WagmiProvider>
);
