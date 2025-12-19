import { useThemeStore } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/cn';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className='flex items-center'>
      <span className='inline-block h-6 max-w-full leading-6 whitespace-nowrap outline-none'>
        <label className='flex cursor-pointer items-center'>
          <span className='bg-color-9 relative h-6 w-14.5 shrink-0 rounded-xl'>
            <input
              className='absolute m-[-1px] h-0 w-0 overflow-hidden border-none p-0 whitespace-nowrap outline-none'
              type='checkbox'
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span
              className={cn(
                'shadow-10 bg-color-4 absolute top-[-3px] flex size-7.5 items-center justify-center rounded-full transition-all',
                {
                  'translate-x-full': theme === 'dark'
                }
              )}
            />
          </span>
        </label>
      </span>
    </div>
  );
}
