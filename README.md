# Siddharth Chouhan - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and cutting-edge web technologies. Features interactive 3D elements, smooth animations, and a professional design system.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Interactive 3D Elements**: Custom 3D cube with mouse/touch controls
- **Smooth Animations**: Framer Motion for fluid page transitions
- **Dark/Light Theme**: Persistent theme switching with system preference detection
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Performance Optimized**: Lazy loading, code splitting, and optimized assets
- **Accessibility First**: WCAG compliant with proper ARIA labels and semantic HTML
- **Professional Code Quality**: TypeScript strict mode, ESLint, comprehensive documentation

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with strict configuration
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### Animation & Interaction
- **Framer Motion** - Production-ready motion library
- **GSAP** - High-performance animations
- **Lottie React** - Lightweight animations from After Effects

### UI & Icons
- **Lucide React** - Beautiful, customizable icons
- **Theme Toggles** - Smooth theme transition components

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── About.tsx       # About section with stats
│   ├── Contact.tsx     # Contact form and social links
│   ├── Footer.tsx      # Site footer
│   ├── Hero.tsx        # Landing hero section
│   ├── Projects.tsx    # Project showcase with filtering
│   ├── Skills.tsx      # Skills display with categories
│   └── ...
├── lib/                # Utility functions and helpers
│   └── utils.ts        # Common utility functions
├── assets/             # Static assets
│   └── animations/     # Lottie animation files
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddharthchouhan/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎨 Customization

### Theme Configuration
The theme system supports both light and dark modes with automatic system preference detection:

```typescript
// Theme is managed in ThemeButton.tsx
const [isDark, setIsDark] = useState(false);
```

### Adding New Projects
Projects are configured in the `Projects.tsx` component:

```typescript
const projects: Project[] = [
  {
    title: "Your Project",
    description: "Project description",
    image: "/path/to/image.jpg",
    technologies: ["React", "TypeScript"],
    type: "Web" | "3D",
    links: {
      github: "https://github.com/...",
      live: "https://..."
    }
  }
];
```

### Modifying Skills
Skills are categorized and can be updated in `Skills.tsx`:

```typescript
const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 }
    ]
  }
];
```

## 🔧 Configuration

### TypeScript Configuration
The project uses strict TypeScript configuration for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint Configuration
Professional-grade linting rules ensure code quality:

```javascript
export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn']
  }
});
```

## 📱 Responsive Design

The portfolio is built with a mobile-first approach:

- **Mobile**: Optimized for touch interactions and small screens
- **Tablet**: Balanced layout with improved spacing
- **Desktop**: Full-featured experience with advanced interactions

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Sufficient contrast ratios in both themes
- **Focus Management**: Clear focus indicators and logical tab order

## 🚀 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting and tree shaking
- **Loading Speed**: Fast initial load with progressive enhancement
- **Animation Performance**: 60fps animations with hardware acceleration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Siddharth Chouhan**
- Portfolio: [siddharthchouhan.com](https://siddharthchouhan.com)
- Email: contact@siddharthchouhan.com
- LinkedIn: [linkedin.com/in/siddharthchouhan](https://linkedin.com/in/siddharthchouhan)
- GitHub: [github.com/siddharthchouhan](https://github.com/siddharthchouhan)

---

⭐ **Star this repository if you found it helpful!**
