import { useEffect, useState } from 'react';

import { getNowSecSnapshot, subscribeNowSec } from '@/lib/utils/time';

export function useNowTime(enabled = true) {
  const [now, setNow] = useState(() => getNowSecSnapshot());

  useEffect(() => {
    if (!enabled) return;

    return subscribeNowSec(() => {
      setNow(getNowSecSnapshot());
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    setNow(getNowSecSnapshot());
  }, [enabled]);

  return now;
}
