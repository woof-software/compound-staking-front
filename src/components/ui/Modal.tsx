import { type PropsWithChildren, useEffect } from 'react';

import { CloseIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { Portal } from '../common/Portal';

export interface ModalProps extends PropsWithChildren {
  open: boolean;
  title?: string;
  onClose?: () => void;
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

  if (!open) return null;

  return (
    <Portal>
      <div
        className='modal-fade-in bg-modal-bg fixed inset-0 z-50 flex items-center justify-center'
        onClick={onClose}
      >
        <div
          className='bg-color-5 modal-content-in relative flex w-full max-w-108 flex-col items-center rounded-lg p-10'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex w-full justify-end'>
            <Condition if={title}>
              <Text
                size='17'
                weight='500'
                lineHeight='20'
                align='center'
                className='w-full'
              >
                {title}
              </Text>
            </Condition>
            <Condition if={onClose}>
              <Button
                onClick={onClose}
                className='size-auto bg-transparent p-0'
              >
                <CloseIcon className='text-color-18 ml-auto size-5 cursor-pointer' />
              </Button>
            </Condition>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}
