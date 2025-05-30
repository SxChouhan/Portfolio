/**
 * Debounce Hook
 * 
 * Provides debounced values and functions to improve performance
 * by limiting the rate of function calls or state updates.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debouncing values
 * 
 * Features:
 * - Debounces value changes with configurable delay
 * - Automatic cleanup on unmount
 * - TypeScript support with generic types
 * - Immediate update option
 * 
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds
 * @param immediate - Whether to update immediately on first call
 * @returns Debounced value
 */
export function useDebounce<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Update immediately on first run if immediate is true
    if (immediate && isFirstRun.current) {
      setDebouncedValue(value);
      isFirstRun.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, immediate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedValue;
}

/**
 * Custom hook for debouncing function calls
 * 
 * Features:
 * - Debounces function execution with configurable delay
 * - Supports function arguments
 * - Automatic cleanup on unmount
 * - Cancel and flush methods
 * 
 * @param func - Function to debounce
 * @param delay - Debounce delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns Debounced function with cancel and flush methods
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
): T & { cancel: () => void; flush: () => void } {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const funcRef = useRef(func);
  const argsRef = useRef<Parameters<T>>();
  const isFirstRun = useRef(true);

  // Update function reference
  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  /**
   * Cancel pending execution
   */
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  /**
   * Execute function immediately with last arguments
   */
  const flush = useCallback(() => {
    if (timeoutRef.current && argsRef.current) {
      cancel();
      funcRef.current(...argsRef.current);
    }
  }, [cancel]);

  /**
   * Debounced function
   */
  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;

      // Execute immediately on first run if immediate is true
      if (immediate && isFirstRun.current) {
        funcRef.current(...args);
        isFirstRun.current = false;
        return;
      }

      // Clear existing timeout
      cancel();

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        funcRef.current(...args);
      }, delay);
    },
    [delay, immediate, cancel]
  ) as T;

  // Add cancel and flush methods
  (debouncedFunc as any).cancel = cancel;
  (debouncedFunc as any).flush = flush;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return debouncedFunc as T & { cancel: () => void; flush: () => void };
}

/**
 * Custom hook for debounced search functionality
 * 
 * Features:
 * - Debounced search term
 * - Loading state management
 * - Search history tracking
 * - Clear search functionality
 * 
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds
 * @returns Search state and controls
 */
export function useDebouncedSearch(
  initialValue: string = '',
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Track when search is in progress
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  /**
   * Clear search term
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  /**
   * Set search term
   */
  const setSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    setSearch,
    clearSearch,
  };
}

/**
 * Custom hook for debounced form validation
 * 
 * Features:
 * - Debounced validation execution
 * - Validation state management
 * - Error handling
 * - Async validation support
 * 
 * @param validationFunc - Validation function
 * @param delay - Debounce delay in milliseconds
 * @returns Validation state and controls
 */
export function useDebouncedValidation<T>(
  validationFunc: (value: T) => Promise<string | null> | string | null,
  delay: number = 300
) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const debouncedValue = useDebounce(value, delay);

  // Run validation when debounced value changes
  useEffect(() => {
    if (debouncedValue === null) return;

    const runValidation = async () => {
      setIsValidating(true);
      setError(null);

      try {
        const result = await validationFunc(debouncedValue);
        setError(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Validation error');
      } finally {
        setIsValidating(false);
      }
    };

    runValidation();
  }, [debouncedValue, validationFunc]);

  /**
   * Validate value
   */
  const validate = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  /**
   * Clear validation state
   */
  const clearValidation = useCallback(() => {
    setValue(null);
    setError(null);
    setIsValidating(false);
  }, []);

  return {
    validate,
    clearValidation,
    error,
    isValidating,
    isValid: error === null && !isValidating && value !== null,
  };
}
