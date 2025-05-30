/**
 * Focus Trap Hook
 * 
 * Traps focus within a container element for accessibility compliance
 * in modals, dialogs, and other overlay components.
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  active?: boolean;
  /** Whether to focus the first element on activation */
  autoFocus?: boolean;
  /** Whether to restore focus on deactivation */
  restoreFocus?: boolean;
  /** Custom selector for focusable elements */
  focusableSelector?: string;
  /** Element to focus initially */
  initialFocus?: HTMLElement | (() => HTMLElement | null);
  /** Element to focus when trap is deactivated */
  fallbackFocus?: HTMLElement | (() => HTMLElement | null);
}

interface UseFocusTrapReturn {
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLElement>;
  /** Activate the focus trap */
  activate: () => void;
  /** Deactivate the focus trap */
  deactivate: () => void;
  /** Get all focusable elements */
  getFocusableElements: () => HTMLElement[];
}

/**
 * Default selector for focusable elements
 */
const DEFAULT_FOCUSABLE_SELECTOR = [
  'button:not([disabled]):not([aria-hidden="true"])',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
  'select:not([disabled]):not([aria-hidden="true"])',
  'textarea:not([disabled]):not([aria-hidden="true"])',
  'a[href]:not([aria-hidden="true"])',
  'area[href]:not([aria-hidden="true"])',
  'object:not([aria-hidden="true"])',
  'embed:not([aria-hidden="true"])',
  '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
  '[contenteditable="true"]:not([aria-hidden="true"])',
  'audio[controls]:not([aria-hidden="true"])',
  'video[controls]:not([aria-hidden="true"])',
  'summary:not([aria-hidden="true"])',
].join(', ');

/**
 * Custom hook for focus trapping
 * 
 * Features:
 * - Traps focus within a container
 * - Automatic focus management
 * - Keyboard navigation support
 * - Restore focus on deactivation
 * - Configurable focusable elements
 * - Accessibility compliant
 * 
 * @param options - Focus trap configuration
 * @returns Focus trap utilities and ref
 */
export function useFocusTrap(
  options: UseFocusTrapOptions = {}
): UseFocusTrapReturn {
  const {
    active = true,
    autoFocus = true,
    restoreFocus = true,
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
    initialFocus,
    fallbackFocus,
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const isActive = useRef(false);

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(focusableSelector);
    return Array.from(elements).filter((element) => {
      const htmlElement = element as HTMLElement;
      
      // Check if element is visible and not disabled
      return (
        htmlElement.offsetWidth > 0 &&
        htmlElement.offsetHeight > 0 &&
        !htmlElement.hasAttribute('disabled') &&
        htmlElement.getAttribute('aria-hidden') !== 'true'
      );
    }) as HTMLElement[];
  }, [focusableSelector]);

  /**
   * Get the initial focus element
   */
  const getInitialFocusElement = useCallback((): HTMLElement | null => {
    if (initialFocus) {
      if (typeof initialFocus === 'function') {
        return initialFocus();
      }
      return initialFocus;
    }

    const focusableElements = getFocusableElements();
    return focusableElements[0] || null;
  }, [initialFocus, getFocusableElements]);

  /**
   * Get the fallback focus element
   */
  const getFallbackFocusElement = useCallback((): HTMLElement | null => {
    if (fallbackFocus) {
      if (typeof fallbackFocus === 'function') {
        return fallbackFocus();
      }
      return fallbackFocus;
    }

    return document.body;
  }, [fallbackFocus]);

  /**
   * Handle tab key navigation
   */
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (!isActive.current || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab: move to previous element
      if (activeElement === firstElement || !focusableElements.includes(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: move to next element
      if (activeElement === lastElement || !focusableElements.includes(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements]);

  /**
   * Handle escape key
   */
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (!isActive.current || event.key !== 'Escape') return;
    
    // Allow escape key to bubble up for handling by parent components
    // The parent component should handle deactivating the focus trap
  }, []);

  /**
   * Handle focus events
   */
  const handleFocus = useCallback((event: FocusEvent) => {
    if (!isActive.current || !containerRef.current) return;

    const target = event.target as HTMLElement;
    
    // If focus moves outside the container, bring it back
    if (!containerRef.current.contains(target)) {
      event.preventDefault();
      
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [getFocusableElements]);

  /**
   * Activate the focus trap
   */
  const activate = useCallback(() => {
    if (isActive.current) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;
    
    isActive.current = true;

    // Focus the initial element if autoFocus is enabled
    if (autoFocus) {
      const initialElement = getInitialFocusElement();
      if (initialElement) {
        // Use setTimeout to ensure the element is focusable
        setTimeout(() => {
          initialElement.focus();
        }, 0);
      }
    }
  }, [autoFocus, getInitialFocusElement]);

  /**
   * Deactivate the focus trap
   */
  const deactivate = useCallback(() => {
    if (!isActive.current) return;

    isActive.current = false;

    // Restore focus to the previously focused element
    if (restoreFocus && previousActiveElement.current) {
      try {
        previousActiveElement.current.focus();
      } catch (error) {
        // If restoring focus fails, focus the fallback element
        const fallbackElement = getFallbackFocusElement();
        if (fallbackElement) {
          fallbackElement.focus();
        }
      }
    }

    previousActiveElement.current = null;
  }, [restoreFocus, getFallbackFocusElement]);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    if (!active) {
      deactivate();
      return;
    }

    activate();

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('focus', handleFocus, true);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('focus', handleFocus, true);
      deactivate();
    };
  }, [active, activate, deactivate, handleTabKey, handleEscapeKey, handleFocus]);

  return {
    containerRef,
    activate,
    deactivate,
    getFocusableElements,
  };
}

/**
 * Hook for focus trap with return focus management
 */
export function useFocusTrapWithReturn(
  active: boolean,
  returnFocusRef: React.RefObject<HTMLElement>
) {
  const focusTrap = useFocusTrap({
    active,
    restoreFocus: false, // We'll handle this manually
  });

  useEffect(() => {
    if (!active && returnFocusRef.current) {
      returnFocusRef.current.focus();
    }
  }, [active, returnFocusRef]);

  return focusTrap;
}

/**
 * Hook for modal focus trap
 */
export function useModalFocusTrap(isOpen: boolean) {
  return useFocusTrap({
    active: isOpen,
    autoFocus: true,
    restoreFocus: true,
  });
}
