import type { ReactNode } from 'react';
import { Children } from 'react';

export type EachProps<T> = {
  render: (item: T, index: number, itemArr: T[]) => ReactNode;

  data: T[];
};

export function Each<T>({ render, data }: EachProps<T>) {
  return <>{Children.toArray(data.map((item, index, itemArr) => render(item, index, itemArr)))}</>;
}
