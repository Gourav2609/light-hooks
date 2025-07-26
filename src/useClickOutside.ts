import { useEffect, useRef } from 'react';

/**
 * Options for the useClickOutside hook
 */
export interface UseClickOutsideOptions {
  /**
   * Whether the hook is enabled or disabled
   * @default true
   */
  enabled?: boolean;
  /**
   * Array of events to listen for
   * @default ['mousedown', 'touchstart']
   */
  events?: string[];
}

/**
 * A React hook that detects clicks outside of a specified element
 * 
 * @param callback - Function to call when clicking outside the element
 * @param options - Configuration options for the hook
 * @returns ref object to attach to the element you want to detect outside clicks for
 * 
 * @example
 * ```tsx
 * import { useClickOutside } from 'light-hooks';
 * 
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useClickOutside(onClose);
 * 
 *   if (!isOpen) return null;
 * 
 *   return (
 *     <div className="modal-overlay">
 *       <div ref={modalRef} className="modal-content">
 *         <h2>Modal Title</h2>
 *         <p>Click outside to close</p>
 *       </div>
 *     </div>
 *   );
 * }
 * 
 * // With options
 * function Dropdown({ isOpen, onClose }) {
 *   const dropdownRef = useClickOutside(onClose, {
 *     enabled: isOpen, // Only listen when dropdown is open
 *     events: ['mousedown'] // Only listen for mousedown events
 *   });
 * 
 *   return (
 *     <div ref={dropdownRef} className="dropdown">
 *       Dropdown content
 *     </div>
 *   );
 * }
 * ```
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void,
  options: UseClickOutsideOptions = {}
) => {
  const { enabled = true, events = ['mousedown', 'touchstart'] } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    // Don't set up listeners if disabled or no callback
    if (!enabled || !callback) {
      return;
    }

    const handleClickOutside = (event: Event) => {
      // Check if the ref exists and the clicked element is not inside it
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listeners for each specified event
    events.forEach((eventName) => {
      document.addEventListener(eventName, handleClickOutside, true);
    });

    // Cleanup function to remove event listeners
    return () => {
      events.forEach((eventName) => {
        document.removeEventListener(eventName, handleClickOutside, true);
      });
    };
  }, [callback, enabled, events]);

  return ref;
};

export default useClickOutside;
