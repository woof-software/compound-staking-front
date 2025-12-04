import { createRoot } from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { QueryClientRootProvider } from '@/app/providers/query-client-provider';
import { routeTree } from '@/app/routes/routeTree.gen';

import './index.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <QueryClientRootProvider>
    <RouterProvider router={router} />
  </QueryClientRootProvider>
);
