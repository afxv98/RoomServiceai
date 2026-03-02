'use client';

import Navbar from '@/components/landing/Navbar';
import ImplementationSection from '@/components/landing/ImplementationSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { ImplementationVideo } from '@/components/remotion/ImplementationVideo';
import ScrollToTop from '@/components/ScrollToTop';

export default function ImplementationPage() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="pt-32 pb-16 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 font-sora text-white">Implementation</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              From zero to hero in 5 days - Fast, simple, and effective
            </p>

            {/* Implementation Video */}
            <div className="max-w-5xl mx-auto">
            </div>
          </div>
        </div>
      </div>
      <ImplementationSection />
      <CTASection />
      <Footer />
    </main>
  );
}
