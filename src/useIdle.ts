import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration options for the useIdle hook
 */
export interface UseIdleOptions {
  /**
   * The time in milliseconds before the user is considered idle
   * @default 60000 (1 minute)
   */
  timeout?: number;
  /**
   * Events to listen for to reset the idle timer
   * @default ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
   */
  events?: string[];
  /**
   * Whether to start the idle detection immediately
   * @default true
   */
  initialState?: boolean;
  /**
   * Whether to track idle state across browser tabs/windows
   * Uses localStorage to sync idle state
   * @default false
   */
  crossTab?: boolean;
}

/**
 * Return values from the useIdle hook
 */
export interface UseIdleReturn {
  /** Whether the user is currently idle */
  isIdle: boolean;
  /** Time remaining until idle (in milliseconds) */
  timeRemaining: number;
  /** Time since last activity (in milliseconds) */
  timeSinceLastActivity: number;
  /** Function to manually reset the idle timer */
  reset: () => void;
  /** Function to manually set idle state */
  setIdle: (idle: boolean) => void;
  /** Function to start idle detection */
  start: () => void;
  /** Function to stop idle detection */
  stop: () => void;
}

/**
 * A React hook that detects user inactivity and provides idle state management
 * 
 * This hook is useful for auto-logout functionality, pausing videos when users
 * are away, saving drafts, or any feature that needs to respond to user inactivity.
 * 
 * @param options - Configuration options for idle detection
 * @returns Object containing idle state and control functions
 * 
 * @example
 * ```tsx
 * import { useIdle } from 'light-hooks';
 * 
 * function AutoLogoutComponent() {
 *   const { isIdle, timeRemaining, reset } = useIdle({ 
 *     timeout: 300000 // 5 minutes
 *   });
 * 
 *   useEffect(() => {
 *     if (isIdle) {
 *       // Auto logout user
 *       logout();
 *     }
 *   }, [isIdle]);
 * 
 *   return (
 *     <div>
 *       {timeRemaining < 60000 && !isIdle && (
 *         <div>
 *           Session expires in {Math.ceil(timeRemaining / 1000)} seconds
 *           <button onClick={reset}>Stay logged in</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Video player that pauses when user is idle
 * function VideoPlayer() {
 *   const { isIdle } = useIdle({ timeout: 10000 }); // 10 seconds
 *   
 *   useEffect(() => {
 *     if (isIdle) {
 *       pauseVideo();
 *     }
 *   }, [isIdle]);
 * 
 *   return <video />;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Cross-tab idle detection
 * const { isIdle } = useIdle({ 
 *   timeout: 120000, 
 *   crossTab: true 
 * });
 * ```
 */
export const useIdle = (options: UseIdleOptions = {}): UseIdleReturn => {
  const {
    timeout = 60000, // 1 minute default
    events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
    initialState = true,
    crossTab = false,
  } = options;

  const [isIdle, setIsIdle] = useState(!initialState);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(timeout);
  const [isActive, setIsActive] = useState(initialState);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const eventsRef = useRef(events);

  // Update events ref when events change
  eventsRef.current = events;

  // Storage key for cross-tab communication
  const storageKey = 'useIdle-lastActivity';

  // Reset the idle timer
  const reset = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    setIsIdle(false);
    setTimeRemaining(timeout);

    // Update localStorage for cross-tab sync
    if (crossTab && typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, now.toString());
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    if (isActive) {
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        setTimeRemaining(0);
      }, timeout);
    }
  }, [timeout, crossTab, isActive, storageKey]);

  // Manually set idle state
  const setIdle = useCallback((idle: boolean) => {
    setIsIdle(idle);
    if (!idle) {
      reset();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setTimeRemaining(0);
    }
  }, [reset]);

  // Start idle detection
  const start = useCallback(() => {
    setIsActive(true);
    reset();
  }, [reset]);

  // Stop idle detection
  const stop = useCallback(() => {
    setIsActive(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Activity handler
  const handleActivity = useCallback(() => {
    if (isActive) {
      reset();
    }
  }, [isActive, reset]);

  // Handle cross-tab storage events
  const handleStorageChange = useCallback((e: StorageEvent) => {
    if (e.key === storageKey && e.newValue) {
      const newLastActivity = parseInt(e.newValue, 10);
      if (newLastActivity > lastActivity) {
        setLastActivity(newLastActivity);
        reset();
      }
    }
  }, [lastActivity, reset, storageKey]);

  // Set up event listeners
  useEffect(() => {
    if (!isActive) return;

    const currentEvents = eventsRef.current;

    // Add activity event listeners
    currentEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Add storage listener for cross-tab sync
    if (crossTab) {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      currentEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (crossTab) {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [handleActivity, handleStorageChange, crossTab, isActive]);

  // Set up timer update interval
  useEffect(() => {
    if (!isActive || isIdle) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivity;
      const remaining = Math.max(0, timeout - elapsed);
      
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsIdle(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 1000); // Update every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isIdle, lastActivity, timeout]);

  // Initialize
  useEffect(() => {
    if (initialState) {
      start();
    }
  }, [initialState, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Calculate time since last activity
  const timeSinceLastActivity = Date.now() - lastActivity;

  return {
    isIdle,
    timeRemaining,
    timeSinceLastActivity,
    reset,
    setIdle,
    start,
    stop,
  };
};

export default useIdle;
