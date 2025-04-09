import { motion } from 'framer-motion';
import { Code2, FileVideo, Globe2, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export function About() {
  const stats = [
    { icon: Code2, label: 'Projects Completed', value: '15+' },
    { icon: Users, label: 'Events Managed', value: '5+' },
    { icon: Globe2, label: 'Programming Languages', value: '4+' },
    { icon: FileVideo, label: 'Video Edits', value: '20+' },
  ];

  return (
    <section id="about" className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={cn(
            "text-3xl md:text-4xl font-bold text-center mb-16",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-zinc-900 to-zinc-600",
            "dark:from-zinc-100 dark:to-zinc-400"
          )}
        >
          About Me
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">
            I'm a passionate B.Tech 2nd-year student at Barkatullah University, Bhopal, with a deep love for programming and technology. 
            My journey in tech has been driven by curiosity and a desire to create meaningful solutions.
          </p>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Beyond coding, I've gained valuable experience in event management, notably contributing to the success of GIS 2025. 
            This diverse background allows me to bring both technical expertise and strong organizational skills to every project.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {stat.value}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}