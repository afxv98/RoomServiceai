'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/landing/Navbar';
import ParallaxHero from '@/components/brochure/ParallaxHero';
import AnimatedSection from '@/components/brochure/AnimatedSection';
import TextReveal from '@/components/brochure/TextReveal';
import FeatureCard from '@/components/brochure/FeatureCard';
import MetricCard from '@/components/brochure/MetricCard';
import DownloadFormModal from '@/components/brochure/DownloadFormModal';
import { Phone, CheckCircle, TrendingUp, Clock, Database, Zap } from 'lucide-react';

/**
 * RoomService AI Brochure Page
 * Luxury animated marketing brochure for pilot partners
 */
export default function BrochurePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal instead of direct download
  const handleDownloadBrochure = () => {
    setIsModalOpen(true);
  };

  // Handle form submission and trigger download
  const handleFormSubmit = async (formData) => {
    // Save lead to CRM
    try {
      await fetch('/api/demo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          hotelName: formData.hotelName,
          source: 'Brochure Download',
        }),
      });
    } catch (err) {
      console.error('Brochure lead capture error:', err);
    }

    // Trigger PDF download
    const link = document.createElement('a');
    link.href = '/brochure/RoomService-AI-Brochure.pdf';
    link.download = 'RoomService-AI-Brochure.pdf';
    link.click();

    // Close modal
    setIsModalOpen(false);
  };

  const handleScheduleDemo = () => {
    // Open Calendly in new tab
    window.open('https://calendly.com/theresa-roomserviceai/30min', '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="bg-charcoal-950">
      {/* Navbar */}
      <Navbar />

      {/* Section 1: Parallax Hero */}
      <ParallaxHero
        badge="24/7 Intelligent Call Coverage"
        headline="24/7 Intelligent Call Coverage for Hotel Room Service"
        subheadline="RoomService AI is built specifically for hotel room service operations. It ensures every call is answered, every order is accurate, and every guest interaction is handled consistently — without increasing staffing pressure."
        primaryCTA={{
          text: 'Download Brochure',
          onClick: handleDownloadBrochure,
        }}
        secondaryCTA={{
          text: 'Schedule Demo',
          onClick: handleScheduleDemo,
        }}
      />

      {/* Section 2: Problem Statement */}
      <section className="relative py-32 px-8 bg-charcoal-900">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <span className="px-4 py-2 rounded-full bg-copper-500/10 border border-copper-500/30
                           text-copper-400 text-sm font-inter font-medium tracking-wide">
              The Operational Pain
            </span>
          </AnimatedSection>

          <TextReveal
            text="Four Critical Challenges Facing Room Service Operations"
            className="text-4xl md:text-5xl font-outfit font-bold text-white text-center mb-20"
          />

          {/* Four Pain Point Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="p-8 rounded-2xl bg-charcoal-800/50 border border-charcoal-700 h-full">
                <h3 className="text-2xl text-copper-500 font-outfit font-bold mb-4">
                  Missed Calls During Peak Hours
                </h3>
                <p className="text-gray-300 font-inter mb-4">
                  Breakfast rush. Late-night demand. Event spikes. When staff are handling deliveries or coordinating with the kitchen, calls ring out.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Lost revenue
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Frustrated guests
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Negative reviews
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="p-8 rounded-2xl bg-charcoal-800/50 border border-charcoal-700 h-full">
                <h3 className="text-2xl text-copper-500 font-outfit font-bold mb-4">
                  Wrong Modifiers. Wrong Order.
                </h3>
                <p className="text-gray-300 font-inter mb-4">
                  Phone ordering breaks under pressure.<br />
                  "No onions."<br />
                  "Gluten-free."<br />
                  "Sauce on the side."<br />
                  "Medium rare."<br />
                  If modifiers aren't captured clearly, the kitchen makes the default version.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Remakes
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Delays
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Comped meals
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Guest dissatisfaction
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="p-8 rounded-2xl bg-charcoal-800/50 border border-charcoal-700 h-full">
                <h3 className="text-2xl text-copper-500 font-outfit font-bold mb-4">
                  Inconsistent Upselling
                </h3>
                <p className="text-gray-300 font-inter mb-4">
                  Upselling depends on who answers the phone and how busy they are.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Missed add-ons
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Lower average order value
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Inconsistent revenue capture
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="p-8 rounded-2xl bg-charcoal-800/50 border border-charcoal-700 h-full">
                <h3 className="text-2xl text-copper-500 font-outfit font-bold mb-4">
                  Staff Overload
                </h3>
                <p className="text-gray-300 font-inter mb-4">
                  Front desk and F&B teams absorb overflow calls while managing in-person service.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Slower operations
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Increased stress
                  </p>
                  <p className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-copper-500">•</span> Reduced service quality
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 3: Solution Overview */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-12">
            <span className="px-6 py-3 rounded-full bg-copper-500/10 border border-copper-500/30
                           text-copper-400 text-base md:text-lg font-inter font-semibold tracking-wide">
              Our Solution
            </span>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white text-center mb-6">
              Consistent Service, Every Time
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl text-gray-300 font-inter text-center mb-12 max-w-3xl mx-auto">
              RoomService AI handles every call with the precision and consistency your operation demands
            </p>
          </AnimatedSection>

          {/* Hotel Staff Image with Zoom Effect */}
          <AnimatedSection delay={0.3} className="mb-20">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
              <Image
                src="/brochure/hotel-staff-management.jpg"
                alt="Hotel staff managing seamless orders with AI technology"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
            </div>
          </AnimatedSection>

          {/* Solution Feature Cards - First Row (3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <FeatureCard
              icon={Phone}
              title="24/7 Instant Call Answering"
              description="Every room service call is answered immediately — no ringing out, no voicemail, no overflow."
              delay={0.1}
            />

            <FeatureCard
              icon={CheckCircle}
              title="Structured Order Confirmation"
              description="Before submission, the system confirms:"
              metrics={[
                'Items and quantities',
                'Cooking preferences',
                '"No" ingredients and modifiers',
                'Allergy and dietary requirements',
                'Room number and delivery details',
                'Final confirmation from the guest',
              ]}
              subtext="Orders are accurate before they reach the kitchen."
              delay={0.2}
            />

            <FeatureCard
              icon={TrendingUp}
              title="Built-In Revenue Optimization"
              description="Natural, structured upsell prompts are integrated into every order."
              delay={0.3}
            />
          </div>

          {/* Solution Feature Cards - Second Row (2 cards centered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={Database}
              title="Direct Kitchen & POS Integration"
              description="Orders flow directly into existing systems — eliminating manual re-entry and miscommunication."
              delay={0.4}
            />

            <FeatureCard
              icon={Zap}
              title="Peak-Hour Stability"
              description="High-volume periods are absorbed without impacting service levels or staffing."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Section 4: Proven Metrics - HIDDEN UNTIL WE GET REAL PILOT DATA */}
      {false && (
        <section className="relative py-32 px-8 bg-charcoal-900">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-12">
            <span className="px-4 py-2 rounded-full bg-copper-500/10 border border-copper-500/30
                           text-copper-400 text-sm font-inter font-medium tracking-wide">
              Proven Results
            </span>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white text-center mb-20">
              Real Numbers from Live Deployments
            </h2>
          </AnimatedSection>

          {/* Three Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <MetricCard
              number="£0.11"
              label="Cost per order"
              sublabel="vs £3-5 traditional labor"
              delay={0.1}
            />

            <MetricCard
              number="98%"
              label="Order accuracy"
              sublabel="Zero human error"
              delay={0.2}
            />

            <MetricCard
              number="24/7"
              label="Availability"
              sublabel="Never miss a sale"
              delay={0.3}
            />
          </div>

          {/* ROI Card */}
          <div className="max-w-md mx-auto mt-12">
            <MetricCard
              icon={TrendingUp}
              number="2-3"
              label="Months to ROI"
              description="Most hotels see positive ROI within 2-3 months of deployment"
              delay={0.4}
            />
          </div>

          {/* Kitchen Operations Image */}
          <AnimatedSection delay={0.6} className="mt-16">
            <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden group">
              <Image
                src="/brochure/kitchen-operations.jpg"
                alt="Premium kitchen operations with AI-powered efficiency"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 via-charcoal-950/40 to-transparent" />

              {/* Overlay text */}
              <div className="absolute inset-0 flex items-center justify-start p-12">
                <div className="max-w-xl">
                  <h3 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-4">
                    The Result
                  </h3>
                  <p className="text-xl text-gray-200 font-inter">
                    Correct food the first time. Happy guests. Repeat customers.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Benefits List */}
          <AnimatedSection delay={0.7} className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                'Fewer remakes and comps',
                'Faster delivery times',
                'Higher average order value',
                'Reduced staff pressure',
                'Consistent guest experience',
                '24/7 coverage, no extra headcount',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-charcoal-800/30 border border-charcoal-700">
                  <span className="text-copper-500 text-2xl flex-shrink-0">✓</span>
                  <span className="text-white font-inter text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
      )}

      {/* Section 5: Technology Stack */}
      <section className="relative py-32 px-8 bg-gradient-to-b from-charcoal-900 to-charcoal-950">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-12">
            <span className="px-4 py-2 rounded-full bg-copper-500/10 border border-copper-500/30
                           text-copper-400 text-sm font-inter font-medium tracking-wide">
              Enterprise Technology
            </span>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white text-center mb-20">
              Built for Luxury Hotels
            </h2>
          </AnimatedSection>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Security & Compliance */}
            <AnimatedSection delay={0.2} className="h-full">
              <div className="p-10 rounded-2xl bg-charcoal-900 border border-charcoal-800 h-full">
                <h3 className="text-2xl font-outfit font-bold text-white mb-6">
                  Security & Compliance
                </h3>
                <ul className="space-y-4">
                  {[
                    'GDPR compliant data handling',
                    'Isolated AI processing',
                    'Regular security audits',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="block w-2 h-2 rounded-full bg-copper-500 mt-2 flex-shrink-0" />
                      <span className="text-gray-300 font-inter text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Seamless Integration */}
            <AnimatedSection delay={0.3} className="h-full">
              <div className="p-10 rounded-2xl bg-charcoal-900 border border-charcoal-800 h-full">
                <h3 className="text-2xl font-outfit font-bold text-white mb-6">
                  Seamless Integration
                </h3>
                <ul className="space-y-4">
                  {[
                    'Works with your POS systems',
                    'PMS friendly integration',
                    'Existing menu sync',
                    'Multi-language support',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="block w-2 h-2 rounded-full bg-copper-500 mt-2 flex-shrink-0" />
                      <span className="text-gray-300 font-inter text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Room Service Cart Image */}
          <AnimatedSection delay={0.4} className="mt-16">
            <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden group">
              <Image
                src="/brochure/room-service-cart.jpg"
                alt="Luxury room service delivery with premium presentation"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/30 to-transparent" />

              {/* Overlay text */}
              <div className="absolute inset-0 flex items-end justify-center p-12">
                <div className="text-center max-w-2xl">
                  <h3 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-3">
                    Room Service 24/7
                  </h3>
                  <p className="text-xl text-gray-200 font-inter">
                    Always Available. Always Premium.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 6: Call-to-Action */}
      <section className="relative py-32 px-8 bg-charcoal-900">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
              {/* Copper gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-copper-500 to-copper-600" />

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full border-2 border-white" />
                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full border-2 border-white" />
              </div>

              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-6">
                  Ready to Eliminate Operational Pain?
                </h2>

                <p className="text-xl text-white/90 font-inter mb-10 max-w-3xl mx-auto">
                  Join leading hotels ensuring every call is answered, every order is accurate, and every guest is satisfied
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <button
                    onClick={handleDownloadBrochure}
                    className="px-8 py-4 rounded-xl bg-white text-copper-600 font-outfit font-bold
                             hover:bg-gray-100 hover:shadow-xl
                             transition-all duration-300 hover:scale-105"
                  >
                    Download Full Brochure
                  </button>

                  <button
                    onClick={handleScheduleDemo}
                    className="px-8 py-4 rounded-xl bg-transparent border-2 border-white
                             text-white font-outfit font-bold
                             hover:bg-white/10
                             transition-all duration-300"
                  >
                    Schedule Pilot Demo
                  </button>
                </div>

                {/* Contact Info */}
                <div className="text-white/90 font-inter mb-4">
                  <a href="mailto:contact@roomserviceai.com" className="hover:text-white transition-colors">
                    contact@roomserviceai.com
                  </a>
                  {' | '}
                  <a href="https://www.roomserviceai.com" className="hover:text-white transition-colors">
                    www.roomserviceai.com
                  </a>
                </div>

                {/* Tagline */}
                <p className="text-white/80 font-inter text-sm">
                  Powered by AI • Built for Luxury • Designed for Profit
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Download Form Modal */}
      <DownloadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </main>
  );
}
