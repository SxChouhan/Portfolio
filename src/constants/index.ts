/**
 * Application Constants
 * 
 * Centralized configuration for the portfolio application.
 * This file contains all static data, URLs, and configuration values
 * to maintain consistency and ease of maintenance.
 */

// ===== PERSONAL INFORMATION =====
export const PERSONAL_INFO = {
  name: 'Siddharth Chouhan',
  title: 'Full Stack Developer & 3D Designer',
  location: 'India',
  email: 'contact@siddharthchouhan.com',
  website: 'https://siddharthchouhan.com',
  description: 'Passionate developer creating innovative digital experiences with modern web technologies and 3D design.',
} as const;

// ===== SOCIAL LINKS =====
export const SOCIAL_LINKS = {
  github: 'https://github.com/siddharthchouhan',
  linkedin: 'https://linkedin.com/in/siddharthchouhan',
  twitter: 'https://twitter.com/siddharthchouhan',
  email: `mailto:${PERSONAL_INFO.email}`,
} as const;

// ===== NAVIGATION =====
export const NAVIGATION_ITEMS = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

// ===== ANIMATION SETTINGS =====
export const ANIMATION_CONFIG = {
  // Default animation durations (in seconds)
  durations: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    verySlow: 1.2,
  },
  // Default animation delays
  delays: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.5,
  },
  // Easing functions
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  // Viewport settings for scroll animations
  viewport: {
    once: true,
    margin: '-100px',
  },
} as const;

// ===== THEME CONFIGURATION =====
export const THEME_CONFIG = {
  defaultTheme: 'light' as 'light' | 'dark',
  storageKey: 'theme',
  transitionDuration: 200, // milliseconds
} as const;

// ===== RESPONSIVE BREAKPOINTS =====
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ===== PERFORMANCE SETTINGS =====
export const PERFORMANCE_CONFIG = {
  // Intersection Observer settings
  intersectionThreshold: 0.1,
  intersectionRootMargin: '50px',
  
  // Image loading settings
  imageLoadingStrategy: 'lazy' as const,
  
  // Animation performance
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
} as const;

// ===== ACCESSIBILITY SETTINGS =====
export const A11Y_CONFIG = {
  // Focus management
  focusRingColor: 'ring-blue-500',
  focusRingWidth: 'ring-2',
  
  // Screen reader text
  srOnly: 'sr-only',
  
  // Skip links
  skipToContent: 'Skip to main content',
  
  // ARIA labels
  ariaLabels: {
    navigation: 'Main navigation',
    socialLinks: 'Social media links',
    themeToggle: 'Toggle dark mode',
    closeModal: 'Close modal',
    openProject: 'View project details',
    skillLevel: 'Skill proficiency level',
  },
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: (min: number) => `Minimum ${min} characters required`,
    maxLength: (max: number) => `Maximum ${max} characters allowed`,
  },
  form: {
    submitError: 'Failed to send message. Please try again.',
    submitSuccess: 'Message sent successfully!',
  },
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  form: {
    submitted: 'Thank you for your message! I\'ll get back to you soon.',
    copied: 'Copied to clipboard!',
  },
  theme: {
    switched: 'Theme updated successfully',
  },
} as const;

// ===== LOADING STATES =====
export const LOADING_STATES = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

// ===== COMPONENT VARIANTS =====
export const COMPONENT_VARIANTS = {
  button: {
    primary: 'primary',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
  },
  card: {
    default: 'default',
    elevated: 'elevated',
    bordered: 'bordered',
  },
  text: {
    heading: 'heading',
    subheading: 'subheading',
    body: 'body',
    caption: 'caption',
  },
} as const;

// ===== TYPE EXPORTS =====
export type Theme = typeof THEME_CONFIG.defaultTheme;
export type LoadingState = keyof typeof LOADING_STATES;
export type ButtonVariant = keyof typeof COMPONENT_VARIANTS.button;
export type CardVariant = keyof typeof COMPONENT_VARIANTS.card;
export type TextVariant = keyof typeof COMPONENT_VARIANTS.text;

// ===== VALIDATION RULES =====
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  
  lengths: {
    name: { min: 2, max: 50 },
    email: { min: 5, max: 100 },
    message: { min: 10, max: 1000 },
    subject: { min: 5, max: 100 },
  },
} as const;

// ===== FEATURE FLAGS =====
export const FEATURE_FLAGS = {
  enableAnalytics: false,
  enableContactForm: true,
  enableProjectModal: true,
  enable3DInteractions: true,
  enableAnimations: true,
  enableDarkMode: true,
  enableKeyboardNavigation: true,
} as const;
