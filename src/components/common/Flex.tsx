import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/lib/utils/cn';

export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'evenly';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'initial';
export type FlexDirection = 'row' | 'column';

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export type FlexProps = PropsWithChildren &
  DivProps & {
    justify?: FlexJustify;
    align?: FlexAlign;
    direction?: FlexDirection;
    gap?: number;
    fullWidth?: boolean;
  };

const justifyClasses: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  evenly: 'justify-evenly'
};

const alignClasses: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  initial: 'items-initial'
};

const directionClasses: Record<FlexDirection, string> = {
  row: 'flex-row',
  column: 'flex-col'
};

export function Flex({
  children,
  className,
  justify = 'start',
  align = 'start',
  direction = 'row',
  gap,
  fullWidth = true,
  style,
  ...rest
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex',
        justifyClasses[justify],
        alignClasses[align],
        directionClasses[direction],
        fullWidth && 'w-full',
        className
      )}
      style={{
        ...style,
        ...(gap !== undefined ? { gap: `${gap}px` } : {})
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
