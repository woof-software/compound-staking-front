import { lazy } from 'react';

import { Condition } from '@/components/common/Condition';
import { HStack } from '@/components/common/HStack';
import { Card } from '@/components/common/stake/Card';
import { VStack } from '@/components/common/VStack';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { useSwitch } from '@/hooks/useSwitch';
import { useThemeStore } from '@/hooks/useTheme';

import NoPositionYet from '@/assets/no-position-yet.svg';
import NoPositionYetLight from '@/assets/no-position-yet-light.svg';

const LazyVestingModal = lazy(() => import('@/components/common/stake/VestingModal'));

export function RewardsFlowBlock() {
  const { theme } = useThemeStore();

  const { isEnabled: isVestingOpen, enable: onVestingOpen, disable: onVestingClose } = useSwitch();

  return (
    <>
      <Card
        title='Stake'
        tooltip='Stake your COMP tokens to earn yield every second!'
        classNames={{
          content: 'px-0'
        }}
      >
        <HStack
          justify='between'
          className='border-b border-color-8 px-10 pb-5'
        >
          <HStack>
            <VStack gap={12}>
              <Text
                size='11'
                className='text-color-24'
              >
                Available Rewards
              </Text>
              <Text
                size='17'
                weight='500'
              >
                0.0000 COMP
              </Text>
            </VStack>
            <VStack gap={12}>
              <Text
                size='11'
                className='text-color-24'
              >
                Total to claim
              </Text>
              <Text
                size='17'
                weight='500'
              >
                0.0000 COMP
              </Text>
            </VStack>
            <Button className='max-w-[130px] text-11 font-medium'>Claim</Button>
          </HStack>
          <Divider
            orientation='vertical'
            className='max-h-10 !min-h-10 mx-12'
          />
          <HStack>
            <VStack gap={12}>
              <Text
                size='11'
                className='text-color-24'
              >
                Available Rewards
              </Text>
              <VStack gap={7}>
                <Text
                  size='17'
                  weight='500'
                >
                  0.0000 COMP
                </Text>
                <Text
                  size='11'
                  className='text-color-24'
                >
                  $40.00
                </Text>
              </VStack>
            </VStack>
            <Button
              onClick={onVestingOpen}
              className='max-w-[130px] text-11 font-medium'
            >
              Vest
            </Button>
          </HStack>
        </HStack>
        <HStack className='p-10'>
          <VStack
            gap={20}
            className='mx-auto items-center w-auto'
          >
            <Condition if={theme === 'dark'}>
              <NoPositionYet className='w-[176px] h-20' />
            </Condition>
            <Condition if={theme === 'light'}>
              <NoPositionYetLight className='w-[176px] h-20' />
            </Condition>
            <Text
              size='15'
              weight='500'
              lineHeight='16'
            >
              No Positions Yet
            </Text>
            <Text
              size='15'
              weight='500'
              lineHeight='21'
              className='text-color-24'
            >
              No vested rewards yet
            </Text>
          </VStack>
        </HStack>
      </Card>
      <LazyVestingModal
        isOpen={isVestingOpen}
        onClose={onVestingClose}
      />
    </>
  );
}
