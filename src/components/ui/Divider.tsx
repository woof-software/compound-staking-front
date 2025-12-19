import { cn } from '@/lib/utils/cn';

export type DividerProps = {
  orientation: 'horizontal' | 'vertical';
  thickness?: number;
  className?: string;
};

export function Divider(props: DividerProps) {
  const { orientation = 'horizontal', thickness = 1, className = '' } = props;

  const style = orientation === 'vertical' ? { width: `${thickness}px` } : { height: `${thickness}px`, width: '100%' };

  return (
    <div
      role='separator'
      aria-orientation={orientation}
      className={cn('bg-color-8', className, {
        'self-stretch': orientation === 'vertical'
      })}
      style={style}
    />
  );
}
