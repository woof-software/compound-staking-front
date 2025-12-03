import { useThemeStore } from './hooks/useTheme';

function App() {
  const { theme, setTheme } = useThemeStore((state) => state);

  return (
    <div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>

      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Click</button>
    </div>
  );
}

export default App;
