import { useEffect, useState, useCallback, useRef } from "react";

/** Configuration options for the useCountdown hook */
export interface UseCountdownOptions {
  /** Target date to countdown to. When reached, countdown completes */
  targetDate?: Date;
  /** Initial countdown duration in seconds (alternative to targetDate) */
  initialSeconds?: number;
  /** Callback function executed when countdown reaches zero */
  onComplete?: () => void;
  /** Whether to start the countdown automatically when hook initializes (default: true) */
  autoStart?: boolean;
  /** Update interval in milliseconds for countdown precision (default: 1000ms) */
  interval?: number;
}

/** Return values from the useCountdown hook */
export interface CountdownReturn {
  /** Time remaining in seconds */
  timeLeft: number;
  /** Whether the countdown is currently running */
  isActive: boolean;
  /** Whether the countdown has completed (reached zero) */
  isCompleted: boolean;
  /** Function to start or resume the countdown */
  start: () => void;
  /** Function to pause the countdown */
  pause: () => void;
  /** Function to reset the countdown to its initial state */
  reset: () => void;
  /** Time formatted as an object with days, hours, minutes, and seconds */
  formattedTime: {
    /** Number of complete days remaining */
    days: number;
    /** Number of complete hours remaining (0-23) */
    hours: number;
    /** Number of complete minutes remaining (0-59) */
    minutes: number;
    /** Number of complete seconds remaining (0-59) */
    seconds: number;
  };
}

/**
 * Calculates the time remaining until a target date.
 * Returns the difference in milliseconds, or 0 if the target date has passed.
 *
 * @param targetDate - The target date to calculate time remaining until
 * @returns Time remaining in milliseconds, minimum 0
 */
const calculateTimeLeft = (targetDate: Date): number => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  return Math.max(0, target - now);
};

/**
 * A React hook for creating countdown timers with flexible configuration options.
 * Supports both duration-based and date-based countdowns with full control capabilities.
 *
 * @param options - Configuration object, Date, or number
 *   - If Date: Creates countdown to that specific date
 *   - If number: Creates countdown for that many seconds
 *   - If object: Full configuration with targetDate, initialSeconds, callbacks, etc.
 *
 * @returns CountdownReturn object containing:
 *   - timeLeft: Time remaining in seconds
 *   - isActive: Whether countdown is currently running
 *   - isCompleted: Whether countdown has finished
 *   - start: Function to start/resume countdown
 *   - pause: Function to pause countdown
 *   - reset: Function to reset to initial state
 *   - formattedTime: Object with days, hours, minutes, seconds
 *
 * @example
 * // Simple 60-second countdown
 * const { timeLeft, formattedTime } = useCountdown(60);
 *
 * @example
 * // Countdown to specific date
 * const { timeLeft, isCompleted } = useCountdown(new Date('2024-12-31'));
 *
 * @example
 * // Advanced usage with full control
 * const {
 *   timeLeft,
 *   isActive,
 *   start,
 *   pause,
 *   reset
 * } = useCountdown({
 *   initialSeconds: 300,
 *   autoStart: false,
 *   onComplete: () => alert('Time\'s up!'),
 *   interval: 1000
 * });
 *
 * @example
 * // Formatted time display
 * const { formattedTime } = useCountdown(3665); // 1 hour, 1 minute, 5 seconds
 * // formattedTime = { days: 0, hours: 1, minutes: 1, seconds: 5 }
 */
export const useCountdown = (
  options: UseCountdownOptions | Date | number
): CountdownReturn => {
  // Normalize input options to a consistent configuration object
  const config: UseCountdownOptions =
    typeof options === "number"
      ? { initialSeconds: options } // Simple number becomes initialSeconds
      : options instanceof Date
      ? { targetDate: options } // Date becomes targetDate
      : options; // Already a config object

  const {
    targetDate,
    initialSeconds = 0, // Default to 0 seconds if no duration specified
    onComplete,
    autoStart = true, // Start automatically by default
    interval = 1000, // Update every second by default
  } = config;
  // Calculate the initial countdown time based on configuration
  const getInitialTime = useCallback(() => {
    if (targetDate) {
      // If target date is specified, calculate time until that date
      return calculateTimeLeft(targetDate);
    }
    // Otherwise, use the initial seconds converted to milliseconds
    return initialSeconds * 1000;
  }, [targetDate, initialSeconds]);

  // State management for countdown functionality
  const [timeLeft, setTimeLeft] = useState<number>(getInitialTime);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete callback ref when it changes to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset countdown when target date or initial seconds change
  useEffect(() => {
    const newTime = getInitialTime();
    setTimeLeft(newTime);
    setIsCompleted(newTime === 0);
    if (autoStart && newTime > 0) {
      setIsActive(true);
    }
  }, [getInitialTime, autoStart]);

  // Main countdown logic - handles the interval-based time updates
  useEffect(() => {
    // Clear any existing interval if countdown is not active or already completed
    if (!isActive || isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Set up interval to update countdown regularly
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        let newTime: number;

        if (targetDate) {
          // For date-based countdown, recalculate time remaining
          newTime = calculateTimeLeft(targetDate);
        } else {
          // For duration-based countdown, subtract interval time
          newTime = Math.max(0, prevTime - interval);
        }

        // Check if countdown has completed
        if (newTime === 0) {
          setIsActive(false);
          setIsCompleted(true);
          // Call completion callback if provided
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }

        return newTime;
      });
    }, interval);

    // Cleanup interval when effect dependencies change or component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isCompleted, targetDate, interval]);

  // Control functions for managing countdown state

  /** Start or resume the countdown (only if not completed) */
  const start = useCallback(() => {
    if (!isCompleted) {
      setIsActive(true);
    }
  }, [isCompleted]);

  /** Pause the countdown without resetting the time */
  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  /** Reset the countdown to its initial state and optionally restart */
  const reset = useCallback(() => {
    const newTime = getInitialTime();
    setTimeLeft(newTime);
    setIsCompleted(newTime === 0);
    setIsActive(autoStart && newTime > 0);
  }, [getInitialTime, autoStart]);

  // Format the remaining time into a user-friendly object
  // All values are calculated from milliseconds and floored to whole numbers
  const formattedTime = {
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
  };

  return {
    timeLeft: Math.floor(timeLeft / 1000), // Convert to seconds for easier consumption
    isActive,
    isCompleted,
    start,
    pause,
    reset,
    formattedTime,
  };
};
