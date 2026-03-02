'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

// Configuration Object - Clean pricing numbers per currency
// These are the BASE prices (monthly equivalent for 12 months)
const PRICING_CONFIG = {
  GBP: { symbol: '£', essential: 18500, proBase: 20000, proPerRoom: 85 },
  USD: { symbol: '$', essential: 25000, proBase: 26000, proPerRoom: 110 },
  EUR: { symbol: '€', essential: 22000, proBase: 24000, proPerRoom: 100 }
};

const TIER_1_LIMIT = 75;
const TIER_2_LIMIT = 500;
const ANNUAL_DISCOUNT = 0.15; // 15% discount for annual billing

export default function NewPricingSection() {
  const [numRooms, setNumRooms] = useState(150);
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' or 'annual'
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to contact form
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Geo-IP detection on mount
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code;

        if (country === 'GB') {
          setCurrency('GBP');
        } else if (['AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'].includes(country)) {
          setCurrency('EUR');
        } else {
          setCurrency('USD');
        }
      } catch (error) {
        // Default to USD if geo-IP fails
        setCurrency('USD');
      } finally {
        setIsLoading(false);
      }
    };

    // Check for saved preference first
    const savedCurrency = sessionStorage.getItem('preferredCurrency');
    if (savedCurrency && PRICING_CONFIG[savedCurrency]) {
      setCurrency(savedCurrency);
      setIsLoading(false);
    } else {
      detectCurrency();
    }
  }, []);

  // Save currency preference when manually changed
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    sessionStorage.setItem('preferredCurrency', newCurrency);
  };

  // Calculate price based on rooms and currency
  const calculatePrice = (rooms, curr) => {
    const config = PRICING_CONFIG[curr] || PRICING_CONFIG['USD'];

    let basePrice = 0; // This is the monthly equivalent (full year at monthly rate)
    let activeTier = '';
    let details = null;

    if (rooms <= TIER_1_LIMIT) {
      activeTier = 'ESSENTIAL';
      basePrice = config.essential;
    } else if (rooms > TIER_1_LIMIT && rooms <= TIER_2_LIMIT) {
      activeTier = 'PROFESSIONAL';
      basePrice = config.proBase + (rooms * config.proPerRoom);
      details = `Includes ${config.symbol}${config.proBase.toLocaleString()} base + ${config.symbol}${config.proPerRoom}/room`;
    } else {
      activeTier = 'ENTERPRISE';
      return { tier: activeTier, basePrice: 0, annualPrice: 0, monthlyPrice: 0, details: null };
    }

    // Calculate actual prices
    const annualPrice = Math.round(basePrice * (1 - ANNUAL_DISCOUNT)); // 15% off for annual
    const monthlyPrice = Math.round(basePrice / 12); // No discount, base rate monthly

    return { tier: activeTier, basePrice, annualPrice, monthlyPrice, details };
  };

  const result = calculatePrice(numRooms, currency);
  const config = PRICING_CONFIG[currency];

  // Calculate display values
  const displayPrice = billingCycle === 'annual' ? result.annualPrice : result.monthlyPrice;
  const savings = result.basePrice - result.annualPrice; // How much you save with annual

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-sora text-white">Pricing That Scales With You</h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto">
            From boutique inns to international hotel groups
          </p>
        </div>

        {/* Currency Selector & Billing Toggle */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Currency Switcher */}
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-charcoal/70">Currency:</span>
            <div className="flex gap-2">
              {['GBP', 'USD', 'EUR'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currency === curr
                      ? 'bg-copper text-white'
                      : 'bg-white text-charcoal/80 border border-gray-300 hover:border-copper'
                  }`}
                  disabled={isLoading}
                >
                  {PRICING_CONFIG[curr].symbol} {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly/Annual Toggle */}
          <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-gray-300 w-full sm:w-auto justify-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-copper text-white'
                  : 'text-charcoal/80 hover:text-copper'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-copper text-white'
                  : 'text-charcoal/80 hover:text-copper'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          {/* Tier 1: Deluxe (Boutique) */}
          <div className={`bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-md border-2 ${numRooms <= 75 ? 'border-copper' : 'border-gray-200'}`}>
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold font-sora text-charcoal mb-2">Deluxe</h3>
              <p className="text-xs md:text-sm text-charcoal/70 mb-3 md:mb-4">Best for independent properties and luxury inns</p>
              <div className="text-xs md:text-sm text-copper font-bold mb-2">Up to 75 Rooms</div>
              <div className="text-3xl md:text-4xl font-bold text-charcoal font-sora">
                {billingCycle === 'annual'
                  ? config.symbol + Math.round(config.essential * (1 - ANNUAL_DISCOUNT)).toLocaleString()
                  : config.symbol + Math.round(config.essential / 12).toLocaleString()}
              </div>
              <div className="text-xs md:text-sm text-charcoal/70">/ {billingCycle === 'annual' ? 'year' : 'month'}</div>
            </div>

            <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>24/7 AI:</strong> Full overnight coverage and peak-load handling</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>AI Ordering:</strong> Voice + Chat</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Operations:</strong> POS Integration & Standard Kitchen Routing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Revenue:</strong> Standard Upsell Logic</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Support:</strong> Email Support (24h SLA)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Reporting:</strong> Monthly Performance Dashboard</span>
              </li>
            </ul>
          </div>

          {/* Tier 2: Signature (Growth) - HIGHLIGHTED */}
          <div className="bg-copper p-4 md:p-6 lg:p-8 rounded-lg shadow-xl transform lg:scale-105 relative">
            <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 bg-charcoal-darker text-white px-3 md:px-4 py-1 rounded-full text-xs font-bold uppercase">
              Most Popular
            </div>
            <div className="text-center mb-4 md:mb-6 mt-2 md:mt-0">
              <h3 className="text-xl md:text-2xl font-bold font-sora text-white mb-2">Signature</h3>
              <p className="text-xs md:text-sm text-white/90 mb-3 md:mb-4">Best for full-service hotels and large resorts</p>
              <div className="text-xs md:text-sm text-white font-bold mb-2">76–500 Rooms</div>
              <div className="text-3xl md:text-4xl font-bold text-white font-sora">
                {currency === 'USD' && (billingCycle === 'annual' ? '$29,200' : '$2,863')}
                {currency === 'GBP' && (billingCycle === 'annual' ? '£22,100' : '£2,167')}
                {currency === 'EUR' && (billingCycle === 'annual' ? '€26,000' : '€2,550')}
              </div>
              <div className="text-xs md:text-sm text-white/90 mb-2">/ {billingCycle === 'annual' ? 'year' : 'month'}</div>
              <div className="text-sm text-white/80">
                {currency === 'USD' && `+ $${billingCycle === 'annual' ? '94' : '9'}/room/${billingCycle === 'annual' ? 'year' : 'month'}`}
                {currency === 'GBP' && `+ £${billingCycle === 'annual' ? '71' : '7'}/room/${billingCycle === 'annual' ? 'year' : 'month'}`}
                {currency === 'EUR' && `+ €${billingCycle === 'annual' ? '85' : '8'}/room/${billingCycle === 'annual' ? 'year' : 'month'}`}
              </div>
            </div>

            <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white">Everything in Deluxe, plus:</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white"><strong>Advanced Revenue:</strong> Dynamic Upsell Logic (context-aware)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white"><strong>Guest Experience:</strong> SMS Order Confirmations & Status Updates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white"><strong>Operations:</strong> Advanced Routing (Multiple Kitchens/Bars)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white"><strong>Analytics:</strong> Real-time Revenue & Operations Portal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white"><strong>Support:</strong> Priority Support & dedicated Success Manager</span>
              </li>
            </ul>
          </div>

          {/* Tier 3: Global Enterprise */}
          <div className={`bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-md border-2 ${numRooms > 500 ? 'border-copper' : 'border-gray-200'}`}>
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold font-sora text-charcoal mb-2">Global Enterprise</h3>
              <p className="text-xs md:text-sm text-charcoal/70 mb-3 md:mb-4">Best for hotel groups and mega-resorts</p>
              <div className="text-xs md:text-sm text-copper font-bold mb-2">Multi-Property / 500+ Rooms</div>
              <div className="text-3xl md:text-4xl font-bold text-charcoal font-sora">Custom</div>
              <div className="text-xs md:text-sm text-charcoal/70">Contact Sales</div>
            </div>

            <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80">Everything in Signature, plus:</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Scale:</strong> Multi-property deployment & Centralized Dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Branding:</strong> White-label Voice (Custom Brand Voice) & UI</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Integration:</strong> Custom API access & Custom SLA</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Security:</strong> Enterprise-grade compliance & SSO</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/80"><strong>Commercial:</strong> Volume discounts for portfolio rollouts</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-charcoal-darker text-white p-6 md:p-8 lg:p-12 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold font-sora mb-3 md:mb-4">Not sure which tier is right for you?</h2>
          <p className="text-sm md:text-base text-white/70 mb-4 md:mb-6 max-w-2xl mx-auto">
            Our team can walk you through your specific requirements and recommend the best fit for your property.
          </p>
          <button
            onClick={scrollToContact}
            className="w-full sm:w-auto bg-copper text-white px-8 py-4 rounded-lg font-bold text-base md:text-lg hover:bg-copper-hover transition-all min-h-[44px]"
          >
            Schedule a Discovery Call
          </button>
        </div>
      </div>
    </section>
  );
}
