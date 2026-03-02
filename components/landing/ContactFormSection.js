'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

function isEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hotel: '',
    rooms: '',
    phone: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [emailError, setEmailError] = useState('');

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
      setEmailStatus(null);
      return true;
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;
    await verifyEmail(formData.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailStatus === 'invalid') return;
    setSubmitting(true);

    if (emailStatus !== 'valid') {
      const ok = await verifyEmail(formData.email);
      if (!ok) {
        setSubmitting(false);
        return;
      }
    }

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          property: formData.hotel,
          phone: formData.phone,
          countryCode: '',
          country: '',
          city: '',
        }),
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-offwhite">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-copper font-bold uppercase tracking-widest text-xs">
            BOOK YOUR PILOT
          </span>
          <h2 className="text-4xl font-bold mt-2 mb-4 font-sora">
            Ready to Fix Room Service?
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Schedule a private demo and see how RoomService AI can transform your hotel's operations.
          </p>
        </div>

        <div className="bg-offwhite p-8 md:p-12 rounded-lg shadow-lg border-l-4 border-copper">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-charcoal mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-charcoal mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setEmailStatus(null);
                      setEmailError('');
                    }}
                    onBlur={handleEmailBlur}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-1 transition-colors
                      ${emailStatus === 'invalid'
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/40'
                        : emailStatus === 'valid'
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/40'
                        : 'border-gray-300 focus:border-copper focus:ring-copper'
                      }`}
                    placeholder="john@hotel.com"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailStatus === 'checking' && <Loader2 size={16} className="text-copper animate-spin" />}
                    {emailStatus === 'valid' && <CheckCircle size={16} className="text-green-500" />}
                    {emailStatus === 'invalid' && <XCircle size={16} className="text-red-400" />}
                  </div>
                </div>
                {emailStatus === 'invalid' && emailError && (
                  <p className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="hotel" className="block text-sm font-bold text-charcoal mb-2">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  id="hotel"
                  name="hotel"
                  required
                  value={formData.hotel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                  placeholder="Grand Hotel"
                />
              </div>

              <div>
                <label htmlFor="rooms" className="block text-sm font-bold text-charcoal mb-2">
                  Number of Rooms *
                </label>
                <select
                  id="rooms"
                  name="rooms"
                  required
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                >
                  <option value="">Select...</option>
                  <option value="1-50">Up to 50 rooms</option>
                  <option value="51-100">51–100 rooms</option>
                  <option value="101-250">101–250 rooms</option>
                  <option value="251-400">251–400 rooms</option>
                  <option value="401-700">401–700 rooms</option>
                  <option value="700+">700+ rooms</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-bold text-charcoal mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-bold text-charcoal mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper resize-none"
                  placeholder="Tell us about your current room service operation and what you'd like to achieve..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              {submitted ? (
                <p className="text-center text-green-600 font-semibold text-sm">
                  Thank you! We'll be in touch soon to schedule your pilot.
                </p>
              ) : (
                <button
                  type="submit"
                  disabled={submitting || emailStatus === 'checking'}
                  className="bg-copper text-white px-8 py-4 rounded-lg font-bold text-sm tracking-wide uppercase shadow-md hover:bg-copper-hover transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting
                    ? 'Sending…'
                    : emailStatus === 'checking'
                    ? 'Verifying email…'
                    : 'Request Private Demo'}
                </button>
              )}
            </div>

            {!submitted && (
              <p className="text-xs text-gray-500 text-center mt-4">
                We'll respond within 24 hours to schedule your personalized demo.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
