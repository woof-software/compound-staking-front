import type { FC } from 'react';

import type { Theme } from '@/app/providers/ThemeProvider/theme-provider';
import { cn } from '@/lib/utils/cn';

type ThemeSwitcherProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const isDark = theme === 'dark';

  const handleToggle = () => {
    if (isDark) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <div className='flex items-center'>
      <span className='inline-block h-6 leading-6 max-w-full whitespace-nowrap outline-none'>
        <label className='cursor-pointer flex items-center'>
          <span className='relative h-6 w-[58px] shrink-0 rounded-xl bg-color-9'>
            <input
              className='outline-none border-none w-[1px] h-[1px] overflow-hidden absolute whitespace-nowrap p-0 m-[-1px]'
              type='checkbox'
              checked={isDark}
              onChange={handleToggle}
            />
            <span
              className={cn(
                'absolute shadow-10 top-[-3px] flex items-center justify-center size-[30px] transition-all rounded-[50%] bg-color-4',
                {
                  'translate-x-[calc(100%-2px)]': isDark
                }
              )}
            />
          </span>
        </label>
      </span>
    </div>
  );
};
