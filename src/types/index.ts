/**
 * Type Definitions
 * 
 * Centralized type definitions for the portfolio application.
 * This file contains all TypeScript interfaces, types, and enums
 * used throughout the application for type safety and consistency.
 */

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// ===== COMMON TYPES =====

/**
 * Generic API response structure
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Device breakpoints
 */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ===== COMPONENT PROPS =====

/**
 * Base props for all components
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

/**
 * Props for components with loading states
 */
export interface LoadableComponentProps extends BaseComponentProps {
  loading?: boolean;
  error?: string | null;
}

/**
 * Props for animated components
 */
export interface AnimatedComponentProps extends BaseComponentProps {
  delay?: number;
  duration?: number;
  disabled?: boolean;
}

// ===== SKILL TYPES =====

/**
 * Individual skill definition
 */
export interface Skill {
  /** Skill name */
  name: string;
  /** Proficiency level (0-100) */
  level: number;
  /** Optional category for grouping */
  category?: string;
  /** Optional icon component */
  icon?: LucideIcon;
  /** Optional color theme */
  color?: string;
  /** Optional animation type */
  animation?: string;
  /** Years of experience */
  experience?: number;
  /** Skill description */
  description?: string;
}

/**
 * Skill category grouping
 */
export interface SkillCategory {
  /** Category icon */
  icon: LucideIcon;
  /** Category display title */
  title: string;
  /** Skills in this category */
  skills: Skill[];
  /** Category color theme */
  color: string;
  /** Category animation type */
  animation: string;
  /** Category description */
  description?: string;
}

// ===== PROJECT TYPES =====

/**
 * Project link definition
 */
export interface ProjectLink {
  /** GitHub repository URL */
  github?: string;
  /** Live demo URL */
  live?: string;
  /** Documentation URL */
  docs?: string;
  /** Design files URL */
  design?: string;
}

/**
 * Project definition
 */
export interface Project {
  /** Project title */
  title: string;
  /** Short description */
  description: string;
  /** Detailed description for modal */
  longDescription?: string;
  /** Project image URL */
  image: string;
  /** Additional project images */
  gallery?: string[];
  /** Technologies used */
  technologies: string[];
  /** Project type/category */
  type: 'Web' | '3D' | 'Mobile' | 'Desktop';
  /** Project links */
  links: ProjectLink;
  /** Key features list */
  features?: string[];
  /** Project status */
  status?: 'completed' | 'in-progress' | 'planned';
  /** Project start date */
  startDate?: string;
  /** Project end date */
  endDate?: string;
  /** Team size */
  teamSize?: number;
  /** Project role */
  role?: string;
  /** Project challenges */
  challenges?: string[];
  /** Project learnings */
  learnings?: string[];
}

// ===== CONTACT TYPES =====

/**
 * Contact form data
 */
export interface ContactFormData {
  /** Sender's name */
  name: string;
  /** Sender's email */
  email: string;
  /** Message subject */
  subject: string;
  /** Message content */
  message: string;
}

/**
 * Contact form validation errors
 */
export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Social media link
 */
export interface SocialLink {
  /** Link icon */
  icon: LucideIcon;
  /** Link URL */
  href: string;
  /** Link label for accessibility */
  label: string;
  /** Link color theme */
  color?: string;
  /** External link indicator */
  external?: boolean;
}

// ===== NAVIGATION TYPES =====

/**
 * Navigation item
 */
export interface NavigationItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Link href */
  href: string;
  /** Optional icon */
  icon?: LucideIcon;
  /** External link indicator */
  external?: boolean;
}

// ===== ANIMATION TYPES =====

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation easing function */
  ease?: number[] | string;
  /** Animation repeat count */
  repeat?: number;
  /** Animation direction */
  direction?: 'normal' | 'reverse' | 'alternate';
}

/**
 * Scroll animation trigger
 */
export interface ScrollTrigger {
  /** Trigger element selector */
  trigger: string;
  /** Start position */
  start?: string;
  /** End position */
  end?: string;
  /** Scrub animation to scroll */
  scrub?: boolean;
  /** Pin element during animation */
  pin?: boolean;
}

// ===== 3D TYPES =====

/**
 * 3D rotation state
 */
export interface Rotation3D {
  /** X-axis rotation in degrees */
  x: number;
  /** Y-axis rotation in degrees */
  y: number;
  /** Z-axis rotation in degrees */
  z?: number;
}

/**
 * 3D position state
 */
export interface Position3D {
  /** X-axis position */
  x: number;
  /** Y-axis position */
  y: number;
  /** Z-axis position */
  z?: number;
}

/**
 * Mouse/Touch interaction state
 */
export interface InteractionState {
  /** Is currently interacting */
  isActive: boolean;
  /** Last interaction position */
  lastPosition: { x: number; y: number };
  /** Interaction velocity */
  velocity?: { x: number; y: number };
}

// ===== UTILITY TYPES =====

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract component props type
 */
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

/**
 * Omit multiple keys from type
 */
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

/**
 * Pick multiple keys from type
 */
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;

// ===== EVENT TYPES =====

/**
 * Custom event data
 */
export interface CustomEventData {
  /** Event type */
  type: string;
  /** Event payload */
  payload?: unknown;
  /** Event timestamp */
  timestamp: number;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  /** Event name */
  name: string;
  /** Event category */
  category: string;
  /** Event properties */
  properties?: Record<string, unknown>;
}

// ===== ERROR TYPES =====

/**
 * Application error
 */
export interface AppError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Error details */
  details?: unknown;
  /** Error stack trace */
  stack?: string;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field name */
  field: string;
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
}

// ===== PERFORMANCE TYPES =====

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** First Contentful Paint */
  fcp?: number;
  /** Largest Contentful Paint */
  lcp?: number;
  /** First Input Delay */
  fid?: number;
  /** Cumulative Layout Shift */
  cls?: number;
}

// ===== ACCESSIBILITY TYPES =====

/**
 * ARIA attributes
 */
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  role?: string;
}
