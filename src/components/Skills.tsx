import { motion } from 'framer-motion';
import { Code, Database, FileVideo, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export function Skills() {
  const skillCategories = [
    {
      icon: Code,
      title: 'Programming',
      skills: [
        { name: 'Python', level: 90 },
        { name: 'HTML/CSS', level: 85 },
        { name: 'JavaScript', level: 80 },
        { name: 'React', level: 75 },
      ],
    },
    {
      icon: Database,
      title: 'Technical',
      skills: [
        { name: 'Microsoft 365', level: 95 },
        { name: 'SQL', level: 80 },
        { name: 'Web Development', level: 85 },
        { name: 'Git', level: 75 },
      ],
    },
    {
      icon: FileVideo,
      title: 'Creative',
      skills: [
        { name: 'Video Editing', level: 85 },
        { name: 'Photo Editing', level: 80 },
        { name: 'Content Creation', level: 75 },
        { name: 'UI/UX Design', level: 70 },
      ],
    },
    {
      icon: Users,
      title: 'Soft Skills',
      skills: [
        { name: 'Event Management', level: 90 },
        { name: 'Communication', level: 85 },
        { name: 'Team Leadership', level: 80 },
        { name: 'Problem Solving', level: 85 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-white dark:bg-zinc-900">
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
          Skills & Expertise
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg"
            >
              <div className="flex items-center mb-6">
                <category.icon className="w-6 h-6 mr-3 text-zinc-700 dark:text-zinc-300" />
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {category.title}
                </h3>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {skill.name}
                      </span>
                      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                        className="bg-zinc-700 dark:bg-zinc-300 h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}