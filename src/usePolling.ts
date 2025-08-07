import { useCallback, useEffect, useRef, useState } from "react";

/** Configuration options for the usePolling hook */
export interface UsePollingOptions<T = any> {
  /** Function that returns a promise with data to poll */
  fn: () => Promise<T>;
  /** Type of polling: interval-based or long polling */
  type?: "long" | "interval";
  /** Interval between polls in milliseconds (default: 1000ms) */
  interval?: number;
  /** Whether to start polling automatically (default: true) */
  autoStart?: boolean;
  /** Maximum number of retry attempts on error (default: 3) */
  maxRetries?: number;
  /** Delay between retry attempts in milliseconds (default: 1000ms) */
  retryDelay?: number;
  /** Callback function when polling encounters an error */
  onError?: (error: Error, retryCount: number) => void;
  /** Callback function when polling succeeds */
  onSuccess?: (data: T) => void;
}

/** Return values from the usePolling hook */
export interface UsePollingResults<T = any> {
  /** Current data from polling */
  data: T | null;
  /** Whether a request is currently in progress */
  isLoading: boolean;
  /** Whether polling is currently active */
  isRunning: boolean;
  /** Any error that occurred during polling */
  error: Error | null;
  /** Number of consecutive failed attempts */
  retryCount: number;
  /** Function to start polling */
  start: () => void;
  /** Function to stop polling */
  stop: () => void;
  /** Function to manually trigger a single poll */
  poll: () => Promise<void>;
  /** Function to reset error state and retry count */
  reset: () => void;
}

/**
 * React hook for polling data at regular intervals or using long polling
 *
 * This hook provides comprehensive polling functionality with support for both interval-based
 * and long polling patterns. It includes error handling, retry logic, and proper cleanup.
 *
 * @param options - Configuration options for polling behavior
 * @returns Object containing polling state and control functions
 *
 * @example
 * ```tsx
 * // Basic interval polling
 * const { data, isLoading, error } = usePolling({
 *   fn: () => fetch('/api/data').then(r => r.json()),
 *   interval: 5000
 * });
 *
 * // Long polling with error handling
 * const { data, start, stop } = usePolling({
 *   fn: () => fetch('/api/long-poll').then(r => r.json()),
 *   type: 'long',
 *   autoStart: false,
 *   onError: (error) => console.error('Polling failed:', error)
 * });
 *
 * // Manual control
 * const { poll, isLoading } = usePolling({
 *   fn: fetchUserData,
 *   autoStart: false
 * });
 * ```
 */

export const usePolling = <T = any>({
  fn,
  type = "interval",
  interval = 1000,
  autoStart = true,
  maxRetries = 3,
  retryDelay = 1000,
  onError,
  onSuccess,
}: UsePollingOptions<T>): UsePollingResults<T> => {
  // State management
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs for stable references
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fnRef = useRef(fn);
  const isActiveRef = useRef(true);

  // Update function reference
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Cleanup on unmount
  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Single poll execution with error handling and retries
  const executePoll = useCallback(
    async (isRetry = false): Promise<void> => {
      if (!isActiveRef.current) return;

      try {
        setIsLoading(true);
        if (!isRetry) {
          setError(null);
        }

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        const result = await fnRef.current();

        if (!isActiveRef.current) return;

        setData(result);
        setRetryCount(0);
        setError(null);
        onSuccess?.(result);
      } catch (err) {
        if (!isActiveRef.current) return;

        const error = err instanceof Error ? err : new Error(String(err));

        if (retryCount < maxRetries) {
          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);
          onError?.(error, newRetryCount);

          // Schedule retry
          timeoutRef.current = setTimeout(() => {
            if (isActiveRef.current && isRunning) {
              executePoll(true);
            }
          }, retryDelay);
        } else {
          setError(error);
          setRetryCount(0);
          onError?.(error, retryCount + 1);

          // Stop polling on max retries for interval polling
          if (type === "interval") {
            setIsRunning(false);
          }
        }
      } finally {
        if (isActiveRef.current) {
          setIsLoading(false);
        }
      }
    },
    [retryCount, maxRetries, retryDelay, onError, onSuccess, type, isRunning]
  );
//   console.log(data);
  // Long polling implementation with proper cleanup
  const startLongPoll = useCallback(async (): Promise<void> => {
    while (isActiveRef.current && isRunning) {
      await executePoll();

      // Add a small delay between long poll requests to prevent overwhelming
      if (isActiveRef.current && isRunning) {
        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, Math.min(interval, 100));
        });
      }
    }
  }, [executePoll, interval, isRunning]);

  // Start polling based on type
  const start = useCallback(() => {
    setIsRunning(true);
    setError(null);
    setRetryCount(0);

    if (type === "interval") {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Execute immediately, then set interval
      executePoll();
      intervalRef.current = setInterval(() => {
        if (isActiveRef.current && isRunning) {
          executePoll();
        }
      }, interval);
    } else if (type === "long") {
      startLongPoll();
    }
  }, [type, interval, executePoll, startLongPoll, isRunning]);

  // Stop polling
  const stop = useCallback(() => {
    setIsRunning(false);
    console.log("polling stopped");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Manual poll function
  const poll = useCallback(async (): Promise<void> => {
    await executePoll();
  }, [executePoll]);

  // Reset error state and retry count
  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  // Effect to handle running state changes
  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      stop();
    }
  }, [isRunning]); // Note: Don't include start/stop to avoid infinite loops

  // Auto-start effect
  useEffect(() => {
    if (autoStart && isActiveRef.current) {
      setIsRunning(true);
    }
  }, [autoStart]);

  return {
    data,
    isLoading,
    isRunning,
    error,
    retryCount,
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
    poll,
    reset,
  };
};
