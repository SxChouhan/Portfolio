/**
 * Theme Toggle Button Component
 *
 * A floating action button that allows users to switch between light and dark themes.
 * Features smooth animations, accessibility support, and persistent theme storage.
 *
 * Features:
 * - Smooth theme transitions with Framer Motion
 * - Keyboard accessibility with proper ARIA labels
 * - Visual feedback with hover and tap animations
 * - Persistent theme preference storage
 * - System theme preference detection
 * - Screen reader announcements
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks';
import { cn } from '../lib/utils';
import { ANIMATION_CONFIG, A11Y_CONFIG } from '../constants';
import './ThemeButton.css';

/**
 * Theme button component props
 */
interface ThemeButtonProps {
  /** Additional CSS classes */
  className?: string;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Position variant */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Size configuration for different button variants
 */
const sizeConfig = {
  sm: { button: 'w-10 h-10', icon: 'w-4 h-4' },
  md: { button: 'w-12 h-12', icon: 'w-5 h-5' },
  lg: { button: 'w-14 h-14', icon: 'w-6 h-6' },
} as const;

/**
 * Position configuration for button placement
 */
const positionConfig = {
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
} as const;

/**
 * Theme Toggle Button Component
 */
export const ThemeButton: React.FC<ThemeButtonProps> = memo(({
  className,
  size = 'lg',
  position = 'top-right',
}) => {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          'fixed z-50 rounded-full',
          sizeConfig[size].button,
          positionConfig[position],
          'bg-zinc-100 dark:bg-zinc-800 animate-pulse'
        )}
        aria-hidden="true"
      />
    );
  }

  /**
   * Handle theme toggle with keyboard support
   */
  const handleToggle = () => {
    toggleTheme();
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styles
        'fixed z-50 rounded-full shadow-lg hover:shadow-xl',
        'bg-zinc-100 dark:bg-zinc-800',
        'border border-zinc-200 dark:border-zinc-700',
        'transition-all duration-300',
        'flex items-center justify-center group',
        // Focus styles
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'dark:focus:ring-offset-zinc-800',
        // Size and position
        sizeConfig[size].button,
        positionConfig[position],
        className
      )}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: ANIMATION_CONFIG.delays.long,
        duration: ANIMATION_CONFIG.durations.normal
      }}
      aria-label={A11Y_CONFIG.ariaLabels.themeToggle}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
    >
      <div className={cn('relative', sizeConfig[size].icon)}>
        {/* Sun Icon */}
        <motion.div
          className="absolute inset-0 text-yellow-500 dark:text-yellow-400"
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 180 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{
            duration: ANIMATION_CONFIG.durations.fast,
            ease: ANIMATION_CONFIG.easing.easeInOut
          }}
          aria-hidden={isDark}
        >
          <Sun
            className={cn(sizeConfig[size].icon, 'drop-shadow-sm')}
            strokeWidth={2}
          />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          className="absolute inset-0 text-blue-400 dark:text-blue-300"
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : -180,
            opacity: isDark ? 1 : 0,
          }}
          transition={{
            duration: ANIMATION_CONFIG.durations.fast,
            ease: ANIMATION_CONFIG.easing.easeInOut
          }}
          aria-hidden={!isDark}
        >
          <Moon
            className={cn(sizeConfig[size].icon, 'drop-shadow-sm')}
            strokeWidth={2}
          />
        </motion.div>
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-full bg-zinc-300 dark:bg-zinc-600"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.button>
  );
});

ThemeButton.displayName = 'ThemeButton';
