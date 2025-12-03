'use client';

import { useState } from 'react';

function useInput<T>(initialValue: T): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);

  const onChange = (newValue: T) => {
    setValue(newValue);
  };

  return [value, onChange];
}

export { useInput };
