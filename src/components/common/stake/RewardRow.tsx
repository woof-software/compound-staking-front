import { useCallback, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

import { RewardToClaim } from '@/components/common/stake/RewardToClaim';
import { RewardVestingTimer } from '@/components/common/stake/RewardVestingTimer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import type { RewardNormalizeRet } from '@/lib/dto/rewards';
import { Format, FormatTime } from '@/lib/utils/format';
import { clamp } from '@/lib/utils/numeric';
import { useToClaimLiveStore } from '@/stores/useToClaimStore';

export interface RewardRowProps extends RewardNormalizeRet {
  baseTokenPriceValue: bigint;
  isLoading: boolean;
}

export function RewardRow(props: RewardRowProps) {
  const {
    baseTokenPriceValue,
    isLoading,

    vestingAmount,
    claimedAmount,
    startDate,
    endDate,
    percents,

    vestingAmountRaw,
    claimedAmountRaw
  } = props;

  const nowSec = dayjs().unix();
  const totalSec = Math.max(0, endDate - startDate);

  const leftSecInit = useMemo(() => Math.max(0, endDate - nowSec), [endDate, nowSec]);
  const rowKey = `${startDate}-${endDate}`;

  const setRow = useToClaimLiveStore((s) => s.setRow);
  const removeRow = useToClaimLiveStore((s) => s.removeRow);

  const updateClaimable = useCallback(
    (secondsLeft: number) => {
      const safeSecondsLeft = clamp(secondsLeft, 0, totalSec);

      const realElapsedSec = totalSec > 0 ? clamp(totalSec - safeSecondsLeft, 0, totalSec) : 0;

      const initElapsedSec = totalSec > 0 ? Math.floor((totalSec * clamp(percents, 0, 100)) / 100) : 0;

      const elapsedSec = Math.max(realElapsedSec, initElapsedSec);

      let claimableRaw = 0n;

      if (totalSec <= 0) {
        claimableRaw = vestingAmountRaw > claimedAmountRaw ? vestingAmountRaw - claimedAmountRaw : 0n;
      } else {
        const vestedRaw = (vestingAmountRaw * BigInt(elapsedSec)) / BigInt(totalSec);
        claimableRaw = vestedRaw > claimedAmountRaw ? vestedRaw - claimedAmountRaw : 0n;
      }

      setRow(rowKey, claimableRaw);
    },
    [totalSec, percents, vestingAmountRaw, claimedAmountRaw, setRow, rowKey]
  );

  useEffect(() => {
    updateClaimable(leftSecInit);

    return () => removeRow(rowKey);
  }, [leftSecInit, updateClaimable, removeRow, rowKey]);

  const toClaimRaw = useToClaimLiveStore((s) => s.byKey.get(rowKey) ?? 0n);

  return (
    <div className='even:bg-color-5 flex flex-col gap-5 rounded-sm px-8 py-6'>
      <div className='grid grid-cols-5'>
        <div>
          <Skeleton loading={isLoading}>
            <Text
              size='15'
              lineHeight='20'
              className='tabular-nums'
            >
              {Format.token(String(vestingAmount), 'compact')} COMP
            </Text>
          </Skeleton>
        </div>
        <RewardToClaim
          isLoading={isLoading}
          baseTokenPriceValue={baseTokenPriceValue}
          toClaimRaw={toClaimRaw}
        />
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {FormatTime.endDate(startDate)}
          </Text>
        </div>
        <div>
          <Text
            size='15'
            lineHeight='20'
          >
            {FormatTime.endDate(endDate)}
          </Text>
        </div>
        <div>
          <Skeleton loading={isLoading}>
            <Text
              size='15'
              lineHeight='20'
              className='tabular-nums'
            >
              {Format.token(String(claimedAmount), 'compact')} COMP
            </Text>
          </Skeleton>
        </div>
      </div>
      <RewardVestingTimer
        vestingStartDate={startDate}
        vestingEndDate={endDate}
        initProgress={percents}
        initialLeftSec={leftSecInit}
        onTickSeconds={updateClaimable}
      />
    </div>
  );
}
