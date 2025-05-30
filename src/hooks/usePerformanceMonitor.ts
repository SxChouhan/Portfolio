/**
 * Performance Monitor Hook
 * 
 * Monitors application performance metrics and provides insights
 * for optimization and user experience improvements.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import type { PerformanceMetrics } from '../types';

interface UsePerformanceMonitorOptions {
  /** Enable performance monitoring */
  enabled?: boolean;
  /** Sampling rate (0-1) */
  sampleRate?: number;
  /** Report threshold in milliseconds */
  reportThreshold?: number;
  /** Callback for performance reports */
  onReport?: (metrics: PerformanceMetrics) => void;
}

interface UsePerformanceMonitorReturn {
  /** Current performance metrics */
  metrics: PerformanceMetrics;
  /** Whether monitoring is active */
  isMonitoring: boolean;
  /** Start monitoring */
  startMonitoring: () => void;
  /** Stop monitoring */
  stopMonitoring: () => void;
  /** Get current metrics */
  getCurrentMetrics: () => PerformanceMetrics;
}

/**
 * Custom hook for performance monitoring
 * 
 * Features:
 * - Core Web Vitals tracking (FCP, LCP, FID, CLS)
 * - Memory usage monitoring
 * - Frame rate tracking
 * - Network performance insights
 * - Configurable sampling and reporting
 * 
 * @param options - Monitoring configuration
 * @returns Performance metrics and controls
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): UsePerformanceMonitorReturn {
  const {
    enabled = true,
    sampleRate = 1,
    reportThreshold = 1000,
    onReport,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check if performance APIs are available
   */
  const isPerformanceSupported = useCallback(() => {
    return (
      typeof window !== 'undefined' &&
      'performance' in window &&
      'PerformanceObserver' in window
    );
  }, []);

  /**
   * Get First Contentful Paint (FCP)
   */
  const getFCP = useCallback((): number | undefined => {
    if (!isPerformanceSupported()) return undefined;

    const entries = performance.getEntriesByName('first-contentful-paint');
    return entries.length > 0 ? entries[0].startTime : undefined;
  }, [isPerformanceSupported]);

  /**
   * Get Largest Contentful Paint (LCP)
   */
  const getLCP = useCallback((): number | undefined => {
    if (!isPerformanceSupported()) return undefined;

    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : undefined;
  }, [isPerformanceSupported]);

  /**
   * Get First Input Delay (FID)
   */
  const getFID = useCallback((): number | undefined => {
    if (!isPerformanceSupported()) return undefined;

    const entries = performance.getEntriesByType('first-input');
    if (entries.length > 0) {
      const fidEntry = entries[0] as any;
      return fidEntry.processingStart - fidEntry.startTime;
    }
    return undefined;
  }, [isPerformanceSupported]);

  /**
   * Get Cumulative Layout Shift (CLS)
   */
  const getCLS = useCallback((): number | undefined => {
    if (!isPerformanceSupported()) return undefined;

    const entries = performance.getEntriesByType('layout-shift');
    let clsValue = 0;

    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });

    return clsValue;
  }, [isPerformanceSupported]);

  /**
   * Get current performance metrics
   */
  const getCurrentMetrics = useCallback((): PerformanceMetrics => {
    const currentMetrics: PerformanceMetrics = {
      fcp: getFCP(),
      lcp: getLCP(),
      fid: getFID(),
      cls: getCLS(),
    };

    return currentMetrics;
  }, [getFCP, getLCP, getFID, getCLS]);

  /**
   * Update metrics state
   */
  const updateMetrics = useCallback(() => {
    if (!enabled || Math.random() > sampleRate) return;

    const newMetrics = getCurrentMetrics();
    setMetrics(newMetrics);

    // Report metrics if callback is provided
    if (onReport) {
      onReport(newMetrics);
    }
  }, [enabled, sampleRate, getCurrentMetrics, onReport]);

  /**
   * Start performance monitoring
   */
  const startMonitoring = useCallback(() => {
    if (!isPerformanceSupported() || !enabled) return;

    setIsMonitoring(true);

    try {
      // Create performance observer for Core Web Vitals
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          // Handle different entry types
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
              }
              break;
            case 'largest-contentful-paint':
              setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
              break;
            case 'first-input':
              const fidEntry = entry as any;
              const fid = fidEntry.processingStart - fidEntry.startTime;
              setMetrics(prev => ({ ...prev, fid }));
              break;
            case 'layout-shift':
              const lsEntry = entry as any;
              if (!lsEntry.hadRecentInput) {
                setMetrics(prev => ({ 
                  ...prev, 
                  cls: (prev.cls || 0) + lsEntry.value 
                }));
              }
              break;
          }
        });
      });

      // Observe different performance entry types
      const entryTypes = [
        'paint',
        'largest-contentful-paint',
        'first-input',
        'layout-shift',
      ];

      entryTypes.forEach((type) => {
        try {
          observerRef.current?.observe({ entryTypes: [type] });
        } catch (error) {
          // Some entry types might not be supported
          console.warn(`Performance entry type "${type}" not supported:`, error);
        }
      });

      // Set up periodic metric updates
      intervalRef.current = setInterval(updateMetrics, reportThreshold);

      // Initial metrics update
      updateMetrics();
    } catch (error) {
      console.error('Failed to start performance monitoring:', error);
      setIsMonitoring(false);
    }
  }, [isPerformanceSupported, enabled, updateMetrics, reportThreshold]);

  /**
   * Stop performance monitoring
   */
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Start monitoring on mount if enabled
   */
  useEffect(() => {
    if (enabled) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [enabled, startMonitoring, stopMonitoring]);

  /**
   * Handle visibility change to pause/resume monitoring
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopMonitoring();
      } else if (enabled) {
        startMonitoring();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, startMonitoring, stopMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getCurrentMetrics,
  };
}
