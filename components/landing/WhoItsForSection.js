import { Check, X } from 'lucide-react';

export default function WhoItsForSection() {
  return (
    <section id="who-its-for" className="py-24 bg-offwhite">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            WHO THIS IS FOR
          </span>
          <h2 className="text-4xl font-bold mt-2 font-cormorant">Built For Premium Hospitality</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Built For */}
          <div className="bg-offwhite p-8 rounded-lg border-2 border-green-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
              <Check className="w-6 h-6" /> Built For
            </h3>
            <ul className="space-y-3">
              {[
                '4★–5★ hotels',
                'Resorts and destination properties',
                'Luxury & lifestyle brands',
                'Hotels that offer room service'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-charcoal/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not For */}
          <div className="bg-offwhite p-8 rounded-lg border-2 border-red-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-red-700 flex items-center gap-2">
              <X className="w-6 h-6" /> Not For
            </h3>
            <ul className="space-y-3">
              {[
                'Properties focused primarily on rate',
                'Hotels not currently offering room service',
                'Simple guest messaging or concierge chat needs'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span className="text-charcoal/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            RoomService AI is purpose-built for hotels where room service is a mandatory amenity, not a nice-to-have feature.
          </p>
        </div>
      </div>
    </section>
  );
}
