import { useEffect, useState, useCallback, useRef } from "react";

export interface UseCountdownOptions {
  targetDate?: Date;
  initialSeconds?: number;
  onComplete?: () => void;
  autoStart?: boolean;
  interval?: number;
}

export interface CountdownReturn {
  timeLeft: number;
  isActive: boolean;
  isCompleted: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formattedTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const calculateTimeLeft = (targetDate: Date): number => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  return Math.max(0, target - now);
};

export const useCountdown = (
  options: UseCountdownOptions | Date | number
): CountdownReturn => {
  // Normalize options
  const config: UseCountdownOptions =
    typeof options === "number"
      ? { initialSeconds: options }
      : options instanceof Date
      ? { targetDate: options }
      : options;

  const {
    targetDate,
    initialSeconds = 0,
    onComplete,
    autoStart = true,
    interval = 1000,
  } = config;
  // Calculate initial time
  const getInitialTime = useCallback(() => {
    if (targetDate) {
      return calculateTimeLeft(targetDate);
    }
    return initialSeconds * 1000;
  }, [targetDate, initialSeconds]);

  const [timeLeft, setTimeLeft] = useState<number>(getInitialTime);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset when target changes
  useEffect(() => {
    const newTime = getInitialTime();
    setTimeLeft(newTime);
    setIsCompleted(newTime === 0);
    if (autoStart && newTime > 0) {
      setIsActive(true);
    }
  }, [getInitialTime, autoStart]);

  // Main countdown effect
  useEffect(() => {
    if (!isActive || isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        let newTime: number;

        if (targetDate) {
          newTime = calculateTimeLeft(targetDate);
        } else {
          newTime = Math.max(0, prevTime - interval);
        }

        if (newTime === 0) {
          setIsActive(false);
          setIsCompleted(true);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }

        return newTime;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isCompleted, targetDate, interval]);

  // Control functions
  const start = useCallback(() => {
    if (!isCompleted) {
      setIsActive(true);
    }
  }, [isCompleted]);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    const newTime = getInitialTime();
    setTimeLeft(newTime);
    setIsCompleted(newTime === 0);
    setIsActive(autoStart && newTime > 0);
  }, [getInitialTime, autoStart]);

  // Format time into days, hours, minutes, seconds
  const formattedTime = {
    days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
  };

  return {
    timeLeft: Math.floor(timeLeft / 1000), // Return seconds
    isActive,
    isCompleted,
    start,
    pause,
    reset,
    formattedTime,
  };
};
