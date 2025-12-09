import { type PropsWithChildren, useEffect } from 'react';

import { CloseIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { Portal } from '../common/Portal';

export interface ModalProps extends PropsWithChildren {
  open: boolean;
  title?: string;
  onClose: () => void;
}

export function Modal(props: ModalProps) {
  const { open, title, children, onClose } = props;

  useEffect(() => {
    if (open) {
      document.body.classList.add('disable-scroll-vertical');
    }

    return () => {
      document.body.classList.remove('disable-scroll-vertical');
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className='fixed inset-0 z-50 flex items-center justify-center modal-fade-in'>
        <div className='absolute inset-0 h-full w-full bg-modal-bg' />
        <div
          className='relative z-[1] flex flex-col items-center rounded-lg p-10 bg-color-5 min-w-105 max-w-108 w-[90%] modal-content-in'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-center'>
            <Condition if={title}>
              <Text
                size='17'
                weight='500'
                lineHeight='20'
                align='center'
                className='text-color-2 w-full'
              >
                {title}
              </Text>
            </Condition>
            <Button
              onClick={onClose}
              className='bg-transparent p-0'
              tabIndex={0}
              aria-label='Close modal'
            >
              <CloseIcon className='text-color-18 ml-auto cursor-pointer' />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}
