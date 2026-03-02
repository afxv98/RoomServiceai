import Navbar from '@/components/landing/Navbar';
import NewPricingSection from '@/components/landing/NewPricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-charcoal-darker">
      <ScrollToTop />
      <Navbar />
      <div className="pt-20">
        <NewPricingSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
