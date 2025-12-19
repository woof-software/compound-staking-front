import { WalletButton } from '@/components/common/connect-wallet/WalletButton';

import CompoundLogoText from '@/assets/compound-logo-text.svg';

export function Header() {
  return (
    <header className='flex items-center justify-between py-4'>
      <CompoundLogoText className='text-color-2 h-6.75 w-30.25' />
      <WalletButton />
    </header>
  );
}
