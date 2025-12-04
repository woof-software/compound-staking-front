import type { FlexProps } from './Flex';
import { Flex } from './Flex';

export type HStackProps = Omit<FlexProps, 'direction'>;

export function HStack(props: HStackProps) {
  return (
    <Flex
      direction='row'
      {...props}
    />
  );
}
