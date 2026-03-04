import { TrendingUp, DollarSign, Users, Sparkles } from 'lucide-react';

export default function BottomLineSection() {
  return (
    <section id="bottom-line" className="py-24 bg-charcoal-darker text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            THE BOTTOM LINE
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4 font-cormorant">
            Room service doesn't need more staff.
            <br />
            <span className="text-copper">It needs a better system.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <TrendingUp className="w-10 h-10 text-copper mb-4" />
            <h3 className="text-xl font-bold mb-2">Predictable costs</h3>
            <p className="text-white/70">Fixed annual pricing with no per-order fees or revenue commission</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <DollarSign className="w-10 h-10 text-copper mb-4" />
            <h3 className="text-xl font-bold mb-2">Measurable revenue uplift</h3>
            <p className="text-white/70">Consistent upsells on every order increase average check size</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Users className="w-10 h-10 text-copper mb-4" />
            <h3 className="text-xl font-bold mb-2">Lower operational friction</h3>
            <p className="text-white/70">Reduce labour pressure without compromising service quality</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Sparkles className="w-10 h-10 text-copper mb-4" />
            <h3 className="text-xl font-bold mb-2">A frustration-free guest experience</h3>
            <p className="text-white/70">No hold times, no miscommunication, no wrong orders</p>
          </div>
        </div>

        <div className="text-center bg-copper/20 p-8 rounded-lg border-l-4 border-copper">
          <p className="text-2xl font-bold text-white">
            This is how room service finally makes financial sense.
          </p>
        </div>
      </div>
    </section>
  );
}
