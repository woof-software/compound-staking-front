import { WalletButton } from '@/components/common/connect-wallet/WalletButton';
import { COMPOUND_FINANCE_URL } from '@/consts/common';

import CompoundLogoText from '@/assets/compound-logo-text.svg';

export function Header() {
  return (
    <header className='flex items-center justify-between py-4'>
      <a
        href={COMPOUND_FINANCE_URL}
        target='_blank'
      >
        <CompoundLogoText className='text-color-2 h-6.75 w-30.25 cursor-pointer' />
      </a>
      <WalletButton />
    </header>
  );
}
