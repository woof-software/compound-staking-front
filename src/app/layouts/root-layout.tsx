import { Outlet } from '@tanstack/react-router';

import Footer from '@/components/layout/Footer';
import { useThemeStore } from '@/hooks/useTheme';

const RootLayout = () => {
  const { theme, setTheme } = useThemeStore((state) => state);

  return (
    <div className='max-w-5xl mx-auto'>
      <Outlet />
      <Footer
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export { RootLayout };
