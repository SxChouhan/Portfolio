import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { ProjectModal } from './ProjectModal';

interface Project {
  title: string;
  description: string;
  image: string;
  type: '3D' | 'Web';
  longDescription?: string;
  features?: string[];
  technologies: string[];
  links: {
    github?: string;
    live?: string;
  };
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | '3D' | 'Web'>('all');

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeProjectModal = () => {
    setModalOpen(false);
  };

  const projects: Project[] = [
    // 3D Projects
    {
      title: "3D Interactive Dashboard",
      description: "A dynamic dashboard with 3D interactive elements and data visualization components",
      longDescription: "This innovative dashboard combines sleek design with powerful data visualization to transform complex information into intuitive, interactive 3D elements. Users can interact with data points, rotate charts, and explore multi-dimensional datasets in a visually appealing way that makes understanding complex information easier than ever.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
      type: "3D",
      technologies: ["React", "Three.js", "D3.js", "WebGL"],
      features: [
        "Interactive 3D data visualization components",
        "Real-time data updates with smooth transitions",
        "Customizable views and perspectives",
        "Cross-platform compatibility with responsive design",
        "Dark/light mode support"
      ],
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      title: "3D Product Configurator",
      description: "A customizable 3D product viewer that allows users to modify appearance and features in real-time",
      longDescription: "This advanced 3D product configurator enables customers to customize products with real-time visual feedback. Users can choose colors, materials, and components while the 3D model updates instantly, creating an engaging shopping experience that increases conversion and reduces returns by giving customers confidence in their purchase decisions.",
      image: "https://images.unsplash.com/photo-1617042375876-a13e36732a04?auto=format&fit=crop&q=80",
      type: "3D",
      technologies: ["Three.js", "React", "WebGL", "GLSL Shaders"],
      features: [
        "Real-time 3D model rendering with customizable properties",
        "Material and texture swapping",
        "Component visibility toggling",
        "Real-time lighting adjustments",
        "High-resolution export capabilities"
      ],
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      title: "3D Virtual Gallery",
      description: "An immersive virtual art gallery experience with interactive exhibits and spatial audio",
      longDescription: "This cutting-edge virtual gallery provides an immersive space for displaying digital art, 3D sculptures and interactive installations. Visitors can navigate through beautifully designed virtual rooms, interact with exhibits, and enjoy spatial audio that changes based on their position within the gallery, creating a truly immersive art appreciation experience.",
      image: "https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&q=80",
      type: "3D",
      technologies: ["Three.js", "React", "Web Audio API", "GLSL"],
      features: [
        "First-person navigation through multiple gallery spaces",
        "Interactive art pieces that respond to user input",
        "Spatial audio system that changes based on viewer position",
        "Custom lighting design optimized for art viewing",
        "VR mode for enhanced immersion"
      ],
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    // Web Projects
    {
      title: "E-Commerce Platform",
      description: "A fully responsive e-commerce website with product catalog, cart functionality, and checkout process",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80",
      type: "Web",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather application with 7-day forecast and location detection",
      image: "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&q=80",
      type: "Web",
      technologies: ["JavaScript", "HTML/CSS", "Weather API", "Chart.js"],
      links: {
        github: "https://github.com",
        live: "https://example.com"
      }
    },
    {
      title: "Task Management App",
      description: "Collaborative project management tool with kanban board and task assignment",
      image: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&q=80",
      type: "Web",
      technologies: ["React", "Firebase", "Material UI", "Redux"],
      links: {
        github: "https://github.com",
      }
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.type === activeFilter);

  return (
    <section id="projects" className="py-20 overflow-hidden">
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
          Featured Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
        >
          A showcase of my recent work, including web applications and 3D interactive experiences
        </motion.p>
        
        {/* Project filters */}
        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => setActiveFilter('all')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === 'all' 
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800" 
                : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            )}
          >
            All Projects
          </button>
          <button 
            onClick={() => setActiveFilter('3D')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === '3D' 
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800" 
                : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            )}
          >
            3D Projects
          </button>
          <button 
            onClick={() => setActiveFilter('Web')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeFilter === 'Web' 
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800" 
                : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            )}
          >
            Web Projects
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div 
                className="h-48 overflow-hidden relative" 
                onClick={() => openProjectModal(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                />
                <div className="absolute top-2 right-2 bg-zinc-800 text-white dark:bg-zinc-700 px-2 py-1 text-xs rounded-full">
                  {project.type}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-zinc-800 dark:text-zinc-200">{project.title}</h3>
                
                <p className="mb-4 text-zinc-600 dark:text-zinc-400 text-sm">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openProjectModal(project)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details
                  </button>
                  
                  <div className="flex space-x-2">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github size={16} className="text-zinc-700 dark:text-zinc-300" />
                      </a>
                    )}
                    
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={16} className="text-zinc-700 dark:text-zinc-300" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          isOpen={modalOpen}
          onClose={closeProjectModal}
          project={selectedProject}
        />
      )}
    </section>
  );
}
