'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function isEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CTASection() {
  const [formData, setFormData] = useState({
    fullName: '',
    countryCode: '+1',
    phone: '',
    email: '',
    country: '',
    city: '',
    property: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [emailError, setEmailError] = useState('');

  // Country codes
  const countryCodes = [
    { code: '+1', country: 'US/CA' },
    { code: '+44', country: 'UK' },
    { code: '+353', country: 'IE' },
    { code: '+33', country: 'FR' },
    { code: '+49', country: 'DE' },
    { code: '+39', country: 'IT' },
    { code: '+34', country: 'ES' },
    { code: '+971', country: 'UAE' },
    { code: '+41', country: 'CH' },
    { code: '+31', country: 'NL' },
    { code: '+351', country: 'PT' },
    { code: '+43', country: 'AT' },
    { code: '+32', country: 'BE' },
    { code: '+61', country: 'AU' },
    { code: '+65', country: 'SG' },
    { code: '+852', country: 'HK' },
    { code: '+81', country: 'JP' },
  ];

  // Country and city data
  const locations = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas', 'San Francisco', 'Boston', 'Seattle'],
    'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool', 'Bristol', 'Oxford'],
    'Ireland': ['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Killarney'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Nice', 'Cannes', 'Bordeaux', 'Monaco'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
    'Italy': ['Rome', 'Milan', 'Venice', 'Florence', 'Naples', 'Turin'],
    'Spain': ['Madrid', 'Barcelona', 'Seville', 'Valencia', 'Málaga', 'Bilbao'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
    'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Lucerne'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    'Portugal': ['Lisbon', 'Porto', 'Faro', 'Funchal', 'Cascais'],
    'Austria': ['Vienna', 'Salzburg', 'Innsbruck', 'Graz'],
    'Belgium': ['Brussels', 'Bruges', 'Antwerp', 'Ghent'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Singapore': ['Singapore'],
    'Hong Kong': ['Hong Kong'],
    'Japan': ['Tokyo', 'Kyoto', 'Osaka', 'Yokohama', 'Fukuoka'],
    'Other': ['Other']
  };

  const verifyEmail = async (email) => {
    if (!isEmailFormat(email)) {
      setEmailStatus('invalid');
      setEmailError('Please enter a valid email address.');
      return false;
    }

    setEmailStatus('checking');
    setEmailError('');

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.valid) {
        setEmailStatus('valid');
        return true;
      } else {
        setEmailStatus('invalid');
        setEmailError(data.reason || 'Please enter a valid email address.');
        return false;
      }
    } catch {
      // Fail open — don't block on network errors
      setEmailStatus(null);
      return true;
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (field === 'email') {
      setEmailStatus(null);
      setEmailError('');
    }

    // Auto-advance to next step when field is filled
    if (value.trim() !== '') {
      if (field === 'fullName' && currentStep === 0) setCurrentStep(1);
      if (field === 'phone' && currentStep === 1) setCurrentStep(2);
      if (field === 'email' && currentStep === 2) setCurrentStep(3);
      if (field === 'country' && currentStep === 3) {
        setFormData({ ...formData, country: value, city: '' }); // Reset city when country changes
        setCurrentStep(4);
      }
      if (field === 'city' && currentStep === 4) setCurrentStep(5);
      if (field === 'property' && currentStep === 5) setCurrentStep(6);
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;
    await verifyEmail(formData.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Verify email if not already confirmed valid
    if (emailStatus !== 'valid') {
      const ok = await verifyEmail(formData.email);
      if (!ok) {
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Success!
      setSubmitStatus('success');

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          countryCode: '+1',
          phone: '',
          email: '',
          country: '',
          city: '',
          property: ''
        });
        setCurrentStep(0);
        setSubmitStatus(null);
        setEmailStatus(null);
        setEmailError('');
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 lg:py-40 bg-charcoal relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-2xl overflow-hidden shadow-card flex flex-col md:flex-row bg-charcoal-soft/30 border border-offwhite-muted/10">
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 text-white flex flex-col justify-center border-b md:border-b-0 md:border-r border-offwhite-muted/10">
            <span className="micro-label mb-4 block">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-sora text-offwhite">
              Ready to reimagine room service?
            </h2>
            <p className="text-offwhite-muted mb-8 text-base md:text-lg leading-relaxed">
              Book a private demo and see how RoomService AI increases revenue, reduces labour pressure, and modernises your operations—without adding headcount.
            </p>
          </div>
          <div className="md:w-1/2 bg-charcoal-soft/50 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name - Step 0 */}
              <div className={`transition-all duration-500 ${currentStep >= 0 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <label
                  className="block text-offwhite text-sm font-semibold mb-2"
                  htmlFor="fullName"
                >
                  Full Name *
                </label>
                <input
                  className="w-full px-4 py-3 border border-offwhite-muted/20 rounded-lg focus:outline-none focus:border-copper bg-charcoal text-offwhite placeholder:text-offwhite-muted/50 transition-colors"
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {/* Phone Number with Country Code - Step 1 */}
              {currentStep >= 1 && (
                <div className="transition-all duration-500 animate-fadeIn">
                  <label
                    className="block text-offwhite text-sm font-semibold mb-2"
                    htmlFor="phone"
                  >
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="px-3 py-3 border border-offwhite-muted/20 rounded-lg focus:outline-none focus:border-copper bg-charcoal text-offwhite transition-colors"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code} ({item.country})
                        </option>
                      ))}
                    </select>
                    <input
                      className="flex-1 px-4 py-3 border border-offwhite-muted/20 rounded-lg focus:outline-none focus:border-copper bg-charcoal text-offwhite placeholder:text-offwhite-muted/50 transition-colors"
                      id="phone"
                      type="tel"
                      placeholder="555 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email - Step 2 */}
              {currentStep >= 2 && (
                <div className="transition-all duration-500 animate-fadeIn">
                  <label
                    className="block text-offwhite text-sm font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none bg-charcoal text-offwhite placeholder:text-offwhite-muted/50 transition-colors focus:ring-1
                        ${emailStatus === 'invalid'
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                          : emailStatus === 'valid'
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/40'
                          : 'border-offwhite-muted/20 focus:border-copper focus:ring-copper/40'
                        }`}
                      id="email"
                      type="email"
                      placeholder="director@hotelname.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={handleEmailBlur}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailStatus === 'checking' && <Loader2 size={16} className="text-copper animate-spin" />}
                      {emailStatus === 'valid' && <CheckCircle size={16} className="text-green-400" />}
                      {emailStatus === 'invalid' && <XCircle size={16} className="text-red-400" />}
                    </div>
                  </div>
                  {emailStatus === 'invalid' && emailError && (
                    <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
                  )}
                </div>
              )}

              {/* Country - Step 3 */}
              {currentStep >= 3 && (
                <div className="transition-all duration-500 animate-fadeIn">
                  <label
                    className="block text-offwhite text-sm font-semibold mb-2"
                    htmlFor="country"
                  >
                    Country *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-offwhite-muted/20 rounded-lg focus:outline-none focus:border-copper bg-charcoal text-offwhite transition-colors"
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    required
                  >
                    <option value="">Select country...</option>
                    {Object.keys(locations).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* City - Step 4 */}
              {currentStep >= 4 && formData.country && (
                <div className="transition-all duration-500 animate-fadeIn">
                  <label
                    className="block text-offwhite text-sm font-semibold mb-2"
                    htmlFor="city"
                  >
                    City *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-offwhite-muted/20 rounded-lg focus:outline-none focus:border-copper bg-charcoal text-offwhite transition-colors"
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                  >
                    <option value="">Select city...</option>
                    {locations[formData.country].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Property Name - Step 5 */}
              {currentStep >= 5 && (
                <div className="transition-all duration-500 animate-fadeIn">
                  <label
                    className="block text-offwhite text-sm font-semibold mb-2"
                    htmlFor="property"
                  >
                    Property Name *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-offwhite-muted/20 rounded-lg focus:outline-none focus:border-copper bg-charcoal text-offwhite placeholder:text-offwhite-muted/50 transition-colors"
                    id="property"
                    type="text"
                    placeholder="The Grand Hotel"
                    value={formData.property}
                    onChange={(e) => handleChange('property', e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Submit Button - Step 6 */}
              {currentStep >= 6 && (
                <div className="transition-all duration-500 animate-fadeIn pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || emailStatus === 'checking'}
                    className={`w-full font-semibold py-4 px-6 rounded-lg shadow-copper transform transition-all duration-300 ${
                      isSubmitting || emailStatus === 'checking'
                        ? 'bg-offwhite-muted/30 cursor-not-allowed text-offwhite-muted'
                        : 'bg-copper text-white hover:scale-[1.02] hover:shadow-copper'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : emailStatus === 'checking' ? 'Verifying email…' : 'Request Demo'}
                  </button>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="mt-4 p-4 bg-copper/20 border-l-4 border-copper text-offwhite rounded-lg animate-fadeIn">
                      <p className="font-bold">Success!</p>
                      <p className="text-sm text-offwhite-muted">Thank you for your interest. A representative will contact you shortly.</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-destructive/20 border-l-4 border-destructive text-offwhite rounded-lg animate-fadeIn">
                      <p className="font-bold">Error</p>
                      <p className="text-sm text-offwhite-muted">Failed to submit form. Please try again or contact us directly.</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
