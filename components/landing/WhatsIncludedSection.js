import { Check, X } from 'lucide-react';

export default function WhatsIncludedSection() {
  return (
    <section id="whats-included" className="py-24 bg-offwhite">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 font-sora">What's Included</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Included Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-charcoal">Every Package Includes:</h3>
            <ul className="space-y-4">
              {[
                'Platform license',
                'AI voice orchestration',
                'Usage bundles (voice calls, chat, SMS)',
                'Hosting & infrastructure',
                'Security & compliance',
                'Standard integrations (POS, PMS)',
                'Ongoing optimisation'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-charcoal/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Included Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-charcoal">What You Won't Pay:</h3>
            <ul className="space-y-4">
              {[
                'No per-order fees',
                'No revenue commission',
                'No hidden costs'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <span className="text-charcoal/80 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 p-6 bg-copper/10 border-l-4 border-copper rounded-lg">
              <p className="text-charcoal/80 font-medium">
                Predictable, transparent pricing with no surprises. You know exactly what you'll pay every year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
