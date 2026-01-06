import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { TALLY_GOV_URL, TERMS_URL } from '@/consts/common';

export function Footer() {
  return (
    <footer className='mt-auto bg-transparent'>
      <div className='border-border-1 flex items-center justify-between border-t-[0.5px] py-5'>
        <div className='flex h-4 basis-1/2 items-center gap-x-[1.33rem]'>
          <a
            className='text-color-24 hover:text-color-7 text-sm leading-3.5 font-normal'
            href={TALLY_GOV_URL}
            target='_blank'
          >
            Governance
          </a>
          <a
            className='text-color-24 hover:text-color-7 text-sm leading-3.5 font-normal'
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
