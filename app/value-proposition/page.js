'use client';

import Navbar from '@/components/landing/Navbar';
import BottomLineSection from '@/components/landing/BottomLineSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { ValuePropositionVideo } from '@/components/remotion/ValuePropositionVideo';

export default function ValuePropositionPage() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="pt-32 pb-16 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 font-sora text-white">Our Value Proposition</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              RoomService AI delivers transformational value across every aspect of your operation
            </p>

            {/* Value Proposition Video */}
            <div className="max-w-5xl mx-auto">
            </div>
          </div>
        </div>
      </div>
      <BottomLineSection />
      <CTASection />
      <Footer />
    </main>
  );
}
