/**
 * Media Query Hook
 * 
 * Provides responsive design functionality with media query matching
 * and breakpoint detection for adaptive user interfaces.
 */

import { useState, useEffect, useCallback } from 'react';
import { BREAKPOINTS } from '../constants';

/**
 * Custom hook for media query matching
 * 
 * Features:
 * - Real-time media query matching
 * - SSR compatibility
 * - Automatic cleanup
 * - TypeScript support
 * 
 * @param query - Media query string
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // Return false during SSR
    if (typeof window === 'undefined') return false;
    
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mediaQuery: MediaQueryList;
    
    try {
      mediaQuery = window.matchMedia(query);
    } catch {
      // Invalid media query
      return;
    }

    // Update state with current match
    setMatches(mediaQuery.matches);

    // Create event handler
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (with fallback for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Hook for detecting specific breakpoints
 */
export function useBreakpoint() {
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const is2Xl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`);

  const getCurrentBreakpoint = useCallback(() => {
    if (is2Xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  }, [isSm, isMd, isLg, isXl, is2Xl]);

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isXs: !isSm,
    currentBreakpoint: getCurrentBreakpoint(),
    isDesktop: isLg,
    isTablet: isMd && !isLg,
    isMobile: !isMd,
  };
}

/**
 * Hook for detecting device orientation
 */
export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' : 'landscape',
  };
}

/**
 * Hook for detecting user preferences
 */
export function useUserPreferences() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersReducedTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');

  return {
    prefersDark,
    prefersLight: !prefersDark,
    prefersReducedMotion,
    prefersHighContrast,
    prefersReducedTransparency,
  };
}

/**
 * Hook for detecting device capabilities
 */
export function useDeviceCapabilities() {
  const hasHover = useMediaQuery('(hover: hover)');
  const hasPointer = useMediaQuery('(pointer: fine)');
  const hasTouch = useMediaQuery('(pointer: coarse)');
  const supportsP3 = useMediaQuery('(color-gamut: p3)');
  const isHighDPI = useMediaQuery('(min-resolution: 2dppx)');

  return {
    hasHover,
    hasPointer,
    hasTouch,
    supportsP3,
    isHighDPI,
    isTouchDevice: hasTouch && !hasPointer,
    isDesktopDevice: hasHover && hasPointer,
  };
}

/**
 * Hook for responsive values based on breakpoints
 */
export function useResponsiveValue<T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined {
  const { currentBreakpoint } = useBreakpoint();

  // Find the appropriate value for current breakpoint
  const breakpointOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint as any);

  // Look for value starting from current breakpoint and going down
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }

  return undefined;
}

/**
 * Hook for container queries (experimental)
 */
export function useContainerQuery(
  containerRef: React.RefObject<HTMLElement>,
  query: string
): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    // Check if container queries are supported
    if (!('ResizeObserver' in window)) {
      return;
    }

    const checkQuery = () => {
      // Simple width-based container query implementation
      const width = container.offsetWidth;
      
      // Parse simple width queries like "(min-width: 400px)"
      const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
      const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);
      
      let result = true;
      
      if (minWidthMatch) {
        const minWidth = parseInt(minWidthMatch[1], 10);
        result = result && width >= minWidth;
      }
      
      if (maxWidthMatch) {
        const maxWidth = parseInt(maxWidthMatch[1], 10);
        result = result && width <= maxWidth;
      }
      
      setMatches(result);
    };

    // Initial check
    checkQuery();

    // Set up ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver(checkQuery);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, query]);

  return matches;
}
