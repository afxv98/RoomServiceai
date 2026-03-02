'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import CTASection from '@/components/landing/CTASection';
import ScrollToTop from '@/components/ScrollToTop';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { CapabilitiesVideo } from '@/components/remotion/CapabilitiesVideo';
import { Mic, Globe, CheckCircle, TrendingUp, Shield, Bell, Database, Lock } from 'lucide-react';

export default function CapabilitiesPage() {
  const capabilities = [
    {
      icon: Mic,
      title: "Autonomous Voice Ordering",
      description: "RoomService AI answers room service calls instantly, 24/7.",
      details: "It understands natural speech, accents, and multiple languages, allowing guests to order comfortably and confidently — without repetition, clarification loops, or frustration.",
      features: ["No apps", "No downloads", "Just effortless ordering"]
    },
    {
      icon: Globe,
      title: "Multi-Language & Accent Understanding",
      description: "Built for global hospitality, RoomService AI removes language barriers at the point of order.",
      details: "The system accurately interprets requests across languages and accents, ensuring ingredients, dietary requirements, and special instructions are captured correctly the first time.",
      features: ["This is where most room service errors begin — and where RoomService AI ends them."]
    },
    {
      icon: CheckCircle,
      title: "Intelligent Order Confirmation",
      description: "Every order is clearly confirmed before submission.",
      details: "RoomService AI repeats items, quantities, and special requests back to the guest, reducing misunderstandings, incorrect dishes, and post-delivery disputes.",
      features: ["What the guest hears is exactly what the kitchen receives."]
    },
    {
      icon: TrendingUp,
      title: "Smart Upselling & Revenue Optimisation",
      description: "RoomService AI consistently and politely offers relevant upsells based on the order context.",
      details: "From premium beverages to desserts and add-ons, upselling becomes natural, data-driven, and never pushy — increasing average order value without impacting service quality.",
      features: []
    },
    {
      icon: Shield,
      title: "Chargeback & Dispute Reduction",
      description: "Each interaction is securely recorded and logged.",
      details: "Clear confirmations and call records significantly reduce chargebacks caused by incorrect or disputed orders — protecting hotel revenue and reducing administrative overhead.",
      features: []
    },
    {
      icon: Bell,
      title: "Automated Tray & Collection Prompts",
      description: "RoomService AI supports post-delivery flow by prompting guests about tray and plate collection.",
      details: "Helping reduce corridor clutter and improving housekeeping efficiency.",
      features: ["A small detail — with a big operational impact."]
    },
    {
      icon: Database,
      title: "Seamless Hotel Integration",
      description: "RoomService AI integrates with existing hotel systems and workflows.",
      details: "Ensuring minimal disruption and fast deployment.",
      features: ["Designed to complement — not replace — your team."]
    },
    {
      icon: Lock,
      title: "Enterprise-Grade Security & Privacy",
      description: "Built with privacy-first architecture.",
      details: "RoomService AI adheres to GDPR-aligned data protection standards and enterprise-grade security practices.",
      features: ["Guest data is handled responsibly, securely, and transparently."]
    }
  ];

  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="pt-32 pb-24 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 font-sora text-white">What RoomService AI Can Do</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
              RoomService AI is an autonomous voice platform built specifically for luxury hospitality. Every capability is designed to eliminate friction, reduce errors, and elevate the guest experience — without adding operational complexity.
            </p>

            {/* Capabilities Video */}
            <div className="max-w-5xl mx-auto mb-12">
              <VideoPlayer component={CapabilitiesVideo} />
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="space-y-12 mb-24">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-8 border-l-4 border-copper">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-copper rounded flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 font-sora text-charcoal">
                        {capability.title}
                      </h3>
                      <p className="text-lg text-charcoal/80 mb-4 font-semibold">
                        {capability.description}
                      </p>
                      <p className="text-charcoal/70 mb-4 leading-relaxed">
                        {capability.details}
                      </p>
                      {capability.features.length > 0 && (
                        <div className="space-y-2">
                          {capability.features.map((feature, idx) => (
                            <p key={idx} className="text-copper font-medium italic">
                              {feature}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Benefits */}
          <div className="bg-charcoal-darker text-white p-12 rounded-lg mb-24">
            <h2 className="text-4xl font-bold mb-8 font-sora text-center">
              Always On. Always Consistent.
            </h2>
            <p className="text-xl text-center text-gray-300 leading-relaxed max-w-3xl mx-auto">
              RoomService AI never calls in sick, never rushes an order, and never loses patience.
              <br /><br />
              It delivers the same high-quality experience at 3am as it does at 3pm — every single day.
            </p>
          </div>

          <div className="text-center bg-copper/10 border-l-4 border-copper p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 font-sora text-charcoal">
              Built for 4 & 5-Star Hospitality
            </h2>
            <p className="text-lg text-charcoal/80 leading-relaxed max-w-2xl mx-auto">
              RoomService AI isn't generic AI.
              <br />
              It's purpose-built for luxury hotels that demand precision, discretion, and consistency — across every guest interaction.
            </p>
          </div>
        </div>
      </div>
      <CTASection />
      <Footer />
    </main>
  );
}
