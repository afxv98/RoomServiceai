'use client';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import CTASection from '@/components/landing/CTASection';
import ScrollToTop from '@/components/ScrollToTop';
import { Shield, CheckCircle, FileText, AlertTriangle, Lock, BarChart3 } from 'lucide-react';
import { VideoPlayer } from '@/components/remotion/VideoPlayer';
import { RevenueProtectionVideo } from '@/components/remotion/RevenueProtectionVideo';

export default function RevenueProtectionPage() {
  return (
    <main className="min-h-screen">
      <ScrollToTop />
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-copper rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 font-sora text-white">
            RoomService Chargeback Prevention Shield™
          </h1>
          <p className="text-2xl text-gray-200 mb-8">
            Stop room service fraud before it starts
          </p>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Late-night orders. Guest disputes. "I didn't order this."
            <br /><br />
            Chargebacks quietly drain hotel revenue every single month — and most hotels don't realise how much they're losing.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="py-16 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-charcoal/80 leading-relaxed text-center mb-12">
            RoomService AI's <strong className="text-copper">Chargeback Prevention Shield™</strong> is built to eliminate disputed room service charges by creating a clear, auditable proof trail for every order.
          </p>

          {/* Revenue Protection Video */}
          <div className="max-w-5xl mx-auto">
          </div>
        </div>
      </div>

      {/* The Hidden Problem */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-8">
            <AlertTriangle className="w-8 h-8 text-copper flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-4xl font-bold mb-6 font-sora">The hidden problem hotels face</h2>
              <p className="text-lg text-charcoal/80 mb-6">
                Room service chargebacks typically happen when:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-offwhite p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-charcoal/80">
                Guests order late at night and dispute the charge the next day
              </p>
            </div>
            <div className="bg-offwhite p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-charcoal/80">
                Alcohol or premium items are ordered and later denied
              </p>
            </div>
            <div className="bg-offwhite p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-charcoal/80">
                Orders are placed verbally with no verifiable confirmation
              </p>
            </div>
            <div className="bg-offwhite p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-charcoal/80">
                Front desk or finance teams lack evidence to challenge disputes
              </p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg">
            <p className="text-lg text-charcoal/80 leading-relaxed">
              Even a <strong>1–2% chargeback rate</strong> can cost a mid-size hotel <strong>tens of thousands per year</strong> — not including admin time, staff stress, and guest friction.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-offwhite">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center font-sora">
            How the Chargeback Prevention Shield™ works
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-copper">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-copper rounded-full flex items-center justify-center text-white text-xl font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 font-sora flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-copper" />
                    Verified Order Confirmation
                  </h3>
                  <p className="text-charcoal/80 mb-4">Every room service order is:</p>
                  <ul className="space-y-2 text-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Captured by AI voice or chat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Confirmed back to the guest in clear language</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Logged with time, room number, and order details</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-copper">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-copper rounded-full flex items-center justify-center text-white text-xl font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 font-sora flex items-center gap-3">
                    <FileText className="w-7 h-7 text-copper" />
                    Digital Proof of Consent
                  </h3>
                  <p className="text-charcoal/80 mb-4">Each order automatically creates:</p>
                  <ul className="space-y-2 text-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>A timestamped digital record</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>AI-generated order transcript</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Confirmation summary tied to the room and stay</span>
                    </li>
                  </ul>
                  <p className="text-lg font-bold text-copper mt-4">
                    This creates irrefutable proof that the guest approved the order.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-copper">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-copper rounded-full flex items-center justify-center text-white text-xl font-bold">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 font-sora flex items-center gap-3">
                    <Lock className="w-7 h-7 text-copper" />
                    Smart Item Safeguards
                  </h3>
                  <p className="text-charcoal/80 mb-4">
                    For high-risk items (alcohol, premium bottles, late-night orders):
                  </p>
                  <ul className="space-y-2 text-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Extra verbal confirmation prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Clear price acknowledgment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Optional second-step confirmation logic</span>
                    </li>
                  </ul>
                  <p className="text-charcoal/70 italic mt-4">
                    All without slowing service or annoying the guest.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-copper">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-copper rounded-full flex items-center justify-center text-white text-xl font-bold">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 font-sora flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-copper" />
                    Chargeback-Ready Evidence Pack
                  </h3>
                  <p className="text-charcoal/80 mb-4">If a dispute occurs, RoomService AI provides:</p>
                  <ul className="space-y-2 text-charcoal/80">
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Full order transcript</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Confirmation log</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-copper font-bold mt-1">•</span>
                      <span>Time and room verification</span>
                    </li>
                  </ul>
                  <p className="text-lg font-bold text-copper mt-4">
                    Everything finance teams need to win chargeback disputes fast.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Result */}
      <div className="py-16 bg-charcoal-darker text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center font-sora">
            The result for hotels
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-lg">Dramatically reduced chargebacks</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-lg">Recovered lost room service revenue</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-lg">Zero ambiguity over who ordered what</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-lg">Less admin time for finance teams</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span className="text-lg">Better guest experience with clear, professional service</span>
            </div>
          </div>

          <div className="text-center bg-copper/20 p-8 rounded-lg border-l-4 border-copper">
            <p className="text-2xl font-bold">
              Hotels stop absorbing losses and start protecting revenue automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Built for Modern Hotels */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center font-sora">
            Built for modern hotels
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-offwhite p-6 rounded-lg text-center border-2 border-gray-200">
              <p className="text-lg font-bold text-charcoal">No new hardware</p>
            </div>
            <div className="bg-offwhite p-6 rounded-lg text-center border-2 border-gray-200">
              <p className="text-lg font-bold text-charcoal">No extra staff steps</p>
            </div>
            <div className="bg-offwhite p-6 rounded-lg text-center border-2 border-gray-200">
              <p className="text-lg font-bold text-charcoal">No guest friction</p>
            </div>
            <div className="bg-offwhite p-6 rounded-lg text-center border-2 border-gray-200">
              <p className="text-lg font-bold text-charcoal">Works globally, 24/7</p>
            </div>
          </div>

          <div className="text-center bg-offwhite p-12 rounded-lg border-l-4 border-copper">
            <p className="text-2xl text-charcoal/80 mb-4">
              This isn't a policy change.
            </p>
            <p className="text-3xl font-bold text-copper">
              It's invisible protection baked into every order.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-offwhite">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-copper rounded-full mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 font-sora">
            RoomService<span className="text-copper">AI</span>
          </h2>
          <p className="text-2xl text-charcoal/80 mb-3">
            Room Service. Reimagined.
          </p>
          <p className="text-xl text-copper font-bold">
            Now with built-in revenue protection.
          </p>
        </div>
      </div>

      <CTASection />
      <Footer />
    </main>
  );
}
