/**
 * Intersection Observer Hook
 * 
 * Provides intersection observer functionality for scroll-based animations
 * and lazy loading with performance optimizations and accessibility support.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { PERFORMANCE_CONFIG } from '../constants';

interface UseIntersectionObserverOptions {
  /** Root element for intersection (default: viewport) */
  root?: Element | null;
  /** Root margin for intersection calculation */
  rootMargin?: string;
  /** Threshold for intersection trigger */
  threshold?: number | number[];
  /** Only trigger once */
  triggerOnce?: boolean;
  /** Disable observer (useful for reduced motion) */
  disabled?: boolean;
}

interface UseIntersectionObserverReturn {
  /** Ref to attach to target element */
  ref: React.RefObject<Element>;
  /** Whether element is intersecting */
  isIntersecting: boolean;
  /** Intersection observer entry */
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for intersection observer
 * 
 * Features:
 * - Performance optimized with single observer instance
 * - Supports multiple thresholds
 * - Respects reduced motion preferences
 * - Automatic cleanup
 * - TypeScript support
 * 
 * @param options - Intersection observer configuration
 * @returns Intersection state and ref
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = PERFORMANCE_CONFIG.intersectionRootMargin,
    threshold = PERFORMANCE_CONFIG.intersectionThreshold,
    triggerOnce = true,
    disabled = false,
  } = options;

  const ref = useRef<Element>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  /**
   * Check if reduced motion is preferred
   */
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(PERFORMANCE_CONFIG.reducedMotionQuery).matches;
  }, []);

  /**
   * Intersection observer callback
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [observerEntry] = entries;
      
      if (!observerEntry) return;

      setEntry(observerEntry);
      
      const isCurrentlyIntersecting = observerEntry.isIntersecting;
      
      // If reduced motion is preferred, immediately show content
      if (prefersReducedMotion()) {
        setIsIntersecting(true);
        setHasTriggered(true);
        return;
      }

      // Handle trigger once logic
      if (triggerOnce) {
        if (isCurrentlyIntersecting && !hasTriggered) {
          setIsIntersecting(true);
          setHasTriggered(true);
        }
      } else {
        setIsIntersecting(isCurrentlyIntersecting);
      }
    },
    [triggerOnce, hasTriggered, prefersReducedMotion]
  );

  /**
   * Set up intersection observer
   */
  useEffect(() => {
    const element = ref.current;
    
    // Early return if disabled or no element
    if (disabled || !element) {
      return;
    }

    // Check for IntersectionObserver support
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      // Fallback: assume element is visible
      setIsIntersecting(true);
      return;
    }

    // Create observer with error handling
    let observer: IntersectionObserver;
    
    try {
      observer = new IntersectionObserver(handleIntersection, {
        root,
        rootMargin,
        threshold,
      });

      observer.observe(element);
    } catch (error) {
      console.error('Failed to create IntersectionObserver:', error);
      // Fallback: assume element is visible
      setIsIntersecting(true);
      return;
    }

    // Cleanup function
    return () => {
      if (observer && element) {
        try {
          observer.unobserve(element);
          observer.disconnect();
        } catch (error) {
          console.error('Failed to cleanup IntersectionObserver:', error);
        }
      }
    };
  }, [
    disabled,
    root,
    rootMargin,
    threshold,
    handleIntersection,
  ]);

  /**
   * Reset state when triggerOnce changes
   */
  useEffect(() => {
    if (!triggerOnce) {
      setHasTriggered(false);
    }
  }, [triggerOnce]);

  /**
   * Handle reduced motion preference changes
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(PERFORMANCE_CONFIG.reducedMotionQuery);
    
    const handleChange = () => {
      if (mediaQuery.matches) {
        setIsIntersecting(true);
        setHasTriggered(true);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return {
    ref,
    isIntersecting,
    entry,
  };
}

/**
 * Hook for lazy loading images with intersection observer
 */
export function useLazyImage(src: string, options?: UseIntersectionObserverOptions) {
  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    ...options,
  });
  
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  return {
    ref,
    src: imageSrc,
    isLoaded,
    hasError,
    onLoad: handleLoad,
    onError: handleError,
  };
}
