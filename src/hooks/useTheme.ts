/**
 * Theme Management Hook
 * 
 * Provides theme state management with persistence and system preference detection.
 * Handles light/dark mode switching with smooth transitions and accessibility support.
 */

import { useEffect, useState, useCallback } from 'react';
import { THEME_CONFIG } from '../constants';
import type { Theme } from '../types';

interface UseThemeReturn {
  /** Current theme */
  theme: Theme;
  /** Toggle between light and dark theme */
  toggleTheme: () => void;
  /** Set specific theme */
  setTheme: (theme: Theme) => void;
  /** Whether the hook has mounted (for SSR) */
  mounted: boolean;
  /** Whether system prefers dark mode */
  systemPrefersDark: boolean;
}

/**
 * Custom hook for theme management
 * 
 * Features:
 * - Persistent theme storage
 * - System preference detection
 * - Smooth theme transitions
 * - SSR compatibility
 * - Accessibility support
 * 
 * @returns Theme state and controls
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(THEME_CONFIG.defaultTheme);
  const [mounted, setMounted] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  /**
   * Detect system theme preference
   */
  const detectSystemTheme = useCallback((): Theme => {
    if (typeof window === 'undefined') return THEME_CONFIG.defaultTheme;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);
    return mediaQuery.matches ? 'dark' : 'light';
  }, []);

  /**
   * Apply theme to document
   */
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isDark = newTheme === 'dark';

    // Add/remove dark class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        isDark ? '#18181b' : '#ffffff'
      );
    }

    // Store theme preference
    try {
      localStorage.setItem(THEME_CONFIG.storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  /**
   * Set theme with validation and side effects
   */
  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.warn(`Invalid theme: ${newTheme}. Using default theme.`);
      newTheme = THEME_CONFIG.defaultTheme;
    }

    setThemeState(newTheme);
    applyTheme(newTheme);

    // Announce theme change to screen readers
    const announcement = `Theme changed to ${newTheme} mode`;
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, [applyTheme]);

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  /**
   * Initialize theme on mount
   */
  useEffect(() => {
    let initialTheme: Theme = THEME_CONFIG.defaultTheme;

    try {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey) as Theme;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        initialTheme = savedTheme;
      } else {
        // Fall back to system preference
        initialTheme = detectSystemTheme();
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
      initialTheme = detectSystemTheme();
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, [detectSystemTheme, applyTheme]);

  /**
   * Listen for system theme changes
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
      
      // Only auto-switch if no manual preference is saved
      try {
        const savedTheme = localStorage.getItem(THEME_CONFIG.storageKey);
        if (!savedTheme) {
          const systemTheme = e.matches ? 'dark' : 'light';
          setTheme(systemTheme);
        }
      } catch (error) {
        console.warn('Failed to check theme preference:', error);
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
  }, [setTheme]);

  /**
   * Handle keyboard shortcuts for theme switching
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T to toggle theme
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        toggleTheme();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    mounted,
    systemPrefersDark,
  };
}
