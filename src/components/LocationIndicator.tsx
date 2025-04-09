import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function LocationIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50 flex items-center space-x-2 px-3 py-2 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 backdrop-blur-sm shadow-md"
    >
      <MapPin size={14} />
      <span className="text-xs font-medium tracking-wide">Located in India</span>
    </motion.div>
  );
}
