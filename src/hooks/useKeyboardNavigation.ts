/**
 * Keyboard Navigation Hook
 * 
 * Provides keyboard navigation functionality for improved accessibility
 * and user experience with keyboard-only interactions.
 */

import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  /** Enable arrow key navigation */
  enableArrowKeys?: boolean;
  /** Enable tab navigation */
  enableTabNavigation?: boolean;
  /** Enable escape key handling */
  enableEscapeKey?: boolean;
  /** Enable enter/space key handling */
  enableActionKeys?: boolean;
  /** Selector for focusable elements */
  focusableSelector?: string;
  /** Wrap around when reaching end */
  wrapAround?: boolean;
  /** Prevent default behavior */
  preventDefault?: boolean;
}

interface UseKeyboardNavigationReturn {
  /** Ref to attach to container element */
  containerRef: React.RefObject<HTMLElement>;
  /** Focus the first focusable element */
  focusFirst: () => void;
  /** Focus the last focusable element */
  focusLast: () => void;
  /** Focus the next focusable element */
  focusNext: () => void;
  /** Focus the previous focusable element */
  focusPrevious: () => void;
  /** Get all focusable elements */
  getFocusableElements: () => HTMLElement[];
}

/**
 * Default selector for focusable elements
 */
const DEFAULT_FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Custom hook for keyboard navigation
 * 
 * Features:
 * - Arrow key navigation
 * - Tab navigation management
 * - Escape key handling
 * - Enter/Space key actions
 * - Focus management utilities
 * - Accessibility compliant
 * 
 * @param options - Navigation configuration
 * @returns Navigation utilities and ref
 */
export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {}
): UseKeyboardNavigationReturn {
  const {
    enableArrowKeys = true,
    enableTabNavigation = true,
    enableEscapeKey = true,
    enableActionKeys = true,
    focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
    wrapAround = true,
    preventDefault = true,
  } = options;

  const containerRef = useRef<HTMLElement>(null);

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(focusableSelector);
    return Array.from(elements) as HTMLElement[];
  }, [focusableSelector]);

  /**
   * Get the currently focused element index
   */
  const getCurrentFocusIndex = useCallback((): number => {
    const focusableElements = getFocusableElements();
    const activeElement = document.activeElement as HTMLElement;
    return focusableElements.indexOf(activeElement);
  }, [getFocusableElements]);

  /**
   * Focus an element by index
   */
  const focusByIndex = useCallback((index: number) => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    let targetIndex = index;
    
    if (wrapAround) {
      if (targetIndex < 0) {
        targetIndex = focusableElements.length - 1;
      } else if (targetIndex >= focusableElements.length) {
        targetIndex = 0;
      }
    } else {
      targetIndex = Math.max(0, Math.min(targetIndex, focusableElements.length - 1));
    }

    const targetElement = focusableElements[targetIndex];
    if (targetElement) {
      targetElement.focus();
    }
  }, [getFocusableElements, wrapAround]);

  /**
   * Focus the first focusable element
   */
  const focusFirst = useCallback(() => {
    focusByIndex(0);
  }, [focusByIndex]);

  /**
   * Focus the last focusable element
   */
  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    focusByIndex(focusableElements.length - 1);
  }, [focusByIndex, getFocusableElements]);

  /**
   * Focus the next focusable element
   */
  const focusNext = useCallback(() => {
    const currentIndex = getCurrentFocusIndex();
    focusByIndex(currentIndex + 1);
  }, [getCurrentFocusIndex, focusByIndex]);

  /**
   * Focus the previous focusable element
   */
  const focusPrevious = useCallback(() => {
    const currentIndex = getCurrentFocusIndex();
    focusByIndex(currentIndex - 1);
  }, [getCurrentFocusIndex, focusByIndex]);

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle events within our container
    if (!containerRef.current?.contains(event.target as Node)) {
      return;
    }

    let handled = false;

    // Arrow key navigation
    if (enableArrowKeys) {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          focusNext();
          handled = true;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          focusPrevious();
          handled = true;
          break;
      }
    }

    // Tab navigation
    if (enableTabNavigation) {
      switch (event.key) {
        case 'Tab':
          if (event.shiftKey) {
            focusPrevious();
          } else {
            focusNext();
          }
          handled = true;
          break;
      }
    }

    // Home/End navigation
    switch (event.key) {
      case 'Home':
        focusFirst();
        handled = true;
        break;
      case 'End':
        focusLast();
        handled = true;
        break;
    }

    // Escape key handling
    if (enableEscapeKey && event.key === 'Escape') {
      // Blur current element or trigger escape callback
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && containerRef.current?.contains(activeElement)) {
        activeElement.blur();
        handled = true;
      }
    }

    // Action keys (Enter/Space)
    if (enableActionKeys && (event.key === 'Enter' || event.key === ' ')) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && containerRef.current?.contains(activeElement)) {
        // Let buttons and links handle their own click events
        if (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A') {
          // Don't prevent default for these elements
          return;
        }
        
        // For other elements, trigger a click event
        activeElement.click();
        handled = true;
      }
    }

    // Prevent default if we handled the event
    if (handled && preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [
    enableArrowKeys,
    enableTabNavigation,
    enableEscapeKey,
    enableActionKeys,
    preventDefault,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
  ]);

  /**
   * Set up keyboard event listeners
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements,
  };
}
