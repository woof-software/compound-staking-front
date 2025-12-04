import { Outlet } from '@tanstack/react-router';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function RootLayout() {
  return (
    <div className='max-w-5xl mx-auto flex flex-col h-screen'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
