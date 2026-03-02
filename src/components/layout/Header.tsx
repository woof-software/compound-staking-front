import { WalletButton } from '@/components/common/connect-wallet/WalletButton';
import { COMPOUND_FINANCE_URL } from '@/consts/common';

import CompoundLogo from '@/assets/svg/compound-logo.svg';
import CompoundLogoText from '@/assets/svg/compound-logo-text.svg';

export function Header() {
  return (
    <header className='flex items-center justify-between px-5 py-3 md:px-0 md:py-4'>
      <a
        href={COMPOUND_FINANCE_URL}
        target='_blank'
      >
        <CompoundLogoText className='text-color-2 hidden h-6.75 w-30.25 cursor-pointer md:block' />
        <CompoundLogo className='text-color-2 block h-6.75 w-5.5 cursor-pointer md:hidden' />
      </a>
      <div className='flex gap-[8px]'>
        <WalletButton />
      </div>
    </header>
  );
}
