import type { PropsWithChildren } from 'react';

export type ConditionProps = PropsWithChildren<{
  if: any;
}>;

export function Condition({ if: condition, children }: ConditionProps) {
  if (condition) {
    return <>{children}</>;
  }

  return null;
}
