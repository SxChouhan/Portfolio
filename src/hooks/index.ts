/**
 * Custom Hooks
 *
 * Collection of reusable custom hooks for the portfolio application.
 * These hooks encapsulate common functionality and state management
 * patterns to promote code reuse and maintainability.
 */

// Export hooks that are already created
export { useTheme } from './useTheme';
export { useScrollAnimation } from './useScrollAnimation';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useKeyboardNavigation } from './useKeyboardNavigation';
export { usePerformanceMonitor } from './usePerformanceMonitor';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useMediaQuery } from './useMediaQuery';
export { useClickOutside } from './useClickOutside';
export { useFocusTrap } from './useFocusTrap';

// Re-export commonly used hooks from external libraries
export { useLocalStorage as useLocalStorageExternal } from 'usehooks-ts';
