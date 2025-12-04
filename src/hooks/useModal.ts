import { useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onToggleModal: () => void;
};

const useModal = (): ModalProps => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenModal = () => {
    setIsOpen(true);
  };

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onToggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  return { isOpen, onOpenModal, onCloseModal, onToggleModal };
};

export { useModal };
