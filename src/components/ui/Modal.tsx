import { type PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { CloseIcon } from '@/assets/svg';
import { HStack } from '@/components/common/HStack';
import { Text } from '@/components/ui/Text';

import { Portal } from '../common/Portal';

export type ModalProps = PropsWithChildren & {
  open: boolean;

  title: string;

  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  useEffect(() => {
    function onKeyPress(e: any) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <Portal>
      <HStack>
        <Text
          size='17'
          weight='500'
          lineHeight='20'
          className='text-color-2'
        >
          {title}
        </Text>
        <CloseIcon
          className='text-color-18'
          onClick={onClose}
          tabIndex={0}
          aria-label='Close modal'
        />
      </HStack>
      {children}
    </Portal>
  );
}
