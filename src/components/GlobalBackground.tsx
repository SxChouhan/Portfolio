import {
  Code2, Laptop, Presentation, Box, Layers, RotateCw,
  Cpu, Globe, PenTool, Zap, Database, Cloud,
  Monitor, Smartphone, Server, FileCode, Command, Terminal
} from 'lucide-react';
import { useRef } from 'react';

export function GlobalBackground() {
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
    };
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800" />

      {/* Static background icons */}
      <div className="absolute inset-0">
        {iconInstances.current.map((instance, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${instance.top}%`,
              left: `${instance.left}%`,
              opacity: 0.2,
            }}
          >
            <instance.Icon
              size={instance.size}
              className="text-zinc-600 dark:text-zinc-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}