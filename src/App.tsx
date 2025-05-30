/**
 * Main Application Component
 *
 * The root component of the portfolio application that orchestrates
 * the overall layout, theme management, and component rendering.
 *
 * Features:
 * - Intro animation sequence with scroll management
 * - Theme switching with persistence
 * - Responsive layout with accessibility support
 * - Performance optimized component loading
 * - Error boundary integration
 */

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { cn } from './lib/utils';
import { ANIMATION_CONFIG, A11Y_CONFIG } from './constants';
import type { LoadingState } from './types';

// Eager load critical components
import { Hero } from './components/Hero';
import { IntroLoader } from './components/IntroLoader';
import { ThemeButton } from './components/ThemeButton';
import { LocationIndicator } from './components/LocationIndicator';
import { GalaxyBackground } from './components/GalaxyBackground';

// Lazy load non-critical components for better performance
const Skills = lazy(() => import('./components/Skills').then(module => ({ default: module.Skills })));
const Projects = lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })));
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
const ModelViewer3D = lazy(() => import('./components/ModelViewer3D').then(module => ({ default: module.ModelViewer3D })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

/**
 * Loading fallback component for lazy-loaded sections
 */
const SectionLoader: React.FC<{ height?: string }> = ({ height = 'h-96' }) => (
  <div className={cn('flex items-center justify-center', height)} role="status" aria-label="Loading content">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100" />
    <span className="sr-only">Loading...</span>
  </div>
);

/**
 * Error fallback component for error boundaries
 */
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => (
  <div className="min-h-screen flex items-center justify-center p-4" role="alert">
    <div className="text-center max-w-md">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        Something went wrong
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        {error.message || 'An unexpected error occurred. Please try refreshing the page.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className={cn(
          'px-6 py-3 rounded-lg font-medium',
          'bg-zinc-900 text-zinc-100 hover:bg-zinc-800',
          'dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        )}
      >
        Try again
      </button>
    </div>
  </div>
);

/**
 * Application state interface
 */
interface AppState {
  introComplete: boolean;
  loadingState: LoadingState;
  hasError: boolean;
}

/**
 * Main Application Component
 */
function App(): JSX.Element {
  // Application state
  const [state, setState] = useState<AppState>({
    introComplete: false,
    loadingState: 'idle',
    hasError: false,
  });

  /**
   * Handles intro animation completion
   * Enables scrolling and updates application state
   */
  const handleIntroComplete = useCallback(() => {
    setState(prev => ({ ...prev, introComplete: true, loadingState: 'success' }));

    // Enable scrolling with smooth transition
    requestAnimationFrame(() => {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    });

    // Announce completion to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = A11Y_CONFIG.srOnly;
    announcement.textContent = 'Portfolio content loaded successfully';
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  /**
   * Manages scroll behavior during intro sequence
   */
  useEffect(() => {
    if (!state.introComplete) {
      // Disable scrolling during intro
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scrolling after intro
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [state.introComplete]);

  /**
   * Handles global keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content (accessibility)
      if (event.key === 'Tab' && !event.shiftKey && event.target === document.body) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          event.preventDefault();
          mainContent.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Error boundary reset handler
   */
  const handleErrorReset = useCallback(() => {
    setState(prev => ({ ...prev, hasError: false, loadingState: 'idle' }));
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
      <div className="overflow-x-hidden w-full min-h-screen">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className={cn(
            'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
            'z-50 px-4 py-2 bg-zinc-900 text-zinc-100 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        >
          {A11Y_CONFIG.skipToContent}
        </a>

        {/* Galaxy Background */}
        {state.introComplete && <GalaxyBackground />}

        {/* Intro Loader */}
        <IntroLoader onComplete={handleIntroComplete} />

        {/* Theme Toggle Button */}
        <ThemeButton />

        {/* Location Indicator */}
        <LocationIndicator />

        {/* Main Content */}
        <main
          id="main-content"
          className={cn(
            'transition-opacity duration-1000 overflow-x-hidden w-full',
            state.introComplete ? 'opacity-100' : 'opacity-0'
          )}
          tabIndex={-1}
          aria-label="Main portfolio content"
        >
          <div className="bg-transparent">
            {/* Hero Section - Always visible */}
            <Hero />

            {/* Lazy-loaded sections with error boundaries */}
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
              <Suspense fallback={<SectionLoader height="h-96" />}>
                <ModelViewer3D
                  title="Interactive 3D Design"
                  description="Experience immersive web-based 3D interactivity"
                />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
              <Suspense fallback={<SectionLoader height="h-screen" />}>
                <Skills />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
              <Suspense fallback={<SectionLoader height="h-screen" />}>
                <Projects />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
              <Suspense fallback={<SectionLoader height="h-96" />}>
                <About />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
              <Suspense fallback={<SectionLoader height="h-96" />}>
                <Contact />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleErrorReset}>
              <Suspense fallback={<SectionLoader height="h-32" />}>
                <Footer />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;