import { useEffect, useState } from 'react';

/**
 * Configuration options for the useDebounce hook
 */
export interface UseDebounceOptions {
  /**
   * The delay in milliseconds before the debounced value updates
   * @default 500
   */
  delay?: number;
  /**
   * Whether to update the debounced value immediately on the first call
   * @default false
   */
  leading?: boolean;
  /**
   * Maximum time to wait before forcing an update (in milliseconds)
   * Useful to ensure the value eventually updates even with continuous changes
   * @default undefined
   */
  maxWait?: number;
}

/**
 * A React hook that debounces a value, delaying updates until after a specified delay
 * 
 * This hook is perfect for search inputs, API calls, or any scenario where you want
 * to delay execution until the user stops making changes.
 * 
 * @param value - The value to debounce
 * @param options - Configuration options for debouncing behavior
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * import { useDebounce } from 'light-hooks';
 * 
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, { delay: 300 });
 * 
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // Make API call with debounced search term
 *       fetchSearchResults(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 * 
 *   return (
 *     <input
 *       type="text"
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With leading edge (immediate first execution)
 * const debouncedValue = useDebounce(value, { 
 *   delay: 300, 
 *   leading: true 
 * });
 * 
 * // With maximum wait time
 * const debouncedValue = useDebounce(value, { 
 *   delay: 300, 
 *   maxWait: 1000 
 * });
 * ```
 */
export const useDebounce = <T>(
  value: T,
  options: UseDebounceOptions = {}
): T => {
  const { delay = 500, leading = false, maxWait } = options;
  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isFirstCall, setIsFirstCall] = useState(true);

  useEffect(() => {
    // Handle leading edge - update immediately on first call
    if (leading && isFirstCall) {
      setDebouncedValue(value);
      setIsFirstCall(false);
      return;
    }

    // Set up the debounce timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsFirstCall(false);
    }, delay);

    // Set up max wait timer if specified
    let maxWaitTimer: ReturnType<typeof setTimeout> | undefined;
    if (maxWait && !isFirstCall) {
      maxWaitTimer = setTimeout(() => {
        setDebouncedValue(value);
      }, maxWait);
    }

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (maxWaitTimer) {
        clearTimeout(maxWaitTimer);
      }
    };
  }, [value, delay, leading, maxWait, isFirstCall]);

  // Reset first call flag when value changes
  useEffect(() => {
    if (!leading) {
      setIsFirstCall(false);
    }
  }, [value, leading]);

  return debouncedValue;
};

export default useDebounce;
