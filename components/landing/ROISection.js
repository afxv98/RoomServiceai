export default function ROISection() {
  return (
    <section id="roi" className="py-24 bg-offwhite">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 font-cormorant">The Financial Impact</h2>
          <p className="text-lg text-charcoal/70">We don't cost money. We replace cost.</p>
        </div>

        <div className="bg-offwhite rounded shadow-2xl border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Traditional Way */}
            <div className="p-10 border-r border-gray-200">
              <h3 className="text-xl font-bold text-gray-400 mb-6 uppercase tracking-wider">
                The Old Way
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/70">3 FTE Staff (24/7 coverage)</span>
                  <span className="font-bold text-charcoal">$180,000/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/70">Missed Upsell Revenue</span>
                  <span className="font-bold text-red-500">-$80,000/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal/70">Recruitment/Training Costs</span>
                  <span className="font-bold text-charcoal">$15,000/yr</span>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Annual Cost</span>
                    <span className="text-2xl font-bold text-charcoal">$275,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The AI Way */}
            <div className="p-10 bg-charcoal-darker text-white relative">
              <h3 className="text-xl font-bold text-copper mb-6 uppercase tracking-wider">
                With RoomServiceAI
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Annual Flat Rate</span>
                  <span className="font-bold text-white">$59,400/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Upsell Revenue Gain</span>
                  <span className="font-bold text-green-400">+$80,000/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recruitment Costs</span>
                  <span className="font-bold text-white">$0</span>
                </div>
                <div className="pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Net Impact</span>
                    <span className="text-2xl font-bold text-green-400">+$20,600 Profit</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    *Based on 300 room hotel, 20% upsell success
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
