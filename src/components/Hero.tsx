import { motion } from 'framer-motion';
import { Code2, Laptop, Presentation } from 'lucide-react';
import { cn } from '../lib/utils';

export function Hero() {
  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800" />
      
      {/* Floating icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        {[Code2, Laptop, Presentation].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          >
            <Icon
              size={24}
              className="text-zinc-600 dark:text-zinc-400"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "text-4xl md:text-6xl lg:text-7xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-zinc-900 to-zinc-600",
            "dark:from-zinc-100 dark:to-zinc-400"
          )}
        >
          Siddharth Chouhan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-xl md:text-2xl text-zinc-600 dark:text-zinc-400"
        >
          Turning Ideas into Reality
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-2 text-lg md:text-xl text-zinc-500 dark:text-zinc-500"
        >
          Full-Stack Dev & Content Creator
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8"
        >
          <a
            href="#about"
            onClick={handleExploreClick}
            className={cn(
              "inline-block px-8 py-3 rounded-full",
              "bg-zinc-900 text-zinc-100",
              "dark:bg-zinc-100 dark:text-zinc-900",
              "hover:scale-105 transition-transform duration-200",
              "font-medium text-lg"
            )}
          >
            Explore My Work
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-zinc-600 dark:border-zinc-400 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-zinc-600 dark:bg-zinc-400 mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}