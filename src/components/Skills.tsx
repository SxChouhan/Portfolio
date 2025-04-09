import { motion } from 'framer-motion';
import { Code, Database, FileVideo, Users, LucideIcon, Zap, Brush, Brain, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface Skill {
  name: string;
  level: number;
  category?: string;
  icon?: LucideIcon;
  color?: string;
  animation?: string;
}

interface SkillCategory {
  icon: LucideIcon;
  title: string;
  skills: Skill[];
  color: string;
  animation: string;
}

interface CategoryButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  color?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  children, 
  active, 
  onClick, 
  icon: Icon, 
  color = 'from-blue-500 to-purple-500' 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
        "flex items-center gap-2",
        active
          ? `bg-gradient-to-r ${color} text-white shadow-md`
          : `bg-zinc-200 text-zinc-800 hover:bg-gradient-to-r ${color} text-white shadow-md dark:bg-zinc-700/50 dark:text-zinc-200 dark:hover:bg-zinc-600/70 backdrop-blur-sm`
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSticky, setIsSticky] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        const sectionTop = skillsSection.getBoundingClientRect().top;
        setIsSticky(sectionTop <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const skillCategories: SkillCategory[] = [
    {
      icon: Code,
      title: 'Programming',
      color: 'from-blue-500 to-cyan-400',
      animation: 'animate-pulse',
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
      color: 'from-emerald-500 to-green-400',
      animation: 'animate-bounce',
      skills: [
        { name: 'Data Analysis', level: 85 },
        { name: 'Web Development', level: 80 },
        { name: 'UI/UX Design', level: 75 },
        { name: 'Database Management', level: 70 },
      ],
    },
    {
      icon: FileVideo,
      title: 'Creative',
      color: 'from-purple-500 to-pink-400',
      animation: 'animate-spin-slow',
      skills: [
        { name: 'Video Editing', level: 85 },
        { name: 'Graphic Design', level: 75 },
        { name: 'Content Creation', level: 80 },
        { name: '3D Modeling', level: 70 },
      ],
    },
    {
      icon: Users,
      title: 'Soft Skills',
      color: 'from-amber-500 to-yellow-400',
      animation: 'animate-float',
      skills: [
        { name: 'Communication', level: 90 },
        { name: 'Team Leadership', level: 85 },
        { name: 'Problem Solving', level: 85 },
        { name: 'Project Management', level: 80 },
      ],
    },
  ];

  // Get all skills for "All" category
  const allSkills = skillCategories.flatMap(category => 
    category.skills.map(skill => ({
      ...skill,
      category: category.title,
      icon: category.icon,
      color: category.color,
      animation: category.animation
    }))
  );

  // Filter skills based on active category
  const filteredSkills = activeCategory === 'All' 
    ? allSkills 
    : allSkills.filter(skill => skill.category === activeCategory);

  // Get skill icon based on name
  const getSkillIcon = (skillName: string) => {
    const iconMap: Record<string, LucideIcon> = {
      'Python': Code,
      'JavaScript': Zap,
      'React': Lightbulb,
      'HTML/CSS': Code,
      'Data Analysis': Database,
      'Web Development': Code,
      'UI/UX Design': Brush,
      'Database Management': Database,
      'Video Editing': FileVideo,
      'Graphic Design': Brush,
      'Content Creation': FileVideo,
      '3D Modeling': Brush,
      'Communication': Users,
      'Team Leadership': Users,
      'Problem Solving': Brain,
      'Project Management': Users,
    };
    
    return iconMap[skillName] || Code;
  };

  return (
    <section id="skills" className="relative min-h-screen overflow-hidden">
      {/* Sticky Header */}
      <div 
        className={cn(
          "sticky top-0 z-30 w-full transition-all duration-300",
          "py-4"
        )}
      >
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full mx-auto text-center"
          >
            <h2 className={cn(
              "text-2xl md:text-3xl font-bold transition-all",
              "bg-clip-text text-transparent",
              "bg-gradient-to-r from-zinc-900 to-zinc-600",
              "dark:from-zinc-100 dark:to-zinc-400",
              isSticky ? "transform scale-90" : ""
            )}>
              My Skills
            </h2>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <CategoryButton 
              active={activeCategory === 'All'} 
              onClick={() => setActiveCategory('All')}
            >
              All
            </CategoryButton>
            
            {skillCategories.map(category => (
              <CategoryButton 
                key={category.title}
                active={activeCategory === category.title} 
                onClick={() => setActiveCategory(category.title)}
                icon={category.icon}
                color={category.color}
              >
                {category.title}
              </CategoryButton>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 w-full max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredSkills.map((skill, index) => {
            const SkillIcon = getSkillIcon(skill.name);
            return (
              <motion.div
                key={`${skill.category}-${skill.name}`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20, 
                    mass: 0.8,
                    delay: index * 0.03 
                  }
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                onHoverStart={() => setHoveredSkill(`${skill.category}-${skill.name}`)}
                onHoverEnd={() => setHoveredSkill(null)}
                className={cn(
                  "rounded-xl p-4 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 flex flex-col h-full",
                  "bg-gradient-to-br bg-white/80 dark:bg-zinc-800/50",
                  "transition-all duration-300 ease-in-out"
                )}
              >
                <div className="flex items-center mb-3">
                  <motion.div 
                    className={cn(
                      "p-2 rounded-lg mr-3 text-white",
                      `bg-gradient-to-r ${skill.color}`,
                      hoveredSkill === `${skill.category}-${skill.name}` ? skill.animation : ""
                    )}
                  >
                    <SkillIcon className="w-5 h-5" />
                  </motion.div>
                  <h3 className="font-medium">{skill.name}</h3>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      `bg-gradient-to-r ${skill.color}`
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}