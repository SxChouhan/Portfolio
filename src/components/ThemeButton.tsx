import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './ThemeButton.css';

export function ThemeButton() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    
    // Check if theme is already set in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Always default to light mode if no theme is saved
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      // Default to light mode
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      // Ensure theme is saved as light in localStorage
      if (!savedTheme) {
        localStorage.setItem('theme', 'light');
      }
    }
  }, []);
  
  // Theme toggle function
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      className="fixed top-6 right-6 z-50"
    >
      <button
        className="theme-toggle flex items-center justify-center"
        type="button"
        title="Toggle theme"
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="1em"
          height="1em"
          fill="currentColor"
          className="theme-toggle__inner-moon"
          viewBox="0 0 32 32"
        >
          <path d="M27.5 11.5v-7h-7L16 0l-4.5 4.5h-7v7L0 16l4.5 4.5v7h7L16 32l4.5-4.5h7v-7L32 16l-4.5-4.5zM16 25.4a9.39 9.39 0 1 1 0-18.8 9.39 9.39 0 1 1 0 18.8z" />
          <circle cx="16" cy="16" r="8.1" />
        </svg>
      </button>
    </motion.div>
  );
}
