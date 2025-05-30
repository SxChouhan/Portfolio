/**
 * Click Outside Hook
 * 
 * Detects clicks outside of a specified element and triggers a callback.
 * Useful for closing modals, dropdowns, and other overlay components.
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseClickOutsideOptions {
  /** Whether the hook is enabled */
  enabled?: boolean;
  /** Event types to listen for */
  events?: string[];
  /** Whether to capture events */
  capture?: boolean;
}

/**
 * Custom hook for detecting clicks outside an element
 * 
 * Features:
 * - Configurable event types (click, mousedown, touchstart)
 * - Event capture support
 * - Enable/disable functionality
 * - TypeScript support
 * - Automatic cleanup
 * 
 * @param callback - Function to call when click outside is detected
 * @param options - Configuration options
 * @returns Ref to attach to the target element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: (event: Event) => void,
  options: UseClickOutsideOptions = {}
): React.RefObject<T> {
  const {
    enabled = true,
    events = ['mousedown', 'touchstart'],
    capture = true,
  } = options;

  const ref = useRef<T>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * Handle click events
   */
  const handleEvent = useCallback((event: Event) => {
    const element = ref.current;
    
    // Don't trigger if element doesn't exist
    if (!element) return;
    
    // Don't trigger if click is inside the element
    if (element.contains(event.target as Node)) return;
    
    // Don't trigger if event target is not in the document
    if (!document.contains(event.target as Node)) return;
    
    // Trigger callback
    callbackRef.current(event);
  }, []);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    // Add event listeners for each event type
    events.forEach(eventType => {
      document.addEventListener(eventType, handleEvent, capture);
    });

    // Cleanup function
    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleEvent, capture);
      });
    };
  }, [enabled, events, capture, handleEvent]);

  return ref;
}

/**
 * Hook for detecting clicks outside with escape key support
 */
export function useClickOutsideWithEscape<T extends HTMLElement = HTMLElement>(
  callback: (event: Event) => void,
  options: UseClickOutsideOptions & { enableEscape?: boolean } = {}
): React.RefObject<T> {
  const { enableEscape = true, ...clickOutsideOptions } = options;
  
  const ref = useClickOutside<T>(callback, clickOutsideOptions);

  // Handle escape key
  useEffect(() => {
    if (!enableEscape || !clickOutsideOptions.enabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback(event);
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [callback, enableEscape, clickOutsideOptions.enabled]);

  return ref;
}

/**
 * Hook for detecting clicks outside multiple elements
 */
export function useClickOutsideMultiple(
  callback: (event: Event) => void,
  options: UseClickOutsideOptions = {}
): {
  refs: React.RefObject<HTMLElement>[];
  addRef: () => React.RefObject<HTMLElement>;
  removeRef: (ref: React.RefObject<HTMLElement>) => void;
} {
  const {
    enabled = true,
    events = ['mousedown', 'touchstart'],
    capture = true,
  } = options;

  const refs = useRef<React.RefObject<HTMLElement>[]>([]);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * Add a new ref
   */
  const addRef = useCallback((): React.RefObject<HTMLElement> => {
    const newRef = { current: null };
    refs.current.push(newRef);
    return newRef;
  }, []);

  /**
   * Remove a ref
   */
  const removeRef = useCallback((refToRemove: React.RefObject<HTMLElement>) => {
    refs.current = refs.current.filter(ref => ref !== refToRemove);
  }, []);

  /**
   * Handle click events
   */
  const handleEvent = useCallback((event: Event) => {
    // Check if click is inside any of the elements
    const isInsideAny = refs.current.some(ref => {
      const element = ref.current;
      return element && element.contains(event.target as Node);
    });

    // Don't trigger if click is inside any element
    if (isInsideAny) return;
    
    // Don't trigger if event target is not in the document
    if (!document.contains(event.target as Node)) return;
    
    // Trigger callback
    callbackRef.current(event);
  }, []);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    // Add event listeners for each event type
    events.forEach(eventType => {
      document.addEventListener(eventType, handleEvent, capture);
    });

    // Cleanup function
    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleEvent, capture);
      });
    };
  }, [enabled, events, capture, handleEvent]);

  return {
    refs: refs.current,
    addRef,
    removeRef,
  };
}

/**
 * Hook for conditional click outside detection
 */
export function useConditionalClickOutside<T extends HTMLElement = HTMLElement>(
  callback: (event: Event) => void,
  condition: boolean,
  options: Omit<UseClickOutsideOptions, 'enabled'> = {}
): React.RefObject<T> {
  return useClickOutside<T>(callback, { ...options, enabled: condition });
}

/**
 * Hook for click outside with delay
 */
export function useDelayedClickOutside<T extends HTMLElement = HTMLElement>(
  callback: (event: Event) => void,
  delay: number = 0,
  options: UseClickOutsideOptions = {}
): React.RefObject<T> {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const delayedCallback = useCallback((event: Event) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        callback(event);
      }, delay);
    } else {
      callback(event);
    }
  }, [callback, delay]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useClickOutside<T>(delayedCallback, options);
}
