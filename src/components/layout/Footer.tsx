import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { TALLY_GOV_URL, TERMS_URL } from '@/consts/common';

export function Footer() {
  return (
    <footer className='mx-2 mt-auto bg-transparent md:mx-0'>
      <div className='border-border-1 flex items-center justify-between border-t-[0.5px] py-5'>
        <div className='h-4'>
          <a
            className='text-color-24 hover:text-color-7 mr-[0.665rem] text-[13px] leading-3.5 font-normal sm:text-sm'
            href={TALLY_GOV_URL}
            target='_blank'
          >
            Governance
          </a>
          <a
            className='text-color-24 hover:text-color-7 ml-[0.665rem] text-[13px] leading-3.5 font-normal sm:text-sm'
            href={TERMS_URL}
            target='_blank'
          >
            Terms
          </a>
        </div>
        <div className='flex justify-end'>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
