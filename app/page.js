import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import ColorBreak from '@/components/landing/ColorBreak';
import SolutionSection from '@/components/landing/SolutionSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CoreFeaturesSection from '@/components/landing/CoreFeaturesSection';
import IntegrationSection from '@/components/landing/IntegrationSection';
import WhyChooseSection from '@/components/landing/WhyChooseSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <Hero />
      <ProblemSection />
      <ColorBreak />
      <SolutionSection />
      <HowItWorksSection />
      <CoreFeaturesSection />
      <IntegrationSection />
      <WhyChooseSection />
      <CTASection />
      <Footer />
    </main>
  );
}
