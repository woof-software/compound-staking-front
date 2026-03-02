import { Outlet } from '@tanstack/react-router';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function RootLayout() {
  return (
    <div className='mx-0 flex min-h-dvh max-w-271 flex-col md:mx-auto md:px-2'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
