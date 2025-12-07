import type { SetStateAction } from 'react';
import { useMemo, useState } from 'react';

type UseSwitchRet = {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  update: (v: SetStateAction<boolean>) => void;
};

export function useSwitch(initial?: boolean): UseSwitchRet {
  const [isEnabled, setIsEnabled] = useState<boolean>(initial ?? false);

  if (typeof initial === 'boolean' && initial !== isEnabled) {
    setIsEnabled(initial);
  }

  const actions = useMemo(() => {
    return {
      enable: () => {
        setIsEnabled(true);
      },
      disable: () => {
        setIsEnabled(false);
      },
      toggle: () => {
        setIsEnabled((v) => !v);
      },
      update: (v: SetStateAction<boolean>) => {
        setIsEnabled(v);
      }
    };
  }, []);

  return {
    isEnabled,
    ...actions
  };
}
