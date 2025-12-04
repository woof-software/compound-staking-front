import { type PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { CloseIcon } from '@/assets/svg';
import { HStack } from '@/components/common/HStack';
import { Text } from '@/components/ui/Text';

import { Portal } from '../common/Portal';

export interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function Modal(props: ModalProps) {
  const { open, title, children, onClose } = props;

  useEffect(() => {
    function onKeyPress(e: any) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keypress', onKeyPress);

    return () => {
      document.removeEventListener('keypress', onKeyPress);
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
