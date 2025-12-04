import { type PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { Portal } from '../common/Portal';

export interface ModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
}

export function Modal(props: ModalProps) {
  const { open, children, onClose } = props;

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

  return <Portal>{children}</Portal>;
}
