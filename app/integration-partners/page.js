'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import CTASection from '@/components/landing/CTASection';
import ScrollToTop from '@/components/ScrollToTop';
import { Phone, Server, CreditCard, Settings, BarChart3, Shield } from 'lucide-react';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { IntegrationPartnersVideo } from '@/components/remotion/IntegrationPartnersVideo';

export default function IntegrationPartnersPage() {
  const integrationCategories = [
    {
      icon: Phone,
      title: "Telephony & Voice Infrastructure",
      description: "RoomService AI integrates directly with enterprise-grade telephony providers to handle inbound room service calls with speed, clarity, and reliability.",
      features: [
        "High call volumes",
        "International guests",
        "Low-latency performance",
        "24/7 availability"
      ]
    },
    {
      icon: Server,
      title: "Property Management Systems (PMS)",
      description: "RoomService AI is built to connect with leading PMS platforms, enabling contextual guest interactions and streamlined workflows.",
      features: [
        "Room identification",
        "Guest context",
        "Order attribution",
        "Operational reporting"
      ]
    },
    {
      icon: Settings,
      title: "Point of Sale (POS) & Kitchen Systems",
      description: "RoomService AI delivers structured, accurate orders directly into kitchen and service workflows.",
      details: "By removing manual transcription and interpretation, integrations help ensure:",
      features: [
        "Fewer order errors",
        "Faster preparation",
        "Clear ingredient and modifier visibility",
        "Reduced staff workload"
      ]
    },
    {
      icon: CreditCard,
      title: "Payments & Billing Platforms",
      description: "Where enabled, RoomService AI works with secure payment and billing providers to support compliant, enterprise-grade transaction handling.",
      features: [
        "All payment-related processing follows strict security and privacy standards."
      ]
    },
    {
      icon: BarChart3,
      title: "Hotel Operations & Workflow Tools",
      description: "RoomService AI can integrate with internal hotel tools to support:",
      features: [
        "Service coordination",
        "Tray and plate collection workflows",
        "Reporting and analytics",
        "Operational optimisation"
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="pt-32 pb-24 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 font-sora text-white">Integration Partners</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-4">
              Designed to Work With Your Existing Systems
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              RoomService AI is built to integrate seamlessly into the modern hotel technology stack. We partner with leading hospitality platforms and infrastructure providers to ensure smooth deployment, reliable performance, and minimal operational disruption — without forcing hotels to replace systems that already work.
            </p>

            {/* Integration Partners Video */}
            <div className="max-w-5xl mx-auto mb-12">
              <VideoPlayer component={IntegrationPartnersVideo} showControls={true} />
            </div>
          </div>

          {/* Integration Categories */}
          <div className="space-y-8 mb-24">
            {integrationCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-offwhite border-2 border-gray-200 rounded-lg p-8 hover:border-copper transition-all">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-copper rounded flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 font-sora text-charcoal">
                        {category.title}
                      </h3>
                      <p className="text-charcoal/80 mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      {category.details && (
                        <p className="text-charcoal/80 mb-3 font-medium">
                          {category.details}
                        </p>
                      )}
                      <div className="space-y-2">
                        {category.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-copper font-bold mt-1">•</span>
                            <span className="text-charcoal/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Built for Flexibility */}
          <div className="bg-white p-12 rounded-lg border-l-4 border-copper mb-16">
            <h2 className="text-3xl font-bold mb-6 font-sora text-charcoal">
              Built for Flexibility
            </h2>
            <p className="text-lg text-charcoal/80 leading-relaxed mb-6">
              Not every hotel operates the same way.
            </p>
            <p className="text-lg text-charcoal/80 leading-relaxed mb-6">
              RoomService AI is designed with an integration-first architecture, allowing us to adapt to different system environments, regional requirements, and brand standards.
            </p>
            <p className="text-xl font-bold text-charcoal">
              If a hotel has a preferred technology partner, we work to meet them where they are.
            </p>
          </div>

          {/* Trust Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-offwhite p-8 rounded-lg border-2 border-gray-200">
              <Shield className="w-12 h-12 text-copper mb-4" />
              <h3 className="text-2xl font-bold mb-3 font-sora">Trusted Technology Foundation</h3>
              <p className="text-charcoal/80 leading-relaxed">
                Our integrations are built on reliable, scalable infrastructure trusted by global enterprises — ensuring performance, security, and long-term support.
              </p>
            </div>
            <div className="bg-offwhite p-8 rounded-lg border-2 border-gray-200">
              <Server className="w-12 h-12 text-copper mb-4" />
              <h3 className="text-2xl font-bold mb-3 font-sora">Partner With Confidence</h3>
              <p className="text-charcoal/80 leading-relaxed mb-4">
                RoomService AI integrations are:
              </p>
              <ul className="space-y-2 text-charcoal/80">
                <li className="flex items-start gap-2">
                  <span className="text-copper">✓</span>
                  <span>Secure by design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-copper">✓</span>
                  <span>GDPR-aligned</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-copper">✓</span>
                  <span>Enterprise-ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-copper">✓</span>
                  <span>Built for global hospitality operations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center bg-charcoal-darker text-white p-12 rounded-lg">
            <p className="text-2xl font-bold mb-4">
              We believe great technology should fit naturally into your ecosystem — not fight against it.
            </p>
          </div>
        </div>
      </div>
      <CTASection />
      <Footer />
    </main>
  );
}
