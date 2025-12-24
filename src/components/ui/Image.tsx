import type { ComponentPropsWithoutRef } from 'react';

export interface ImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'src'> {
  src: string;
}

export function Image(props: ImageProps) {
  const { src, ...rest } = props;

  return (
    <img
      src={`/src/assets${src}`}
      alt='Image'
      {...rest}
    />
  );
}
