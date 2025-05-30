/**
 * Scroll Animation Hook
 * 
 * Provides scroll-based animation triggers with performance optimizations
 * and accessibility support for reduced motion preferences.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';
import { PERFORMANCE_CONFIG } from '../constants';

interface UseScrollAnimationOptions {
  /** Threshold for triggering animation */
  threshold?: number;
  /** Root margin for intersection calculation */
  rootMargin?: string;
  /** Only trigger once */
  triggerOnce?: boolean;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Disable animations (useful for reduced motion) */
  disabled?: boolean;
}

interface UseScrollAnimationReturn {
  /** Ref to attach to animated element */
  ref: React.RefObject<Element>;
  /** Whether element should be animated */
  shouldAnimate: boolean;
  /** Whether element is in view */
  isInView: boolean;
  /** Intersection observer entry */
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for scroll-based animations
 * 
 * Features:
 * - Intersection observer based triggering
 * - Respects reduced motion preferences
 * - Configurable thresholds and delays
 * - Performance optimized
 * - TypeScript support
 * 
 * @param options - Animation configuration
 * @returns Animation state and ref
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn {
  const {
    threshold = PERFORMANCE_CONFIG.intersectionThreshold,
    rootMargin = PERFORMANCE_CONFIG.intersectionRootMargin,
    triggerOnce = true,
    delay = 0,
    disabled = false,
  } = options;

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Check if reduced motion is preferred
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(PERFORMANCE_CONFIG.reducedMotionQuery).matches;
  }, []);

  // Use intersection observer to detect when element is in view
  const { ref, isIntersecting, entry } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
    disabled: disabled || prefersReducedMotion(),
  });

  // Handle animation triggering with delay
  useEffect(() => {
    if (disabled || prefersReducedMotion()) {
      setShouldAnimate(true);
      return;
    }

    if (isIntersecting) {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setShouldAnimate(true);
        }, delay);
      } else {
        setShouldAnimate(true);
      }
    } else if (!triggerOnce) {
      setShouldAnimate(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isIntersecting, delay, triggerOnce, disabled, prefersReducedMotion]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ref,
    shouldAnimate,
    isInView: isIntersecting,
    entry,
  };
}

/**
 * Hook for staggered animations
 */
export function useStaggeredAnimation(
  count: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options;
  const { ref, isInView } = useScrollAnimation(scrollOptions);
  const [animatedItems, setAnimatedItems] = useState<boolean[]>(
    new Array(count).fill(false)
  );

  useEffect(() => {
    if (isInView) {
      animatedItems.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedItems(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * staggerDelay);
      });
    } else if (!scrollOptions.triggerOnce) {
      setAnimatedItems(new Array(count).fill(false));
    }
  }, [isInView, count, staggerDelay, scrollOptions.triggerOnce]);

  return {
    ref,
    animatedItems,
    isInView,
  };
}
