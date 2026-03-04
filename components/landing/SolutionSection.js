import { MessageSquare, Phone, Tablet, Check } from 'lucide-react';
import ScrollAnimation from '../animations/ScrollAnimation';

export default function SolutionSection() {
  return (
    <section id="solution" className="py-12 md:py-16 lg:py-24 bg-offwhite">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fade-up" duration={600}>
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <span className="text-copper font-bold uppercase tracking-widest text-xs">
              THE SOLUTION
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 font-cormorant text-charcoal">
              Voice-First Room Service Infrastructure
            </h2>
            <p className="text-base md:text-lg text-charcoal/70 max-w-3xl mx-auto">
              RoomService AI replaces manual call handling with enterprise-grade AI voice technology — integrated directly into your existing POS and hotel phone systems.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Guests order via */}
          <ScrollAnimation animation="fade-right" delay={200} duration={600}>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-charcoal font-cormorant">Guests order via:</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                  <Phone className="w-6 h-6 md:w-8 md:h-8 text-copper flex-shrink-0" />
                  <span className="text-sm md:text-base text-charcoal font-medium">AI voice ordering (in-room phone)</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                  <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-copper flex-shrink-0" />
                  <span className="text-sm md:text-base text-charcoal font-medium">Chat interface (QR codes, mobile)</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200">
                  <Tablet className="w-6 h-6 md:w-8 md:h-8 text-copper flex-shrink-0" />
                  <span className="text-sm md:text-base text-charcoal font-medium">Digital in-room menus (optional)</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Every order is */}
          <ScrollAnimation animation="fade-left" delay={200} duration={600}>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-charcoal font-cormorant">Every order is:</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-copper flex-shrink-0 mt-1" />
                  <span className="text-charcoal/80">Captured accurately via voice or chat</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-copper flex-shrink-0 mt-1" />
                  <span className="text-charcoal/80">Intelligently upsold without staff intervention</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-copper flex-shrink-0 mt-1" />
                  <span className="text-charcoal/80">Sent directly to your POS and kitchen</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-copper flex-shrink-0 mt-1" />
                  <span className="text-charcoal/80">Tracked for revenue and operational insights</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        <ScrollAnimation animation="zoom-in" delay={400} duration={600}>
          <div className="text-center bg-charcoal-darker text-white p-6 md:p-8 rounded-lg">
            <p className="text-lg md:text-xl lg:text-2xl font-bold font-sora">
              No calls.
              <br />
              No confusion.
              <br />
              <span className="text-copper">No missed revenue.</span>
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
