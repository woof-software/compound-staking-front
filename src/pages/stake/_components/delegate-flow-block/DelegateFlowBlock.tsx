import { ExternalLinkIcon } from '@/assets/svg';
import { HStack } from '@/components/common/HStack';
import { Card } from '@/components/common/stake/Card';
import { VStack } from '@/components/common/VStack';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { sliceAddress } from '@/lib/utils/common';

export function DelegateFlowBlock() {
  return (
    <Card
      title='Delegation'
      tooltip='Cooldown period for redelegation process is 01d 00h 00m 00s'
    >
      <HStack justify='between'>
        <HStack gap={60}>
          <VStack
            fullWidth={false}
            gap={12}
          >
            <Text
              size='11'
              className='text-color-24'
            >
              Wallet address of Delegatee
            </Text>
            <a
              className='flex items-start gap-[3px] cursor-pointer'
              // href={getBlockExplorerUrlForTransaction('0x09fd7d573a4318f1dd34cab8000928d7270ce8e7')}
              target='_blank'
              rel='noreferrer'
            >
              <Text
                size='17'
                weight='500'
                lineHeight='17'
                className='text-color-2'
              >
                {sliceAddress('0x09fd7d573a4318f1dd34cab8000928d7270ce8e7')}
              </Text>
              <ExternalLinkIcon className='text-color-24' />
            </a>
          </VStack>
          <VStack
            fullWidth={false}
            gap={12}
          >
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
          </VStack>
        </HStack>
        <Button className='max-w-[130px] text-[11px] font-medium'>Delegate</Button>
      </HStack>
    </Card>
  );
}
