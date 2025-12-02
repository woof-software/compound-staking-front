import type { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps extends PropsWithChildren {
  element?: HTMLElement;
}

export const Portal: FC<PortalProps> = ({ children, element = document.body }) => createPortal(children, element);
