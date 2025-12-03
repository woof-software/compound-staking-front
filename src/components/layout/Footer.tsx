import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { TALLY_GOV_URL, TERMS_URL } from '@/consts/consts';
import type { Theme } from '@/shared/types/common';

type FooterProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const Footer = ({ theme, setTheme }: FooterProps) => {
  return (
    <footer className='bg-transparent mt-auto'>
      <div className='flex py-5 items-center justify-between border-t border-border-1'>
        <div className='basis-1/2 flex items-center gap-x-[22px]'>
          <a
            className='text-[11px] font-medium text-color-24 hover:text-color-7'
            href={TALLY_GOV_URL}
            target='_blank'
            rel='noreferrer'
          >
            Governance
          </a>
          <a
            className='text-[11px] font-medium text-color-24 hover:text-color-7'
            href={TERMS_URL}
            target='_blank'
            rel='noreferrer'
          >
            Terms
          </a>
        </div>
        <div className='flex justify-end'>
          <ThemeSwitcher
            theme={theme}
            setTheme={setTheme}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
