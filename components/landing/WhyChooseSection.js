import { TrendingUp, DollarSign, Users, Clock, Truck, Smile } from 'lucide-react';
import ScrollAnimation from '../animations/ScrollAnimation';
import CardAnimation from '../animations/CardAnimation';

export default function WhyChooseSection() {
  const benefits = [
    { icon: TrendingUp, title: 'Higher order completion rates' },
    { icon: DollarSign, title: 'Increased average order value' },
    { icon: Clock, title: 'Reduced call handling' },
    { icon: Users, title: 'Lower staffing pressure' },
    { icon: Truck, title: 'Faster service delivery' },
    { icon: Smile, title: 'Happier guests' }
  ];

  return (
    <section id="roi" className="py-24 bg-offwhite">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fade-up" duration={600}>
          <div className="text-center mb-16">
            <span className="text-copper font-bold uppercase tracking-widest text-xs">
              WHY HOTELS CHOOSE ROOMSERVICE AI
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4 font-sora text-charcoal">
              Because It Fixes the Economics
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
              RoomService AI is not guest messaging software.
              <br />
              <span className="font-bold text-charcoal">It is room service revenue infrastructure.</span>
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <CardAnimation
                key={index}
                index={index}
                staggerDelay={80}
                animation="scale-up"
                duration={500}
              >
                <div className="text-center p-6 bg-white border border-gray-200 rounded-lg h-full">
                  <Icon className="w-12 h-12 text-copper mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-charcoal">{benefit.title}</h3>
                </div>
              </CardAnimation>
            );
          })}
        </div>

        <div className="space-y-6">
          <ScrollAnimation animation="fade-up" delay={200} duration={600}>
            <div className="bg-copper/10 border-l-4 border-copper p-8 rounded-lg text-center">
              <p className="text-xl font-bold text-charcoal">
                One additional upsell per order can often cover the entire system cost.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={400} duration={600}>
            <div className="bg-white border-l-4 border-charcoal p-8 rounded-lg text-center">
              <p className="text-lg text-charcoal">
                <span className="font-bold">Guest experience matters too.</span> Mistakes don't just cost money — they cost reviews, reputation, and repeat bookings.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
