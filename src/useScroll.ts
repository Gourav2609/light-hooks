import { useCallback, useEffect, useRef, useState } from "react";

/** Configuration options for the useScroll hook */
export interface ScrollOptions {
  /** Target element to monitor scroll (default: window) */
  target?: HTMLElement | Window | null;
  /** Throttle scroll events in milliseconds (default: 16ms for 60fps) */
  throttle?: number;
  /** Whether to track scroll direction (default: true) */
  trackDirection?: boolean;
  /** Whether to track scroll velocity (default: false) */
  trackVelocity?: boolean;
}

/** Scroll direction type */
export type ScrollDirection = "up" | "down" | "left" | "right" | null;

/** Return values from the useScroll hook */
export interface ScrollResult {
  /** Current horizontal scroll position */
  scrollX: number;
  /** Current vertical scroll position */
  scrollY: number;
  /** Whether scroll is currently locked */
  isLocked: boolean;
  /** Scroll direction (up/down for Y, left/right for X) */
  direction: {
    x: ScrollDirection;
    y: ScrollDirection;
  };
  /** Scroll velocity in pixels per second (if enabled) */
  velocity: {
    x: number;
    y: number;
  };
  /** Function to lock/unlock scroll */
  setScrollLock: (locked: boolean) => void;
  /** Function to scroll to specific position */
  scrollTo: (x: number, y: number, smooth?: boolean) => void;
  /** Function to scroll to top */
  scrollToTop: (smooth?: boolean) => void;
  /** Function to scroll to bottom */
  scrollToBottom: (smooth?: boolean) => void;
  /** Function to scroll by relative amount */
  scrollBy: (deltaX: number, deltaY: number, smooth?: boolean) => void;
  /** Whether the element/window is at the top */
  isAtTop: boolean;
  /** Whether the element/window is at the bottom */
  isAtBottom: boolean;
  /** Total scrollable height */
  scrollHeight: number;
  /** Total scrollable width */
  scrollWidth: number;
}

/**
 * React hook for managing scroll position, direction, and scroll lock functionality
 *
 * This hook provides comprehensive scroll monitoring and control capabilities including
 * position tracking, direction detection, velocity calculation, and scroll lock functionality.
 *
 * @param options - Configuration options for scroll monitoring
 * @returns Object containing scroll state and control functions
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { scrollY, direction, isAtTop } = useScroll();
 *
 * // With scroll lock
 * const { scrollY, setScrollLock, scrollToTop } = useScroll();
 *
 * // Custom target element
 * const { scrollX, scrollY } = useScroll({
 *   target: elementRef.current,
 *   throttle: 32
 * });
 *
 * // With velocity tracking
 * const { velocity, direction } = useScroll({
 *   trackVelocity: true,
 *   throttle: 16
 * });
 * ```
 */
export const useScroll = (options: ScrollOptions = {}): ScrollResult => {
  const {
    target = typeof window !== "undefined" ? window : null,
    throttle = 16,
    trackDirection = true,
    trackVelocity = false,
  } = options;

  // State for scroll position and lock
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // State for direction tracking
  const [direction, setDirection] = useState<{
    x: ScrollDirection;
    y: ScrollDirection;
  }>({
    x: null,
    y: null,
  });

  // State for velocity tracking
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  // State for boundary detection
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  // Refs for previous values and timestamps
  const prevScrollRef = useRef({ x: 0, y: 0 });
  const prevTimeRef = useRef(Date.now());
  const throttleRef = useRef<number | null>(null);

  // Get scroll properties from target
  const getScrollProperties = useCallback(() => {
    if (!target)
      return { x: 0, y: 0, maxX: 0, maxY: 0, clientHeight: 0, clientWidth: 0 };

    if (target === window) {
      return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop,
        maxX: document.documentElement.scrollWidth - window.innerWidth,
        maxY: document.documentElement.scrollHeight - window.innerHeight,
        clientHeight: window.innerHeight,
        clientWidth: window.innerWidth,
      };
    } else {
      const element = target as HTMLElement;
      return {
        x: element.scrollLeft,
        y: element.scrollTop,
        maxX: element.scrollWidth - element.clientWidth,
        maxY: element.scrollHeight - element.clientHeight,
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
      };
    }
  }, [target]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }

    throttleRef.current = setTimeout(() => {
      const props = getScrollProperties();
      const currentTime = Date.now();

      // Update scroll positions
      setScrollX(props.x);
      setScrollY(props.y);

      // Update scroll dimensions
      if (target === window) {
        setScrollHeight(document.documentElement.scrollHeight);
        setScrollWidth(document.documentElement.scrollWidth);
      } else if (target) {
        const element = target as HTMLElement;
        setScrollHeight(element.scrollHeight);
        setScrollWidth(element.scrollWidth);
      }

      // Update boundary states
      setIsAtTop(props.y <= 0);
      setIsAtBottom(props.y >= props.maxY - 1); // -1 for floating point precision

      // Track direction if enabled
      if (trackDirection) {
        const prevX = prevScrollRef.current.x;
        const prevY = prevScrollRef.current.y;

        setDirection({
          x: props.x > prevX ? "right" : props.x < prevX ? "left" : null,
          y: props.y > prevY ? "down" : props.y < prevY ? "up" : null,
        });
      }

      // Track velocity if enabled
      if (trackVelocity) {
        const deltaTime = currentTime - prevTimeRef.current;
        const deltaX = props.x - prevScrollRef.current.x;
        const deltaY = props.y - prevScrollRef.current.y;

        if (deltaTime > 0) {
          setVelocity({
            x: (deltaX / deltaTime) * 1000, // pixels per second
            y: (deltaY / deltaTime) * 1000,
          });
        }
      }

      // Update previous values
      prevScrollRef.current = { x: props.x, y: props.y };
      prevTimeRef.current = currentTime;
    }, throttle);
  }, [getScrollProperties, throttle, trackDirection, trackVelocity, target]);

  // Initialize scroll values
  useEffect(() => {
    if (!target) return;

    const props = getScrollProperties();
    setScrollX(props.x);
    setScrollY(props.y);
    setIsAtTop(props.y <= 0);
    setIsAtBottom(props.y >= props.maxY - 1);

    if (target === window) {
      setScrollHeight(document.documentElement.scrollHeight);
      setScrollWidth(document.documentElement.scrollWidth);
    } else {
      const element = target as HTMLElement;
      setScrollHeight(element.scrollHeight);
      setScrollWidth(element.scrollWidth);
    }

    prevScrollRef.current = { x: props.x, y: props.y };
  }, [target, getScrollProperties]);

  // Attach scroll listener
  useEffect(() => {
    if (!target) return;

    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [target, handleScroll]);

  // Handle scroll lock
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isLocked) {
      // Store current scroll position
      const currentScrollY = window.pageYOffset;

      // Apply lock styles
      body.style.position = "fixed";
      body.style.top = `-${currentScrollY}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      // Get the scroll position that was stored
      const scrollY = parseInt(body.style.top || "0") * -1;

      // Remove lock styles
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";

      // Restore scroll position
      if (scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
    }

    return () => {
      // Cleanup on unmount
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";
    };
  }, [isLocked]);

  // Scroll control functions
  const scrollTo = useCallback(
    (x: number, y: number, smooth = true) => {
      if (!target) return;

      if (target === window) {
        window.scrollTo({
          left: x,
          top: y,
          behavior: smooth ? "smooth" : "auto",
        });
      } else {
        const element = target as HTMLElement;
        element.scrollTo({
          left: x,
          top: y,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    },
    [target]
  );

  const scrollToTop = useCallback(
    (smooth = true) => {
      scrollTo(scrollX, 0, smooth);
    },
    [scrollTo, scrollX]
  );

  const scrollToBottom = useCallback(
    (smooth = true) => {
      const props = getScrollProperties();
      scrollTo(scrollX, props.maxY, smooth);
    },
    [scrollTo, scrollX, getScrollProperties]
  );

  const scrollBy = useCallback(
    (deltaX: number, deltaY: number, smooth = true) => {
      if (!target) return;

      if (target === window) {
        window.scrollBy({
          left: deltaX,
          top: deltaY,
          behavior: smooth ? "smooth" : "auto",
        });
      } else {
        const element = target as HTMLElement;
        element.scrollBy({
          left: deltaX,
          top: deltaY,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    },
    [target]
  );

  const setScrollLock = useCallback((locked: boolean) => {
    setIsLocked(locked);
  }, []);

  return {
    scrollX,
    scrollY,
    isLocked,
    direction,
    velocity,
    setScrollLock,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollBy,
    isAtTop,
    isAtBottom,
    scrollHeight,
    scrollWidth,
  };
};
