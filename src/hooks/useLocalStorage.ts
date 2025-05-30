/**
 * Local Storage Hook
 * 
 * Provides type-safe local storage functionality with SSR support,
 * error handling, and automatic serialization/deserialization.
 */

import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  /** Default value if key doesn't exist */
  defaultValue?: T;
  /** Custom serializer function */
  serializer?: {
    read: (value: string) => T;
    write: (value: T) => string;
  };
  /** Error handler for storage operations */
  onError?: (error: Error) => void;
}

interface UseLocalStorageReturn<T> {
  /** Current stored value */
  value: T;
  /** Set new value */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Remove value from storage */
  removeValue: () => void;
  /** Whether the hook has been initialized */
  isInitialized: boolean;
  /** Last error that occurred */
  error: Error | null;
}

/**
 * Default JSON serializer
 */
const defaultSerializer = {
  read: <T>(value: string): T => {
    try {
      return JSON.parse(value);
    } catch {
      return value as unknown as T;
    }
  },
  write: <T>(value: T): string => {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  },
};

/**
 * Custom hook for local storage with type safety
 * 
 * Features:
 * - Type-safe storage operations
 * - SSR compatibility
 * - Automatic serialization/deserialization
 * - Error handling with fallbacks
 * - Support for complex data types
 * - Storage event synchronization
 * 
 * @param key - Storage key
 * @param options - Configuration options
 * @returns Storage state and controls
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    defaultValue,
    serializer = defaultSerializer,
    onError,
  } = options;

  const [value, setValue] = useState<T>(() => {
    // Return default value during SSR
    if (typeof window === 'undefined') {
      return defaultValue as T;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue as T;
      }
      return serializer.read(item);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
      return defaultValue as T;
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Set value in state and localStorage
   */
  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        setError(null);
        
        // Handle function updates
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        
        // Update state
        setValue(valueToStore);
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          if (valueToStore === undefined || valueToStore === null) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, serializer.write(valueToStore));
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
        onError?.(err);
      }
    },
    [key, value, serializer, onError]
  );

  /**
   * Remove value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      setError(null);
      setValue(defaultValue as T);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      onError?.(err);
    }
  }, [key, defaultValue, onError]);

  /**
   * Initialize value from localStorage on mount
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      setError(null);
      const item = window.localStorage.getItem(key);
      
      if (item !== null) {
        const parsedValue = serializer.read(item);
        setValue(parsedValue);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      onError?.(err);
    } finally {
      setIsInitialized(true);
    }
  }, [key, serializer, onError]);

  /**
   * Listen for storage changes from other tabs/windows
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          setError(null);
          
          if (e.newValue === null) {
            setValue(defaultValue as T);
          } else {
            const newValue = serializer.read(e.newValue);
            setValue(newValue);
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          setError(err);
          onError?.(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, defaultValue, serializer, onError]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
    isInitialized,
    error,
  };
}

/**
 * Hook for storing boolean values
 */
export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false
) {
  return useLocalStorage(key, { defaultValue });
}

/**
 * Hook for storing string values
 */
export function useLocalStorageString(
  key: string,
  defaultValue: string = ''
) {
  return useLocalStorage(key, { defaultValue });
}

/**
 * Hook for storing number values
 */
export function useLocalStorageNumber(
  key: string,
  defaultValue: number = 0
) {
  return useLocalStorage(key, { defaultValue });
}

/**
 * Hook for storing array values
 */
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = []
) {
  return useLocalStorage(key, { defaultValue });
}

/**
 * Hook for storing object values
 */
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  defaultValue: T = {} as T
) {
  return useLocalStorage(key, { defaultValue });
}
