import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for the useThrottle hook
 */
export interface UseThrottleOptions {
  /**
   * The delay in milliseconds between function executions
   * @default 300
   */
  delay?: number;
  /**
   * Whether to execute the function immediately on the first call (leading edge)
   * @default true
   */
  leading?: boolean;
  /**
   * Whether to execute the function after the delay on the last call (trailing edge)
   * @default true
   */
  trailing?: boolean;
}

/**
 * Return values from the useThrottle hook (for callback version)
 */
export interface UseThrottleCallbackReturn<T extends (...args: any[]) => any> {
  /** The throttled function */
  throttledCallback: T;
  /** Whether the function is currently being throttled */
  isThrottled: boolean;
  /** Function to cancel pending executions */
  cancel: () => void;
  /** Function to flush (execute immediately) any pending execution */
  flush: () => void;
}

/**
 * A React hook that throttles a value, limiting updates to occur at most once per delay period
 * 
 * Unlike debouncing, throttling ensures the function executes at regular intervals during
 * continuous calls. Perfect for scroll handlers, resize events, or any high-frequency events.
 * 
 * @param value - The value to throttle
 * @param options - Configuration options for throttling behavior
 * @returns The throttled value
 * 
 * @example
 * ```tsx
 * import { useThrottle } from 'light-hooks';
 * 
 * function ScrollComponent() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, { delay: 100 });
 * 
 *   useEffect(() => {
 *     const handleScroll = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, []);
 * 
 *   return <div>Throttled scroll position: {throttledScrollY}</div>;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Search with throttled API calls
 * function SearchComponent() {
 *   const [query, setQuery] = useState('');
 *   const throttledQuery = useThrottle(query, { delay: 500 });
 * 
 *   useEffect(() => {
 *     if (throttledQuery) {
 *       searchAPI(throttledQuery);
 *     }
 *   }, [throttledQuery]);
 * 
 *   return (
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * ```
 */
export function useThrottle<T>(
  value: T,
  options: UseThrottleOptions = {}
): T {
  const { delay = 300, leading = true, trailing = true } = options;
  
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isFirstCallRef = useRef(true);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;

    // Handle leading edge - execute immediately on first call or after delay period
    if ((leading && isFirstCallRef.current) || 
        (leading && timeSinceLastExecution >= delay)) {
      setThrottledValue(value);
      lastExecutedRef.current = now;
      isFirstCallRef.current = false;
      
      // Clear any pending trailing execution
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      return;
    }

    // Handle trailing edge - schedule execution after remaining delay
    if (trailing) {
      const remainingDelay = delay - timeSinceLastExecution;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecutedRef.current = Date.now();
        timeoutRef.current = undefined;
      }, remainingDelay);
    }

    isFirstCallRef.current = false;

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing]);

  return throttledValue;
}

/**
 * A React hook that creates a throttled callback function
 * 
 * This version is useful when you want to throttle function calls directly
 * rather than throttling a value.
 * 
 * @param callback - The function to throttle
 * @param options - Configuration options for throttling behavior
 * @returns Object containing the throttled function and control methods
 * 
 * @example
 * ```tsx
 * import { useThrottleCallback } from 'light-hooks';
 * 
 * function ResizeComponent() {
 *   const { throttledCallback: handleResize, isThrottled } = useThrottleCallback(
 *     () => {
 *       console.log('Window resized to:', window.innerWidth, window.innerHeight);
 *     },
 *     { delay: 250 }
 *   );
 * 
 *   useEffect(() => {
 *     window.addEventListener('resize', handleResize);
 *     return () => window.removeEventListener('resize', handleResize);
 *   }, [handleResize]);
 * 
 *   return <div>Resize the window {isThrottled ? '(throttled)' : ''}</div>;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Button with throttled click handler
 * function SaveButton() {
 *   const { throttledCallback: handleSave, cancel, flush } = useThrottleCallback(
 *     () => saveData(),
 *     { delay: 1000, trailing: false }
 *   );
 * 
 *   return (
 *     <div>
 *       <button onClick={handleSave}>Save</button>
 *       <button onClick={cancel}>Cancel Save</button>
 *       <button onClick={flush}>Save Now</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: UseThrottleOptions = {}
): UseThrottleCallbackReturn<T> {
  const { delay = 300, leading = true, trailing = true } = options;
  
  const [isThrottled, setIsThrottled] = useState(false);
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pendingArgsRef = useRef<Parameters<T>>();
  const callbackRef = useRef(callback);

  // Update callback ref
  callbackRef.current = callback;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    pendingArgsRef.current = undefined;
    setIsThrottled(false);
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && pendingArgsRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      
      callbackRef.current(...pendingArgsRef.current);
      lastExecutedRef.current = Date.now();
      pendingArgsRef.current = undefined;
      setIsThrottled(false);
    }
  }, []);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      // Handle leading edge
      if (leading && timeSinceLastExecution >= delay) {
        callbackRef.current(...args);
        lastExecutedRef.current = now;
        setIsThrottled(false);
        
        // Clear any pending trailing execution
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
        pendingArgsRef.current = undefined;
        return;
      }

      // Handle trailing edge
      if (trailing) {
        pendingArgsRef.current = args;
        setIsThrottled(true);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const remainingDelay = delay - timeSinceLastExecution;
        timeoutRef.current = setTimeout(() => {
          if (pendingArgsRef.current) {
            callbackRef.current(...pendingArgsRef.current);
            lastExecutedRef.current = Date.now();
            pendingArgsRef.current = undefined;
          }
          timeoutRef.current = undefined;
          setIsThrottled(false);
        }, Math.max(0, remainingDelay));
      }
    },
    [delay, leading, trailing]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    throttledCallback,
    isThrottled,
    cancel,
    flush,
  };
}

export default useThrottle;
