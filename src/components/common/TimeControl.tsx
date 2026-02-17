import { useConnection } from 'wagmi';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { fastForwardTime, TIME_INTERVALS } from '@/lib/utils/tenderly';

export function TimeControlButton() {
  const { isConnected } = useConnection();

  const handleFastForward = async (seconds: number, label: string) => {
    try {
      await fastForwardTime(seconds);

      if (
        window.confirm(`✅ Time fast-forwarded by ${label}!\n\nRefresh the page to see updated rewards and balances?`)
      ) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Time control error:', error);
      alert('❌ Failed to control time. Make sure you are on Tenderly testnet.');
    }
  };

  return (
    <Button
      onClick={() => handleFastForward(TIME_INTERVALS.HOUR, '1 hour')}
      className={cn('w-[80px] text-[11px] font-medium text-white', {
        'mr-[96px]': isConnected
      })}
    >
      +1 Hour
    </Button>
  );
}
