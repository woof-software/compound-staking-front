import type { PropsWithChildren } from 'react';

export type ConditionProps = PropsWithChildren<{
  if: any;
}>;

function Condition({ if: condition, children }: ConditionProps) {
  if (condition) {
    return <>{children}</>;
  }

  return null;
}

export const View = {
  Condition
};
