import { useState } from 'react';

export function useBoolean(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(() => Boolean(initialValue));

  const enable = () => setValue(true);

  const disable = () => setValue(false);

  const toggle = () => setValue((v) => !v);

  const update = (value: boolean) => setValue(value);

  return { value, setValue, enable, disable, toggle, update };
}
