import { cn } from '@/lib/utils/cn';

export type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  className?: string;
};

export function Divider({ orientation = 'horizontal', thickness = 1, className = '' }: DividerProps) {
  const style =
    orientation === 'vertical'
      ? { width: `${thickness}px`, height: '100%', display: 'inline-block', minHeight: '-webkit-fill-available' }
      : { height: `${thickness}px`, width: '100%' };

  return (
    <div
      role='separator'
      aria-orientation={orientation}
      className={cn('bg-color-8', className)}
      style={style}
    />
  );
}
