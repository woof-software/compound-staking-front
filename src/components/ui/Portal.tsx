import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps extends PropsWithChildren {
  element?: HTMLElement;
}

export function Portal({ children, element = document.body }: PortalProps) {
  return createPortal(children, element);
}
