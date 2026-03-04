import { CheckCircle2 } from 'lucide-react';

export default function ImplementationSection() {
  return (
    <section id="implementation" className="py-24 bg-offwhite">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            IMPLEMENTATION
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4 font-cormorant">
            Go Live in Weeks, Not Months
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-12">
          {[
            { number: '1', title: 'Menu upload & voice training' },
            { number: '2', title: 'POS/PMS integration & testing' },
            { number: '3', title: 'AI voice tuning & upsell logic' },
            { number: '4', title: 'Staff training & soft launch' },
            { number: '5', title: 'Go-live & ongoing optimisation' }
          ].map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-copper text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {step.number}
              </div>
              <p className="text-sm text-charcoal/80 font-medium">{step.title}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-offwhite p-8 rounded-lg border-l-4 border-copper">
          <p className="text-xl font-bold text-charcoal mb-2">
            Minimal disruption.
            <br />
            <span className="text-copper">Maximum operational impact.</span>
          </p>
          <p className="text-charcoal/70 mt-4">
            Our implementation team handles the heavy lifting. You focus on what you do best — running your hotel.
          </p>
        </div>
      </div>
    </section>
  );
}
