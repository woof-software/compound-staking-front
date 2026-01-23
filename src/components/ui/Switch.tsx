import { cn } from '@/lib/utils/cn';

export type SwitchProps = {
  checked?: boolean;
  onChange?: () => void;
};

export function Switch(props: SwitchProps) {
  const { checked, onChange } = props;
  return (
    <div className='flex items-center'>
      <span className='inline-block h-6 max-w-full leading-6 whitespace-nowrap outline-none'>
        <label className='flex cursor-pointer items-center'>
          <span
            className={cn('bg-color-4 relative h-6 w-11 shrink-0 rounded-xl transition-all', {
              'bg-color-7': checked
            })}
          >
            <input
              className='absolute m-[-1px] h-0 w-0 overflow-hidden border-none p-0 whitespace-nowrap outline-none'
              type='checkbox'
              checked={checked}
              onChange={() => onChange?.()}
            />
            <span
              className={cn(
                'bg-color-16 absolute top-0.5 left-0.5 flex size-5 items-center justify-center rounded-full transition-all',
                {
                  'translate-x-full bg-white': checked
                }
              )}
            />
          </span>
        </label>
      </span>
    </div>
  );
}
