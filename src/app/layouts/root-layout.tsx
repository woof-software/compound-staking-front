import { Outlet } from '@tanstack/react-router';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useThemeStore } from '@/hooks/useTheme';

const RootLayout = () => {
  const { theme, setTheme } = useThemeStore((state) => state);

  return (
    <div className='max-w-5xl mx-auto flex flex-col h-screen'>
      <Header />
      <Outlet />
      <Footer
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export { RootLayout };
