import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = PropsWithChildren & {
  element?: HTMLElement;
};

export function Portal({ children, element = document.body }: PortalProps) {
  return createPortal(children, element);
}
