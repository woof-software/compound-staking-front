import { Outlet } from '@tanstack/react-router';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function RootLayout() {
  return (
    <div className='mx-auto flex h-screen max-w-271 flex-col'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
