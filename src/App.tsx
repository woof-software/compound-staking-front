import { useTheme, withTheme } from './app/providers/ThemeProvider/theme-provider';

function App() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>

      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Click</button>
    </div>
  );
}

export default withTheme(App);
