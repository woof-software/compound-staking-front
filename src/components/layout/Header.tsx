import CompoundLogoText from '@/assets/compound-logo-text.svg';

export function Header() {
  return (
    <header className='flex items-center justify-between py-5'>
      <CompoundLogoText className='h-8 w-32.5' />
    </header>
  );
}
