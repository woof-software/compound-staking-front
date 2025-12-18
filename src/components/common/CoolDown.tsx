import { useEffect, useMemo, useState } from 'react';

import { Text } from '@/components/ui/Text';
import { MINUTE_SECONDS } from '@/consts/common';
import { noop } from '@/lib/utils/common';
import { FormatTime } from '@/lib/utils/format';

export type CoolDownProps = {
  totalSeconds?: number;
  className?: string;
  isDisabled?: boolean;
  onStateChange?: (isUnlocked: boolean) => void;
};

export function CoolDown(props: CoolDownProps) {
  const { totalSeconds = 0, className = '', isDisabled = false, onStateChange = noop } = props;

  const [secondsLeft, setSecondsLeft] = useState<number>(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  const { days, hours } = useMemo(() => FormatTime.durationTime(secondsLeft), [secondsLeft]);

  const countdownLabel = useMemo(() => FormatTime.cooldownFromSeconds(secondsLeft), [secondsLeft]);

  const label = isDisabled ? countdownLabel : '-';

  useEffect(() => {
    if (!secondsLeft || secondsLeft <= 0) return;

    if (days > 0 || hours > 0) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) return 0;

        if (prev > 60) return prev - 60;

        return 0;
      });
    }, MINUTE_SECONDS);

    return () => clearInterval(id);
  }, [secondsLeft, days, hours]);

  useEffect(() => {
    if (!totalSeconds) return;

    const isUnlocked = !totalSeconds;
    onStateChange(isUnlocked);
  }, [totalSeconds, onStateChange]);

  return (
    <Text
      size='17'
      weight='500'
      lineHeight='17'
      className={className}
    >
      {label}
    </Text>
  );
}
