// const LazyRequestUnStakeModal = lazy(() => import('@components/Modals/RequestUnStakeModal'));
// const LazyUnStakeModal = lazy(() => import('@components/Modals/UnStakeModal'));

import { InfoIcon } from '@/assets/svg';
import { Card } from '@/components/common/stake/Card';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

const UnStakeFlowBlock = () => {
  return (
    <div className='flex flex-col gap-[5px]'>
      <Card
        title='Unstake'
        tooltip='Cooldown period for unstaking process is 18d 00h 00m 00s'
      >
        <div className='flex items-start justify-between'>
          <div className='flex gap-[60px]'>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Unstake
              </Text>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className='text-color-2'
              >
                10.0000 COMP
              </Text>
              <Text
                size='13'
                className='text-color-2'
              >
                $400.00
              </Text>
            </div>
            <div className='flex flex-col gap-3'>
              <Text
                size='11'
                className='text-color-24'
              >
                Cooldown
              </Text>
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className='text-color-2'
              >
                00d 00h
              </Text>
            </div>
          </div>
          <Button
            // onClick={onOpenModal}
            className='max-w-[130px] text-[11px] font-medium'
          >
            Request unstake
          </Button>
        </div>
      </Card>
      <div className='p-2.5 pl-5 rounded-lg bg-color-26 flex items-center gap-2.5'>
        <InfoIcon className='text-color-7 size-4' />
        <Text
          size='11'
          lineHeight='16'
          className='text-color-7'
        >
          Your funds are ready to be unstaked
        </Text>
      </div>
      {/*<LazyRequestUnStakeModal isOpen={isOpen} onClose={closeModal} />*/}
      {/*{isOpen && <LazyUnStakeModal isOpen={isOpen} onClose={closeModal} /> }*/}
    </div>
  );
};

export { UnStakeFlowBlock };
