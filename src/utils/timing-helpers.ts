/**
 * Timing Helper Functions
 * Utility functions for animation timing and delays
 */

/**
 * Create a promise that resolves after a delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function execution
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request animation frame wrapper
 */
export function nextFrame(): Promise<number> {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Wait for multiple frames
 */
export async function waitFrames(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    await nextFrame();
  }
}

/**
 * Execute callback after animation complete
 */
export function onAnimationComplete(
  callback: () => void,
  duration: number,
  delay: number = 0
): void {
  setTimeout(callback, duration + delay);
}

/**
 * Chain multiple timed callbacks
 */
export function chainCallbacks(
  callbacks: Array<{ callback: () => void; delay: number }>
): void {
  let totalDelay = 0;

  callbacks.forEach(({ callback, delay }) => {
    totalDelay += delay;
    setTimeout(callback, totalDelay);
  });
}
