import { useState, useEffect, useCallback } from 'react';

// Type for the hook's return value
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  clear: () => void;
}

// Configuration options for the hook
export interface UseLocalStorageOptions {
  serializer?: {
    stringify: (value: any) => string;
    parse: (value: string) => any;
  };
  syncAcrossTabs?: boolean;
}

/**
 * A React hook for managing localStorage with automatic JSON serialization
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value to use if no value exists in localStorage
 * @param options - Configuration options for serialization and tab synchronization
 * @returns An object containing the current value, setter, remove function, and clear function
 * 
 * @example
 * ```tsx
 * const { value, setValue, removeValue } = useLocalStorage('user', { name: 'John', age: 30 });
 * 
 * // Update the value
 * setValue({ name: 'Jane', age: 25 });
 * 
 * // Update using function
 * setValue(prev => ({ ...prev, age: prev.age + 1 }));
 * 
 * // Remove from localStorage
 * removeValue();
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = {
      stringify: JSON.stringify,
      parse: JSON.parse,
    },
    syncAcrossTabs = true,
  } = options;

  // Get value from localStorage on initial load
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return serializer.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, serializer]);

  const [value, setValue] = useState<T>(getStoredValue);

  // Update localStorage when value changes
  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, value, serializer]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Clear all localStorage
  const clear = useCallback(() => {
    try {
      setValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }, [initialValue]);

  // Listen for storage changes across tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = serializer.parse(e.newValue);
          setValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, serializer, syncAcrossTabs]);

  // Sync with localStorage on mount (handles SSR)
  useEffect(() => {
    const storedValue = getStoredValue();
    if (JSON.stringify(storedValue) !== JSON.stringify(value)) {
      setValue(storedValue);
    }
  }, [getStoredValue, value]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    clear,
  };
}

export default useLocalStorage;
