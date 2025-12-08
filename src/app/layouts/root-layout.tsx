import { Outlet } from '@tanstack/react-router';

import { SwitchNetworkModal } from '@/components/common/switch-network-modal/SwitchNetworkModal';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useEthereumNetworkCheck } from '@/hooks/useEthereumNetworkCheck';

export function RootLayout() {
  const { isShowSwitchNetworkModal } = useEthereumNetworkCheck();

  return (
    <div className='max-w-5xl mx-auto flex flex-col h-screen'>
      <Header />
      <Outlet />
      <Footer />
      <SwitchNetworkModal isOpen={isShowSwitchNetworkModal} />
    </div>
  );
}
