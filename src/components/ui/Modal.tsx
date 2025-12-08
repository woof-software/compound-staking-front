import { type PropsWithChildren, useEffect } from 'react';

import { CloseIcon } from '@/assets/svg';
import { Condition } from '@/components/common/Condition';
import { HStack } from '@/components/common/HStack';
import { VStack } from '@/components/common/VStack';
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
    } else {
      document.body.classList.remove('disable-scroll-vertical');
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className='fixed inset-0 z-[1000] flex items-center justify-center modal-fade-in'>
        <div
          className='absolute inset-0 h-full w-full bg-modal-bg'
          onClick={onClose}
        />
        <VStack
          align='center'
          className='relative z-[1] rounded-lg p-10 bg-color-5 min-w-[420px] max-w-[430px] w-[90%] modal-content-in'
          onClick={(e) => e.stopPropagation()}
        >
          <HStack justify='end'>
            <Condition if={Boolean(title)}>
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
            <Condition if={onClose}>
              <Button
                onClick={onClose}
                className='bg-transparent w-auto h-auto p-0'
                tabIndex={0}
                aria-label='Close modal'
              >
                <CloseIcon className='text-color-18 ml-auto cursor-pointer' />
              </Button>
            </Condition>
          </HStack>
          {children}
        </VStack>
      </div>
    </Portal>
  );
}
