import { memo, type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import {
  AnimationProvider,
  type GestureType,
  type SpringType,
  useAnimationLibs
} from '@/components/ui/AnimationProvider';
import { Portal } from '@/components/ui/Portal';
import { cn } from '@/lib/utils/cn';

interface DrawerProps extends PropsWithChildren {
  className?: string;

  contentClassName?: string;

  lazy?: boolean;

  isOpen?: boolean;

  onClose?: () => void;
}

type DrawerContentInnerProps = DrawerProps & {
  Spring: SpringType;
  Gesture: GestureType;
};

const DrawerContentInner = memo((props: DrawerContentInnerProps) => {
  const { className, contentClassName, children, onClose, isOpen = false, Spring, Gesture } = props;

  const DURATION_OPEN = 250;
  const DURATION_CLOSE = 150;

  const EASE_OPEN = Spring.easings.easeOutCubic;
  const EASE_CLOSE = Spring.easings.easeInCubic;

  const [{ y }, api] = Spring.useSpring(() => ({ y: 0 }));

  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelHeightRef = useRef(0);

  const [mounted, setMounted] = useState(isOpen);
  const [measured, setMeasured] = useState(false);
  const closingRef = useRef(false);

  const measurePanel = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;

    panelHeightRef.current = Math.max(1, el.getBoundingClientRect().height);
    setMeasured(true);
  }, []);

  const animateOpen = useCallback(() => {
    closingRef.current = false;
    const h = panelHeightRef.current || 1;

    api.start({
      from: { y: h },
      to: { y: 0 },
      config: { duration: DURATION_OPEN, easing: EASE_OPEN }
    });
  }, [api, EASE_OPEN]);

  const animateClose = useCallback(
    (notify = false) => {
      if (closingRef.current) return;

      closingRef.current = true;
      const h = panelHeightRef.current || 1;

      api.start({
        y: h,
        config: { duration: DURATION_CLOSE, easing: EASE_CLOSE },
        onResolve: () => {
          setMounted(false);
          document.body.classList.remove('disable-scroll-vertical');

          if (notify) onClose?.();
          closingRef.current = false;
        }
      });
    },
    [api, onClose, EASE_CLOSE]
  );

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else if (mounted) {
      animateClose(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return;

    setMeasured(false);

    const raf = requestAnimationFrame(() => {
      measurePanel();

      const raf2 = requestAnimationFrame(() => {
        animateOpen();
        document.body.classList.add('disable-scroll-vertical');
      });

      return () => cancelAnimationFrame(raf2);
    });

    return () => cancelAnimationFrame(raf);
  }, [mounted, measurePanel, animateOpen]);

  const bind = Gesture.useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my], cancel }) => {
      if (my < -70) cancel();

      const h = panelHeightRef.current || 1;

      if (last) {
        const shouldClose = my > h * 0.4 || (vy > 0.5 && dy > 0);

        if (shouldClose) {
          animateClose(true);
        } else {
          api.start({
            to: { y: 0 },
            config: { duration: DURATION_OPEN, easing: EASE_OPEN }
          });
        }
      } else {
        const next = Math.min(Math.max(my, 0), h);
        api.start({ y: next, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
      axis: 'y',
      threshold: 12,
      eventOptions: { passive: false }
    }
  );

  if (!mounted) return null;

  return (
    <Portal element={document.getElementById('drawer') ?? document.body}>
      <div className={cn('fixed inset-0 z-10 flex items-end overflow-hidden lg:hidden', className)}>
        <Spring.a.div
          className='drawer-backdrop pointer-events-auto fixed inset-0'
          onClick={() => animateClose(true)}
        />
        <Spring.a.div
          {...bind()}
          ref={panelRef}
          className={cn(
            'bg-color-5 pointer-events-auto fixed inset-x-2 bottom-2 z-50 touch-none rounded-2xl p-8 will-change-transform',
            isOpen ? 'animate-drawer-in' : 'animate-drawer-out',
            contentClassName
          )}
          style={{
            transform: y.to((py) => `translateY(${py}px)`),
            visibility: measured ? 'visible' : 'hidden'
          }}
        >
          {children}
        </Spring.a.div>
      </div>
    </Portal>
  );
});

function DrawerAsync(props: DrawerProps) {
  const { isLoaded, Spring, Gesture } = useAnimationLibs();

  if (!isLoaded || !Spring || !Gesture) return null;

  return (
    <DrawerContentInner
      {...props}
      Spring={Spring}
      Gesture={Gesture}
    />
  );
}

export function Drawer(props: DrawerProps) {
  return (
    <AnimationProvider>
      <DrawerAsync {...props} />
    </AnimationProvider>
  );
}
