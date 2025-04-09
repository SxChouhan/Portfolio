import { motion } from 'framer-motion';
import { 
  Code2, Laptop, Presentation, Box, Layers, RotateCw, 
  Cpu, Globe, PenTool, Zap, Database, Cloud, 
  Monitor, Smartphone, Server, FileCode, Command, Terminal 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function GlobalBackground() {
  const [, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<number | null>(null);
  const previousScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  
  // Create an array of all the icons we want to use
  const icons = [
    Code2, Laptop, Presentation, Box, Layers, RotateCw,
    Cpu, Globe, PenTool, Zap, Database, Cloud,
    Monitor, Smartphone, Server, FileCode, Command, Terminal
  ];
  
  // Generate completely random positions for each icon instance
  const iconInstances = useRef(Array.from({ length: 15 }, () => {
    return {
      Icon: icons[Math.floor(Math.random() * icons.length)],
      top: Math.random() * 95, // Random position from 0-95%
      left: Math.random() * 95, // Random position from 0-95%
      size: Math.random() * 8 + 18, // Random size between 18-26
      moveAmount: Math.random() * 30 + 15, // How much to move when scrolling (15-45px)
      moveSpeed: Math.random() * 0.2 + 0.2, // Random transition speed (0.2-0.4s)
    };
  }));

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > previousScrollY.current) {
        scrollDirection.current = 'down';
      } else if (currentScrollY < previousScrollY.current) {
        scrollDirection.current = 'up';
      }
      
      previousScrollY.current = currentScrollY;
      setIsScrolling(true);
      
      // Reset scrolling state after a delay
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = window.setTimeout(() => {
        setIsScrolling(false);
        scrollDirection.current = null;
      }, 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800" />
      
      {/* Icons that move on scroll */}
      <div className="absolute inset-0">
        {iconInstances.current.map((instance, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: `${instance.top}%`,
              left: `${instance.left}%`,
              transition: `transform ${instance.moveSpeed}s ease-out`,
              transform: isScrolling 
                ? `translateY(${scrollDirection.current === 'down' ? instance.moveAmount : scrollDirection.current === 'up' ? -instance.moveAmount : 0}px)` 
                : 'translateY(0)',
              opacity: 0.2,
            }}
          >
            <instance.Icon
              size={instance.size}
              className="text-zinc-600 dark:text-zinc-400"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 