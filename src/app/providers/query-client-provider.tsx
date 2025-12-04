import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type QueryClientRootProviderProps = PropsWithChildren;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false
    }
  }
});

export function QueryClientRootProvider({ children }: QueryClientRootProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
