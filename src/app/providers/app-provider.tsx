import type { PropsWithChildren } from 'react';

import { QueryClientRootProvider } from './query-client-provider';

type AppProviderProps = PropsWithChildren;

export function AppProvider({ children }: AppProviderProps) {
  return <QueryClientRootProvider>{children}</QueryClientRootProvider>;
}
