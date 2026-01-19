import dayjs from 'dayjs';

let nowSec = dayjs().unix();

let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function start() {
  if (timer) return;

  timer = setInterval(() => {
    const next = dayjs().unix();
    if (next === nowSec) return;

    nowSec = next;
    listeners.forEach((l) => l());
  }, 1000);
}

function stopIfIdle() {
  if (!timer) return;
  if (listeners.size > 0) return;

  clearInterval(timer);
  timer = null;
}

export function subscribeNowSec(listener: () => void) {
  listeners.add(listener);
  start();

  return () => {
    listeners.delete(listener);
    stopIfIdle();
  };
}

export function getNowSecSnapshot() {
  return nowSec;
}
