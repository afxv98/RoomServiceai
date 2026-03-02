'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import CTASection from '@/components/landing/CTASection';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { ContactHeroVideo } from '@/components/remotion/ContactHeroVideo';
import ScrollToTop from '@/components/ScrollToTop';
import { Mail, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="pt-32 pb-24 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 font-sora text-white">Let's Talk Room Service</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-12">
              Whether you're exploring RoomService AI for a single property or a global portfolio, our team is here to help.
            </p>

            {/* Contact Hero Video */}
            <div className="max-w-4xl mx-auto mb-12">
            <VideoPlayer component={ContactHeroVideo} showControls={true} />
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-lg text-charcoal/80 leading-relaxed mb-6">
              We work closely with hotel owners, general managers, operations leaders, and technology teams to understand your needs and determine how RoomService AI can fit seamlessly into your operation.
            </p>

            <h2 className="text-3xl font-bold mb-6 font-sora text-charcoal">Get in Touch</h2>
            <p className="text-lg text-charcoal/80 mb-4">If you'd like to:</p>
            <ul className="list-disc pl-6 space-y-2 text-charcoal/80 mb-12">
              <li>Request a demo</li>
              <li>Discuss integrations</li>
              <li>Review pricing and ROI</li>
              <li>Explore a pilot or rollout</li>
              <li>Ask a technical or compliance question</li>
            </ul>
            <p className="text-xl font-bold text-charcoal mb-12">
              We'd love to hear from you.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-8 font-sora text-charcoal">Contact Information</h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-white rounded-lg">
                <Mail className="w-10 h-10 text-copper mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">General Enquiries</h3>
                <a href="mailto:hello@roomserviceai.com" className="text-copper hover:underline">
                  hello@roomserviceai.com
                </a>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <Mail className="w-10 h-10 text-copper mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Sales & Partnerships</h3>
                <a href="mailto:sales@roomserviceai.com" className="text-copper hover:underline">
                  sales@roomserviceai.com
                </a>
              </div>
              <div className="text-center p-6 bg-white rounded-lg">
                <Mail className="w-10 h-10 text-copper mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Support</h3>
                <a href="mailto:support@roomserviceai.com" className="text-copper hover:underline">
                  support@roomserviceai.com
                </a>
              </div>
            </div>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-6 font-sora text-charcoal">Built for Global Hospitality</h2>
            <p className="text-lg text-charcoal/80 mb-6">
              RoomService AI works with hotels across regions, languages, and operating models.
            </p>
            <p className="text-lg text-charcoal/80 mb-4">Our team supports deployments in:</p>
            <ul className="list-disc pl-6 space-y-2 text-charcoal/80 mb-12">
              <li>Europe & UK</li>
              <li>United States</li>
              <li>Middle East & International markets</li>
            </ul>
            <p className="text-charcoal/80 leading-relaxed mb-12">
              We understand the realities of international hospitality and enterprise requirements.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-6 font-sora text-charcoal">A Personal Note</h2>
            <p className="text-lg text-charcoal/80 leading-relaxed mb-6">
              RoomService AI was created to fix a problem we experienced repeatedly as travellers — and we take that mission seriously.
            </p>
            <p className="text-xl font-bold text-charcoal mb-12">
              Every conversation starts with listening.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border-l-4 border-copper text-center">
            <p className="text-sm text-charcoal/70">
              We respect your privacy. Any information you share with us will be handled in accordance with our <a href="/privacy-policy" className="text-copper hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      <CTASection />
      <Footer />
    </main>
  );
}
