import { type SetStateAction, useRef } from 'react';
import { useMemo, useState } from 'react';

type UseSwitchRet = {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  update: (v: SetStateAction<boolean>) => void;
};

export function useSwitch(initial: boolean = false): UseSwitchRet {
  const [isEnabled, setIsEnabled] = useState<boolean>(initial);

  const stateRef = useRef(isEnabled);

  stateRef.current = isEnabled;

  const actions = useMemo(() => {
    return {
      enable: () => {
        if (stateRef.current) return;

        setIsEnabled(true);
      },
      disable: () => {
        if (!stateRef.current) return;

        setIsEnabled(false);
      },
      toggle: () => {
        setIsEnabled((v) => !v);
      },
      update: (v: SetStateAction<boolean>) => {
        if (stateRef.current === v) return;

        setIsEnabled(v);
      }
    };
  }, []);

  return {
    isEnabled: isEnabled,
    ...actions
  };
}
