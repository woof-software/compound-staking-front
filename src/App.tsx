import { useThemeStore } from './hooks/useTheme';

function App() {
  const { toggleTheme } = useThemeStore();

  return (
    <div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>

      <button onClick={toggleTheme}>Click</button>
    </div>
  );
}

export default App;
