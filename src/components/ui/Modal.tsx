import { type FC, type PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { Portal } from './Portal';

type ModalProps = PropsWithChildren & {
  open: boolean;
  onClose: () => void;
};

const Modal: FC<ModalProps> = ({ open, children, onClose }) => {
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
};

export { Modal };
