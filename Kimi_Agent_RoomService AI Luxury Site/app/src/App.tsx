import { useEffect, useState } from 'react';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import AlwaysOnSection from './sections/AlwaysOnSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FeaturesSection from './sections/FeaturesSection';
import PricingSection from './sections/PricingSection';
import IntegrationsSection from './sections/IntegrationsSection';
import SecuritySection from './sections/SecuritySection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import './App.css';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-charcoal min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation scrollY={scrollY} />
      
      {/* Sections */}
      <main className="relative">
        <HeroSection />
        <AlwaysOnSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <IntegrationsSection />
        <SecuritySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
