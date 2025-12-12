import { cn } from '@/lib/utils/cn';

export type SwitchProps = {
  checked?: boolean;
  onChange?: () => void;
};

export function Switch(props: SwitchProps) {
  const { checked, onChange } = props;

  return (
    <div className='flex items-center'>
      <span className='inline-block h-6 leading-6 max-w-full whitespace-nowrap outline-none'>
        <label className='cursor-pointer flex items-center'>
          <span
            className={cn('relative h-6 w-11 transition-all shrink-0 rounded-xl bg-color-5', {
              'bg-color-7': checked
            })}
          >
            <input
              className='outline-none border-none w-0 h-0 overflow-hidden absolute whitespace-nowrap p-0 m-[-1px]'
              type='checkbox'
              checked={checked}
              onChange={() => onChange?.()}
            />
            <span
              className={cn(
                'absolute top-0.5 left-0.5 flex items-center justify-center size-5 transition-all rounded-full bg-color-16',
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
