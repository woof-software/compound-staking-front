import { Outlet } from '@tanstack/react-router';

import { MediaMobile } from '@/components/common/MediaMobile';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function RootLayout() {
  return (
    <div className='mx-2 flex min-h-dvh max-w-271 flex-col max-[1100px]:items-center max-[1100px]:justify-center min-[1100px]:mx-auto'>
      <MediaMobile>
        <Header />
        <Outlet />
        <Footer />
      </MediaMobile>
    </div>
  );
}
