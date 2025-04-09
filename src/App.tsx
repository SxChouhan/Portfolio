import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { ModelViewer3D } from './components/ModelViewer3D';
import { IntroLoader } from './components/IntroLoader';
import { ThemeButton } from './components/ThemeButton';
import { Footer } from './components/Footer';
import { LocationIndicator } from './components/LocationIndicator';
import { GlobalBackground } from './components/GlobalBackground';


function App() {
  const [introComplete, setIntroComplete] = useState(false);
  
  // Handle intro completion
  const handleIntroComplete = () => {
    setIntroComplete(true);
    // Enable scrolling after intro
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
  };
  
  // Disable scrolling during intro
  useEffect(() => {
    if (!introComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [introComplete]);

  return (
    <div className="overflow-x-hidden w-full">
      {/* Background Animation - reverted to original */}
      {introComplete && <GlobalBackground />}
      
      {/* Intro Loader */}
      <IntroLoader onComplete={handleIntroComplete} />
      
      {/* Theme Toggle Button */}
      <ThemeButton />
      
      {/* Location Indicator */}
      <LocationIndicator />
      
      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0'} overflow-x-hidden w-full`}>
        <div className="bg-transparent">
          <Hero />
          <ModelViewer3D title="Interactive 3D Design" description="Experience immersive web-based 3D interactivity" />
          <Skills />
          <Projects />
          <About />
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;