import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export function useEthereumNetworkCheck() {
  const { status, chainId } = useAccount();

  const isConnected = status === 'connected';

  const [isShowSwitchNetworkModal, setIsShowSwitchNetworkModal] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsShowSwitchNetworkModal(false);
      return;
    }

    if (!chainId || chainId !== mainnet.id) {
      setIsShowSwitchNetworkModal(true);
    } else {
      setIsShowSwitchNetworkModal(false);
    }
  }, [isConnected, chainId]);

  return {
    isShowSwitchNetworkModal
  };
}
