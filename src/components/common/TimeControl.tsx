import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { fastForwardTime, TIME_INTERVALS } from '@/lib/utils/tenderly';

export function DemoTimeControls() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFastForward = async (seconds: number, label: string) => {
    try {
      setIsLoading(true);

      await fastForwardTime(seconds);

      if (
        window.confirm(`✅ Time fast-forwarded by ${label}!\n\nRefresh the page to see updated rewards and balances?`)
      ) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Time control error:', error);
      alert('❌ Failed to control time. Make sure you are on Tenderly testnet.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemo = () => {
    if (window.confirm('🔄 This will reset your demo wallet and create a new one. Continue?')) {
      localStorage.removeItem('pk');
      localStorage.removeItem('demo-setup-complete');
      window.location.reload();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          className={
            'fixed right-4 bottom-4 z-5 h-[74px] w-[74px] rounded-full p-1 text-5xl text-xs text-white dark:bg-gray-600'
          }
          onClick={() => setIsOpen(true)}
        >
          ⏰
        </Button>
      )}
      {isOpen && (
        <div className='fixed right-4 bottom-4 z-5 min-w-[280px] rounded-lg p-4 shadow-lg dark:bg-gray-800'>
          <div className='mb-3 flex items-center justify-between gap-2'>
            <h3 className='text-sm font-semibold'>Demo Time Controls</h3>
            <Button
              onClick={() => setIsOpen(false)}
              className={
                'flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full p-0 dark:bg-gray-600'
              }
            >
              x
            </Button>
          </div>
          <div className='space-y-2'>
            <Button
              onClick={() => handleFastForward(TIME_INTERVALS.HOUR, '1 hour')}
              disabled={isLoading}
              className='w-full dark:bg-gray-600'
            >
              +1 Hour
            </Button>
            <Button
              onClick={() => handleFastForward(TIME_INTERVALS.DAY, '1 day')}
              disabled={isLoading}
              className='w-full dark:bg-gray-600'
            >
              +1 Day
            </Button>
            <Button
              onClick={() => handleFastForward(TIME_INTERVALS.WEEK, '1 week')}
              disabled={isLoading}
              className='w-full dark:bg-gray-600'
            >
              +1 Week
            </Button>
            <Button
              onClick={() => handleFastForward(TIME_INTERVALS.MONTH, '1 month')}
              disabled={isLoading}
              className='w-full dark:bg-gray-600'
            >
              +1 Month
            </Button>
            <hr className='my-2 dark:border-gray-600' />
            <Button
              onClick={resetDemo}
              disabled={isLoading}
              className='w-full bg-rose-400'
            >
              Reset Demo
            </Button>
          </div>
          {isLoading && <div className='mt-2 text-xs text-blue-600 dark:text-blue-400'>⏳ Processing...</div>}
        </div>
      )}
    </>
  );
}
