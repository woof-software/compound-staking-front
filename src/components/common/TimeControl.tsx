import { Button } from '@/components/ui/Button';
import { fastForwardTime, TIME_INTERVALS } from '@/lib/utils/tenderly';

export function TimeControlButton() {
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
      className='mr-[96px] w-[80px] text-[11px] font-medium text-white'
    >
      +1 Hour
    </Button>
  );
}
