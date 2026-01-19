import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export type QueryClientRootProviderProps = PropsWithChildren;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,

      refetchInterval: 60 * 1000,
      refetchIntervalInBackground: true
    }
  }
});

export function QueryClientRootProvider({ children }: QueryClientRootProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
