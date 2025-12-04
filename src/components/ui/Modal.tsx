import { type PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { Portal } from '../common/Portal';

export type ModalProps = PropsWithChildren & {
  open: boolean;
  onClose: () => void;
};

export function Modal({ open, children, onClose }: ModalProps) {
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

  return <Portal>{children}</Portal>;
}
