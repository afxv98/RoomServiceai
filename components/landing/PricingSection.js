import { Check } from 'lucide-react';

export default function PricingSection() {
  const tiers = [
    {
      tier: "Tier 1",
      name: "Boutique Luxury",
      rooms: "Up to 50 rooms",
      price: "£14,500",
      period: "/ year",
      features: [
        "AI voice + chat ordering (core hours)",
        "Core upsell logic",
        "POS integration",
        "Reporting dashboard",
        "Usage bundle included"
      ]
    },
    {
      tier: "Tier 2",
      name: "Small Full-Service Hotel",
      rooms: "51–100 rooms",
      price: "£21,500",
      period: "/ year",
      features: [
        "AI voice + chat ordering (extended hours)",
        "Advanced upsells",
        "SMS order confirmations",
        "Kitchen routing",
        "Higher usage allowances"
      ]
    },
    {
      tier: "Tier 3",
      name: "Full-Service Hotel",
      rooms: "101–250 rooms",
      price: "£29,500",
      period: "/ year",
      popular: true,
      features: [
        "24/7 AI voice + chat ordering",
        "Dynamic upsell logic",
        "POS & kitchen integration",
        "Revenue & operations analytics"
      ]
    },
    {
      tier: "Tier 4",
      name: "Large Hotel / Resort",
      rooms: "251–400 rooms",
      price: "£49,500",
      period: "/ year",
      features: [
        "Priority voice ordering",
        "Peak-hour load handling",
        "Advanced revenue optimisation",
        "Executive-level reporting"
      ]
    },
    {
      tier: "Tier 5",
      name: "Mega Resort / Multi-Outlet",
      rooms: "401–700 rooms",
      price: "£69,500",
      period: "/ year",
      features: [
        "Multiple kitchens and outlets",
        "High-volume voice capacity",
        "Advanced routing logic",
        "Dedicated support"
      ]
    },
    {
      tier: "Tier 6",
      name: "Enterprise / Hotel Groups",
      rooms: "Multi-property",
      price: "£95,000–£150,000+",
      period: "/ year",
      features: [
        "Multi-property deployments",
        "White-label voice",
        "Custom SLAs",
        "Group-level dashboards"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            PRICING
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4 font-sora">Enterprise Room-Based Licensing</h2>
          <p className="text-lg text-charcoal/70 mb-2">
            Annual contracts · No surprise usage bills
          </p>
          <p className="text-sm text-gray-500 italic">
            Voice AI is standard across all tiers. Higher tiers unlock extended hours, higher concurrency, and priority routing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-offwhite rounded-lg shadow-md border-2 p-8 relative hover:shadow-xl transition-shadow duration-300 ${
                tier.popular ? 'border-copper' : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-copper text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <span className="text-xs font-bold text-copper uppercase tracking-widest">{tier.tier}</span>
                <h3 className="text-xl font-bold mb-2 font-sora">{tier.name}</h3>
                <p className="text-sm text-charcoal/70 mb-4">{tier.rooms}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-charcoal">{tier.price}</span>
                  <span className="text-charcoal/70 ml-2">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                  tier.popular
                    ? 'bg-copper text-white hover:bg-copper-hover'
                    : 'border-2 border-copper text-copper hover:bg-copper hover:text-white'
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-charcoal/70 text-sm">
            All plans include onboarding, training, and ongoing technical support.
          </p>
        </div>
      </div>
    </section>
  );
}
