import { useCallback, useState } from 'react';

/**
 * Return values from the useToggle hook
 */
export interface UseToggleReturn {
  /** Current boolean value */
  value: boolean;
  /** Function to toggle the value */
  toggle: () => void;
  /** Function to set the value to true */
  setTrue: () => void;
  /** Function to set the value to false */
  setFalse: () => void;
  /** Function to set a specific value */
  setValue: (value: boolean) => void;
}

/**
 * A simple React hook for managing boolean state with convenient toggle functions
 * 
 * This hook provides an easy way to manage boolean state with additional utility
 * functions for common operations like toggling, setting true/false explicitly.
 * 
 * @param initialValue - The initial boolean value
 * @returns Object containing the current value and toggle functions
 * 
 * @example
 * ```tsx
 * import { useToggle } from 'light-hooks';
 * 
 * function Modal() {
 *   const { value: isOpen, toggle, setTrue: open, setFalse: close } = useToggle(false);
 * 
 *   return (
 *     <div>
 *       <button onClick={open}>Open Modal</button>
 *       {isOpen && (
 *         <div className="modal">
 *           <h2>Modal Content</h2>
 *           <button onClick={close}>Close</button>
 *           <button onClick={toggle}>Toggle</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Feature flags or settings
 * function Settings() {
 *   const { value: darkMode, toggle: toggleDarkMode } = useToggle(false);
 *   const { value: notifications, setValue: setNotifications } = useToggle(true);
 * 
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={darkMode}
 *           onChange={toggleDarkMode}
 *         />
 *         Dark Mode
 *       </label>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={notifications}
 *           onChange={(e) => setNotifications(e.target.checked)}
 *         />
 *         Enable Notifications
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Loading states
 * function DataComponent() {
 *   const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useToggle(false);
 * 
 *   const fetchData = async () => {
 *     startLoading();
 *     try {
 *       await api.getData();
 *     } finally {
 *       stopLoading();
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={fetchData} disabled={loading}>
 *         {loading ? 'Loading...' : 'Fetch Data'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useToggle = (initialValue: boolean = false): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(initialValue);

  // Toggle the current value
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  // Set value to true
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  // Set value to false
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  // Set specific value
  const setValueCallback = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: setValueCallback,
  };
};

export default useToggle;
