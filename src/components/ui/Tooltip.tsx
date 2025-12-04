import { cloneElement, type ReactElement, type ReactNode, useRef, useState } from 'react';

import { Portal } from '@/components/common/Portal';

type TooltipCoordinates = {
  x: number;
  y: number;
};

type TooltipProps = {
  width: number;
  children: ReactElement<any>;
  content: ReactNode;
  under?: boolean;
  hideArrow?: boolean;
  mini?: boolean;
  disabled?: boolean;
  yOffset?: number;
  x?: number;
  y?: number;
};

export function Tooltip({
  width,
  children,
  content,
  under = false,
  hideArrow = false,
  mini = false,
  disabled = false,
  yOffset = 20,
  x,
  y
}: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<TooltipCoordinates>({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLSpanElement | null>(null);

  const onMouseOver = (e: any) => {
    if (!disabled && tooltipRef.current) {
      setShowTooltip(true);
      const triggerEl = e.currentTarget.getBoundingClientRect();

      // By default, try to set the tooltip above the hovered element.
      let yCoords = triggerEl.bottom - tooltipRef.current.clientHeight - triggerEl.height - yOffset;
      // If the tooltip gets cut off above the screen, then move it
      // below the hovered element instead.
      if (yCoords < -yOffset || under) {
        yCoords = triggerEl.bottom;
      }

      setCoordinates({
        x: x ?? triggerEl.left + triggerEl.width / 2 - width / 2,
        y: y ?? yCoords
      });
    }
  };

  const onMouseOut = () => setShowTooltip(false);

  return (
    <>
      {disabled
        ? children
        : cloneElement(children, {
            onMouseOver,
            onMouseOut
          })}
      {disabled || (
        <Portal>
          <span
            className={`tooltip tooltip${!showTooltip && '--inactive'} tooltip${hideArrow && '--hide-arrow'} tooltip${mini && '--mini'}`}
            id='tooltip'
            ref={tooltipRef}
            style={{ width: width, left: coordinates.x, top: coordinates.y }}
          >
            {content}
          </span>
        </Portal>
      )}
    </>
  );
}
