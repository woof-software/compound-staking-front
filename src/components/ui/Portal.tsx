import type { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = PropsWithChildren & {
  element?: HTMLElement;
};

export const Portal: FC<PortalProps> = ({ children, element = document.body }) => createPortal(children, element);
