import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

import { useThemeStore } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      <ThemeSwitcher
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;
