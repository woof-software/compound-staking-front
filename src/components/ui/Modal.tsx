import { type PropsWithChildren, useEffect } from 'react';

import { Condition } from '@/components/common/Condition';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils/cn';
import { noop } from '@/lib/utils/common';

import { Portal } from './Portal';

import CloseIcon from '@/assets/svg/close.svg';

export interface ModalProps extends PropsWithChildren {
  open?: boolean;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export function Modal(props: ModalProps) {
  const { open = false, title, children, className, onClose = noop } = props;

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
        className={cn(
          'modal-fade-in bg-modal-bg fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[7.5px]',
          className
        )}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className='bg-color-5 modal-content-in relative flex w-full max-w-105 flex-col items-center rounded-lg p-10'>
          <div className='flex w-full justify-end'>
            <Condition if={title}>
              <Text
                size='17'
                lineHeight='20'
                align='center'
                className='ml-5 w-full'
              >
                {title}
              </Text>
            </Condition>
            <Condition if={onClose}>
              <Button
                onClick={onClose}
                className='size-auto bg-transparent p-0'
              >
                <CloseIcon className='text-color-18 ml-auto size-6 cursor-pointer' />
              </Button>
            </Condition>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}
