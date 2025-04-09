import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/animations/loading.json';
import { cn } from '../lib/utils';


interface IntroLoaderProps {
  onComplete?: () => void;
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [isNameTransitioning, setIsNameTransitioning] = useState(false);
  const [namePosition, setNamePosition] = useState({ x: 0, y: 0, scale: 1 });
  const nameRef = useRef<HTMLHeadingElement>(null);
  const lottieRef = useRef<any>(null);
  
  // Handle animation speed
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.6);
    }
  }, []);

  // Calculate position for name transition
  useEffect(() => {
    // Start transition after initial display
    const transitionTimer = setTimeout(() => {
      // Get the hero name element
      const heroNameElement = document.querySelector('.hero-name');
      
      if (heroNameElement && nameRef.current) {
        // Ensure elements are visible for accurate measurements
        nameRef.current.style.opacity = '1';
        
        // Get positions and dimensions
        const introRect = nameRef.current.getBoundingClientRect();
        const heroRect = heroNameElement.getBoundingClientRect();
        
        // Calculate the transformation needed
        const scaleX = heroRect.width / introRect.width;
        const scaleY = heroRect.height / introRect.height;
        
        // Adjust scale based on screen size
        let scale;
        if (window.innerWidth < 640) { // sm breakpoint
          scale = Math.min(scaleX, scaleY); // Exact match on mobile
        } else {
          scale = Math.min(scaleX, scaleY); // Exact match on larger screens
        }
        
        // Calculate the center points
        const introCenterX = introRect.left + introRect.width / 2;
        const introCenterY = introRect.top + introRect.height / 2;
        const heroCenterX = heroRect.left + heroRect.width / 2;
        const heroCenterY = heroRect.top + heroRect.height / 2;
        
        // Calculate the translation
        const translateX = heroCenterX - introCenterX;
        const translateY = heroCenterY - introCenterY;
        
        // Set the position for animation
        setNamePosition({
          x: translateX,
          y: translateY,
          scale: scale
        });
        
        // Start the transition
        setIsNameTransitioning(true);
        
        // Make hero name initially invisible
        if (heroNameElement instanceof HTMLElement) {
          heroNameElement.style.opacity = '0';
          
          // Make hero name visible after transition completes
          setTimeout(() => {
            if (heroNameElement instanceof HTMLElement) {
              heroNameElement.style.opacity = '1';
            }
          }, 1200); // Increased from 1000 to 1200ms
        }
      }
    }, 3500);
    
    // Complete intro after name transitions (5 seconds total)
    const completeTimer = setTimeout(() => {
      setShowIntro(false);
      if (onComplete) onComplete();
    }, 5000); // Increased from 4500 to 5000ms
    
    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  // Easing functions similar to Dennis Snellenberg's site
  const easing = [0.83, 0, 0.17, 1];
  
  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 1.2, 
              ease: easing,
              delay: 0.3
            }
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent text-white overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0"
            initial={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{
              clipPath: [
                'inset(0 0 0 0)',
                'url(#wave-85)',
                'url(#wave-65)',
                'url(#wave-45)',
                'url(#wave-25)',
                'url(#wave-5)',
                'inset(0 0 100% 0)'
              ],
              transition: {
                duration: 1.5,
                ease: [0.76, 0, 0.24, 1],
                times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1]
              }
            }}
          >
            <svg width="0" height="0">
              <defs>
                <clipPath id="wave-85" clipPathUnits="objectBoundingBox">
                  <path d="M0,0 H1 V0.85 Q0.9,0.92 0.8,0.83 Q0.7,0.78 0.6,0.87 Q0.5,0.92 0.4,0.83 Q0.3,0.78 0.2,0.87 Q0.1,0.92 0,0.85 V0" />
                </clipPath>
                <clipPath id="wave-65" clipPathUnits="objectBoundingBox">
                  <path d="M0,0 H1 V0.65 Q0.9,0.72 0.8,0.63 Q0.7,0.58 0.6,0.67 Q0.5,0.72 0.4,0.63 Q0.3,0.58 0.2,0.67 Q0.1,0.72 0,0.65 V0" />
                </clipPath>
                <clipPath id="wave-45" clipPathUnits="objectBoundingBox">
                  <path d="M0,0 H1 V0.45 Q0.9,0.52 0.8,0.43 Q0.7,0.38 0.6,0.47 Q0.5,0.52 0.4,0.43 Q0.3,0.38 0.2,0.47 Q0.1,0.52 0,0.45 V0" />
                </clipPath>
                <clipPath id="wave-25" clipPathUnits="objectBoundingBox">
                  <path d="M0,0 H1 V0.25 Q0.9,0.32 0.8,0.23 Q0.7,0.18 0.6,0.27 Q0.5,0.32 0.4,0.23 Q0.3,0.18 0.2,0.27 Q0.1,0.32 0,0.25 V0" />
                </clipPath>
                <clipPath id="wave-5" clipPathUnits="objectBoundingBox">
                  <path d="M0,0 H1 V0.05 Q0.9,0.12 0.8,0.03 Q0.7,-0.02 0.6,0.07 Q0.5,0.12 0.4,0.03 Q0.3,-0.02 0.2,0.07 Q0.1,0.12 0,0.05 V0" />
                </clipPath>
              </defs>
            </svg>
            <div className="w-full h-full bg-[#111111]" />
          </motion.div>

          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-3 px-4 text-center">
              <motion.div
                key="name-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0 
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: easing,
                  delay: 0.2
                }}
                className="relative w-full max-w-4xl mx-auto"
              >
                <motion.h1 
                  ref={nameRef}
                  animate={{
                    x: isNameTransitioning ? namePosition.x : 0,
                    y: isNameTransitioning ? namePosition.y : 0,
                    scale: isNameTransitioning ? namePosition.scale : 1,
                    color: isNameTransitioning ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)',
                  }}
                  transition={{
                    duration: 1.2,
                    ease: easing,
                  }}
                  className={cn(
                    "font-bold text-5xl sm:text-6xl md:text-7xl text-center w-full",
                    "bg-clip-text text-transparent",
                    "bg-gradient-to-r from-zinc-900 via-blue-800 to-zinc-600",
                    "dark:from-zinc-100 dark:via-blue-300 dark:to-zinc-400",
                    "px-2 sm:px-0"
                  )}
                  style={{ 
                    textShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  SIDDHARTH CHOUHAN
                </motion.h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isNameTransitioning ? 0 : 1
                }}
                transition={{ 
                  duration: isNameTransitioning ? 0.8 : 0.5, 
                  ease: "easeOut",
                  delay: isNameTransitioning ? 0 : 0.5
                }}
                className="text-zinc-700 dark:text-zinc-300 text-base sm:text-lg font-medium tracking-widest mt-2 z-10"
              >
                3D DESIGNER & DEVELOPER
              </motion.p>
            </div>
            
            {/* Large Centered Hand Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isNameTransitioning ? 0 : 1 
              }}
              transition={{ 
                duration: 0.3, 
                ease: easing,
                delay: 1
              }}
              className="w-[280px] h-[280px] my-6 mx-auto flex items-center justify-center"
            >
              <Lottie 
                animationData={loadingAnimation} 
                loop={true}
                autoplay={true}
                lottieRef={lottieRef}
                style={{ transform: 'scale(1.3)' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
