import { useState, useEffect } from 'react';

/**
 * Options for the isMobile hook
 */
export interface IsMobileOptions {
  /**
   * The breakpoint in pixels below which the device is considered mobile
   * @default 768
   */
  breakpoint?: number;
}

/**
 * A React hook that detects if the current device is mobile based on screen width
 * 
 * @param options - Configuration options for the hook
 * @param options.breakpoint - The pixel width below which device is considered mobile (default: 768)
 * @returns boolean indicating if the device is mobile
 * 
 * @example
 * ```tsx
 * import { isMobile } from 'light-hooks';
 * 
 * function MyComponent() {
 *   const mobile = isMobile(); // Uses default 768px breakpoint
 *   const mobileCustom = isMobile({ breakpoint: 640 }); // Custom breakpoint
 * 
 *   return (
 *     <div>
 *       {mobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 * ```
 */
export const isMobile = (options: IsMobileOptions = {}): boolean => {
  const { breakpoint = 768 } = options;
  
  const [mobile, setMobile] = useState<boolean>(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false; // Default to false during SSR
    }
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    // Handle case where window is not available (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    setMobile(window.innerWidth < breakpoint);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return mobile;
};

export default isMobile;
