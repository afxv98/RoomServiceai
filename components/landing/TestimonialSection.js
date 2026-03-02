import { Quote } from 'lucide-react';

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-offwhite border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Quote className="w-12 h-12 text-copper mx-auto mb-6 opacity-50" />
        <blockquote className="text-2xl md:text-3xl font-sora leading-relaxed text-gray-800 mb-8">
          "The biggest challenge in luxury hospitality is consistency. The AI doesn't have bad days,
          it doesn't forget the wine list, and it's polite at 4 AM."
        </blockquote>
        <cite className="text-sm font-bold text-gray-500 uppercase tracking-widest not-italic">
          - Director of Food & Beverage, 5-Star Resort Partner
        </cite>
      </div>
    </section>
  );
}
