import { Flex, type FlexProps } from './Flex';

export type VStackProps = Omit<FlexProps, 'direction'>;

export function VStack(props: VStackProps) {
  return (
    <Flex
      direction='column'
      {...props}
    />
  );
}
