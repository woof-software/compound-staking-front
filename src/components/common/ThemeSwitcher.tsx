import { useThemeStore } from '@/hooks/useTheme';
import { cn } from '@/lib/utils/cn';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className='flex items-center'>
      <span className='inline-block h-6 leading-6 max-w-full whitespace-nowrap outline-none'>
        <label className='cursor-pointer flex items-center'>
          <span className='relative h-6 w-14.5 shrink-0 rounded-xl bg-color-9'>
            <input
              className='outline-none border-none w-0 h-0 overflow-hidden absolute whitespace-nowrap p-0 m-[-1px]'
              type='checkbox'
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span
              className={cn(
                'absolute shadow-10 top-[-3px] flex items-center justify-center size-7.5 transition-all rounded-full bg-color-4',
                {
                  'translate-x-[calc(100%-2px)]': theme === 'dark'
                }
              )}
            />
          </span>
        </label>
      </span>
    </div>
  );
}
