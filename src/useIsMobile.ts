import { useState, useEffect, useCallback } from 'react';

/**
 * Options for the useIsMobile hook
 */
export interface UseIsMobileOptions {
  /**
   * The breakpoint in pixels below which the device is considered mobile
   * @default 768
   */
  breakpoint?: number;
}

/**
 * A React hook that detects if the current device is mobile based on screen width
 * Uses ResizeObserver for optimal performance instead of window resize events
 * 
 * @param options - Configuration options for the hook
 * @param options.breakpoint - The pixel width below which device is considered mobile (default: 768)
 * @returns boolean indicating if the device is mobile
 * 
 * @example
 * ```tsx
 * import { useIsMobile } from 'light-hooks';
 * 
 * function MyComponent() {
 *   const mobile = useIsMobile(); // Uses default 768px breakpoint
 *   const mobileCustom = useIsMobile({ breakpoint: 640 }); // Custom breakpoint
 * 
 *   return (
 *     <div>
 *       {mobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsMobile = (options: UseIsMobileOptions = {}): boolean => {
  const { breakpoint = 768 } = options;
  
  const [mobile, setMobile] = useState<boolean>(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false; // Default to false during SSR
    }
    return window.innerWidth < breakpoint;
  });

  const checkIsMobile = useCallback((width: number) => {
    const isMobileWidth = width < breakpoint;
    setMobile(prevMobile => prevMobile !== isMobileWidth ? isMobileWidth : prevMobile);
  }, [breakpoint]);

  useEffect(() => {
    // Handle case where window is not available (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Set initial value
    checkIsMobile(window.innerWidth);

    // Use ResizeObserver for better performance
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          checkIsMobile(entry.contentRect.width);
        }
      });

      // Observe the document element
      resizeObserver.observe(document.documentElement);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // Fallback to window resize for older browsers
      const handleResize = () => {
        checkIsMobile(window.innerWidth);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [checkIsMobile]);

  return mobile;
};

// Keep the old export for backward compatibility
export const isMobile = useIsMobile;
export type IsMobileOptions = UseIsMobileOptions; // Deprecated alias

export default useIsMobile;
