import { type SetStateAction, useMemo, useState } from 'react';

type UseSwitchRet = {
  isOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onToggleModal: () => void;
};

export function useSwitch(): UseSwitchRet {
  const [value, setValue] = useState<boolean>(false);

  const actions = useMemo(() => {
    return {
      enable: () => {
        setValue(true);
      },
      disable: () => {
        setValue(false);
      },
      toggle: () => {
        setValue((v) => !v);
      },
      update: (v: SetStateAction<boolean>) => {
        setValue(v);
      }
    };
  }, []);

  return {
    isOpen: value,
    onOpenModal: actions.enable,
    onCloseModal: actions.disable,
    onToggleModal: actions.toggle
  };
}
