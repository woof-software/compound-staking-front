import type { PropsWithChildren } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

type HeaderTagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

const text = cva('text-primary-11', {
  variants: {
    size: {
      '11': 'text-[11px]',
      '13': 'text-[13px]',
      '15': 'text-[15px]',
      '16': 'text-[16px]',
      '17': 'text-[17px]',
      '32': 'text-[32px]',
      '40': 'text-[40px]',
      '45': 'text-[45px]'
    },
    weight: {
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold'
    },
    lineHeight: {
      '14': 'leading-[14px]',
      '16': 'leading-[16px]',
      '17': 'leading-[17px]',
      '20': 'leading-[20px]',
      '27': 'leading-[27px]',
      '38': 'leading-[38px]',
      '44': 'leading-[44px]',
      '54': 'leading-[54px]',
      '100': 'leading-[100%]'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }
  },
  defaultVariants: {
    size: '16',
    weight: '400',
    lineHeight: '100',
    align: 'left'
  }
});

type TextProps = PropsWithChildren &
  VariantProps<typeof text> & {
    className?: string;
    tag?: HeaderTagType;
  };

export const Text = ({ className, size, weight, lineHeight, align, tag: Tag = 'p', children, ...props }: TextProps) => {
  return (
    <Tag
      className={text({ size, weight, lineHeight, align, className })}
      {...props}
    >
      {children}
    </Tag>
  );
};
