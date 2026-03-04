import { Languages, BrainCircuit, ListChecks } from 'lucide-react';

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 bg-gray-100 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            Beyond Human Capability
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4 font-cormorant">The 5-Star Standard</h2>
          <p className="text-lg text-charcoal/70">
            Eliminate the errors that cost you money and reputation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Language */}
          <div className="bg-offwhite p-8 rounded-lg shadow-md border-l-4 border-copper relative overflow-hidden group">
            <div className="w-12 h-12 bg-charcoal-darker rounded flex items-center justify-center mb-6 text-copper">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">No Language Barriers</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              Your staff might speak two languages. RoomServiceAI speaks 30+. Whether your guest
              speaks Mandarin, Arabic, or French, the AI detects it instantly and converses
              fluently, while printing the ticket in English for the kitchen.
            </p>
          </div>

          {/* Feature 2: Allergy Memory */}
          <div className="bg-offwhite p-8 rounded-lg shadow-md border-l-4 border-copper relative overflow-hidden group">
            <div className="w-12 h-12 bg-charcoal-darker rounded flex items-center justify-center mb-6 text-copper">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Institutional Memory</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              A human server forgets. The AI remembers. If the guest in Room 402 mentions a nut
              allergy on Tuesday, the AI will flag it on Friday's order automatically. It builds a
              persistent "Safety Profile" for every room.
            </p>
          </div>

          {/* Feature 3: Precision Accuracy */}
          <div className="bg-offwhite p-8 rounded-lg shadow-md border-l-4 border-copper relative overflow-hidden group">
            <div className="w-12 h-12 bg-charcoal-darker rounded flex items-center justify-center mb-6 text-copper">
              <ListChecks className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Right The First Time</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              Eliminate the "I didn't order this" refund. The AI repeats every modification back to
              the guest for confirmation (e.g., "Just to confirm: Dressing on the side, well
              done?"). Zero miscommunication. Zero waste.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
