import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface ModelViewerProps {
  title: string;
  description?: string;
}

export function ModelViewer3D({ title, description }: ModelViewerProps) {
  const [rotation, setRotation] = useState({ x: 15, y: 45 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [mouseDown, setMouseDown] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [autoRotate]);
  
  // Mouse event handlers for manual rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setAutoRotate(false);
    setMouseDown(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseUp = () => {
    setMouseDown(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return;
    
    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };
  
  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setAutoRotate(false);
    setMouseDown(true);
    if (e.touches.length > 0) {
      lastMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  
  const handleTouchEnd = () => {
    setMouseDown(false);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!mouseDown || e.touches.length === 0) return;
    
    const deltaX = e.touches[0].clientX - lastMousePosition.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosition.current.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    lastMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-6 sm:px-8 md:px-12 w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative w-full max-w-4xl mx-auto"
        >
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-zinc-900 to-zinc-600",
            "dark:from-zinc-100 dark:to-zinc-400"
          )}>
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-md aspect-square mx-auto flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          {/* 3D Cube */}
          <div 
            className="w-full h-full relative flex items-center justify-center"
            style={{ 
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: "preserve-3d",
                transition: autoRotate ? "transform 0.05s linear" : "none"
              }}
            >
              {/* Front face */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 bg-blue-500/80 dark:bg-blue-600/80 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  transform: "translateZ(90px)",
                  backfaceVisibility: "hidden",
                  left: "calc(50% - 20rem / 2)",
                  top: "calc(50% - 20rem / 2)"
                }}
              >
                Front
              </div>
              
              {/* Back face */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 bg-red-500/80 dark:bg-red-600/80 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  transform: "rotateY(180deg) translateZ(90px)",
                  backfaceVisibility: "hidden",
                  left: "calc(50% - 20rem / 2)",
                  top: "calc(50% - 20rem / 2)"
                }}
              >
                Back
              </div>
              
              {/* Left face */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 bg-green-500/80 dark:bg-green-600/80 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  transform: "rotateY(-90deg) translateZ(90px)",
                  backfaceVisibility: "hidden",
                  left: "calc(50% - 20rem / 2)",
                  top: "calc(50% - 20rem / 2)"
                }}
              >
                Left
              </div>
              
              {/* Right face */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 bg-yellow-500/80 dark:bg-yellow-600/80 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  transform: "rotateY(90deg) translateZ(90px)",
                  backfaceVisibility: "hidden",
                  left: "calc(50% - 20rem / 2)",
                  top: "calc(50% - 20rem / 2)"
                }}
              >
                Right
              </div>
              
              {/* Top face */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 bg-purple-500/80 dark:bg-purple-600/80 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  transform: "rotateX(90deg) translateZ(90px)",
                  backfaceVisibility: "hidden",
                  left: "calc(50% - 20rem / 2)",
                  top: "calc(50% - 20rem / 2)"
                }}
              >
                Top
              </div>
              
              {/* Bottom face */}
              <div
                className="absolute w-40 h-40 md:w-56 md:h-56 bg-pink-500/80 dark:bg-pink-600/80 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  transform: "rotateX(-90deg) translateZ(90px)",
                  backfaceVisibility: "hidden",
                  left: "calc(50% - 20rem / 2)",
                  top: "calc(50% - 20rem / 2)"
                }}
              >
                Bottom
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center text-zinc-500 dark:text-zinc-400 text-sm z-10"
        >
          <p>Click and drag to rotate the cube</p>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="mt-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 rounded-full text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            {autoRotate ? "Stop Rotation" : "Auto Rotate"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
