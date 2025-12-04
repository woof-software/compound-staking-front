import type { PropsWithChildren } from 'react';

type ConditionProps = PropsWithChildren<{
  if: any;
}>;

const Condition = ({ if: condition, children }: ConditionProps) => {
  if (condition) {
    return <>{children}</>;
  }

  return null;
};

export const View = {
  Condition
};
