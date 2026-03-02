'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import CTASection from '@/components/landing/CTASection';
import ScrollToTop from '@/components/ScrollToTop';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { AboutHeroVideo } from '@/components/remotion/AboutHeroVideo';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="pt-32 pb-24 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 font-sora text-white">Born From Repeated Real-World Experience</h1>
            <p className="text-2xl text-copper font-sora font-semibold mb-3">The same friction. Different hotel. Every time.</p>
            <p className="text-lg text-gray-300">Across premium 4- and 5-star properties, one pattern kept repeating.</p>
          </div>

          {/* About Hero Video */}
          <div className="mb-16">
            <VideoPlayer component={AboutHeroVideo} durationInFrames={150} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-lg font-bold text-copper font-sora mb-3">The Pattern</h3>
              <p className="text-gray-200 leading-relaxed">
                Room service relies on manual phone handling. During peak hours, communication breaks down.
              </p>
            </div>
            <div className="bg-white/5 border border-copper/30 rounded-xl p-8">
              <h3 className="text-lg font-bold text-copper font-sora mb-3">The Solution</h3>
              <p className="text-gray-200 leading-relaxed">
                AI-powered 24/7 call handling built specifically for hotel room service.
              </p>
            </div>
          </div>

          <p className="text-center text-xl text-white font-sora font-semibold">
            Luxury experience shouldn't depend on call availability.
          </p>
        </div>
      </div>
      <CTASection />
      <Footer />
    </main>
  );
}
