import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

function Galaxy() {
  const { theme } = useTheme();
  const points = useRef<THREE.Points>(null!);
  
  // Generate galaxy particles
  const particleCount = 5000;
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 2 + 1;
      const spinAngle = radius * 5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color
      const mixedColor = new THREE.Color();
      if (theme === 'dark') {
        mixedColor.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6); // Blue-ish colors
      } else {
        mixedColor.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8); // Brighter blue colors
      }
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return { positions, colors };
  }, [theme]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1;
    points.current.rotation.y = time * 0.05;
  });

  return (
    <Points ref={points} positions={positions.positions} colors={positions.colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function GalaxyBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <Galaxy />
      </Canvas>
    </div>
  );
}