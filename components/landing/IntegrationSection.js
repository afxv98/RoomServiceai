import { Check } from 'lucide-react';
import ScrollAnimation from '../animations/ScrollAnimation';
import { IntegrationVideoPlayer } from '../remotion/IntegrationVideoPlayer';

export default function IntegrationSection() {
  return (
    <section id="integration" className="py-24 bg-charcoal-darker text-white relative overflow-hidden">
      {/* Copper Geometric Accents */}
      <div className="absolute top-0 right-0 w-64 h-full border-l border-white/5 bg-offwhite/5 skew-x-12 transform origin-top-right"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <ScrollAnimation animation="fade-right" duration={600} className="md:w-1/2">
            <div>
            <h2 className="text-4xl font-bold mb-6 font-cormorant">
              Your POS, <span className="text-copper">Supercharged</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Say goodbye to fragmented systems. RoomService AI connects directly with your existing
              hospitality management platforms to automate the busywork.
            </p>

            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-copper flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Precision Kitchen Tickets</h4>
                  <p className="text-gray-400 text-sm">
                    Orders are routed directly to the kitchen printer, formatted perfectly for your
                    chefs every time.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-copper flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Instant Menu Updates</h4>
                  <p className="text-gray-400 text-sm">
                    Changes in your central system reflect immediately in the AI. Out of stock? The AI
                    knows before the guest orders.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded bg-copper flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">The "Human Handoff"</h4>
                  <p className="text-gray-400 text-sm">
                    If the AI detects an angry guest or a complex request, it instantly patches the
                    call to your Duty Manager.
                  </p>
                </div>
              </li>
            </ul>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-left" duration={600} delay={200} className="md:w-1/2">
            <div>
              {/* Remotion Video Player */}
              <IntegrationVideoPlayer />
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
