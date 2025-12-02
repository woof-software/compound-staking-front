import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

import { useTheme, withTheme } from './app/providers/ThemeProvider/theme-provider';

function App() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      <ThemeSwitcher
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}

export default withTheme(App);
