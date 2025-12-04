import { useState } from 'react';

export function useInput<T>(initialValue: T): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = (newValue: T) => {
    setValue(newValue);
  };

  return [value, onChange];
}
