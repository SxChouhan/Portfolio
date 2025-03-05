import React from 'react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-200">
      <ThemeToggle />
      <Hero />
      <About />
      <Skills />
      <Contact />
    </main>
  );
}

export default App;