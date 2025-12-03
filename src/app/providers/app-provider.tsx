import type { PropsWithChildren } from 'react';

import { QueryClientRootProvider } from './query-client-provider';

type AppProviderProps = PropsWithChildren;

const AppProvider = ({ children }: AppProviderProps) => {
  return <QueryClientRootProvider>{children}</QueryClientRootProvider>;
};

export { AppProvider };
