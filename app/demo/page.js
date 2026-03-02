'use client';

import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { ArrowRight, Loader2, CheckCircle, XCircle } from 'lucide-react';

// Basic RFC-5322-ish format check to avoid wasting API credits on obvious typos
function isEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function IframeSection() {
  return (
    <>
      <div className="pt-32 pb-12 bg-gradient-to-b from-charcoal-darker via-charcoal-darker to-charcoal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-copper/90 mb-4">
            Live Interactive Demo
          </div>
          <h1 className="font-sora font-bold text-white text-4xl md:text-5xl leading-tight tracking-tight mb-6">
            Talk to the AI — <span className="text-copper">right now</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Experience RoomService AI firsthand. Place an order, ask about the menu, or explore what the system can do for your property.
          </p>
          <p className="mt-3 text-sm text-white/40">
            Microphone access may be requested — this is used solely for the voice demo.
          </p>
        </div>
      </div>

      <div className="bg-charcoal pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <iframe
              src="https://rsaiagentfe-production.up.railway.app/demo"
              width="100%"
              height="800"
              frameBorder="0"
              allow="microphone"
              title="RoomService AI Demo"
              className="block w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-charcoal-dark border-t border-white/10 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-white/70 text-base mb-6">
            Ready to deploy this for your property?
          </p>
          <a
            href="https://calendly.com/theresa-roomserviceai/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-copper text-white px-8 py-4 rounded-lg font-semibold
                       hover:bg-copper-dark hover:shadow-copper hover:scale-[1.02] transition-all duration-300"
          >
            Book a Call
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </>
  );
}

export default function DemoPage() {
  const [form, setForm] = useState({ fullName: '', email: '', hotelName: '' });
  const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      // Reset status when user edits the email
      setEmailStatus(null);
      setEmailError('');
    }
    if (submitError) setSubmitError('');
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

  const handleEmailBlur = async () => {
    if (!form.email) return;
    await verifyEmail(form.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const { fullName, email, hotelName } = form;

    if (!fullName.trim() || !email.trim() || !hotelName.trim()) {
      setSubmitError('Please fill in all fields.');
      return;
    }

    if (emailStatus === 'invalid') {
      setSubmitError('Please fix the email address before continuing.');
      return;
    }

    setSubmitting(true);

    // Verify email if not already confirmed valid
    if (emailStatus !== 'valid') {
      const ok = await verifyEmail(email);
      if (!ok) {
        setSubmitting(false);
        return;
      }
    }

    // Send lead to n8n (non-blocking — failure doesn't stop the user)
    try {
      await fetch('/api/demo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, hotelName }),
      });
    } catch {
      // Silent fail — user still gets access
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-charcoal-darker">
      <ScrollToTop />
      <Navbar />

      {submitted ? (
        <IframeSection />
      ) : (
        /* Gate form */
        <div className="pt-32 pb-24 bg-gradient-to-b from-charcoal-darker to-charcoal">
          <div className="max-w-lg mx-auto px-4 sm:px-6">
            {/* Heading */}
            <div className="text-center mb-10">
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-copper/90 mb-4">
                Live Interactive Demo
              </div>
              <h1 className="font-sora font-bold text-white text-4xl leading-tight tracking-tight mb-4">
                Talk to the AI — <span className="text-copper">right now</span>
              </h1>
              <p className="text-white/60 text-base leading-relaxed">
                Enter your details below to access the live demo.
              </p>
            </div>

            {/* Card */}
            <div className="bg-charcoal border border-white/10 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Full Name <span className="text-copper">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                    className="w-full bg-charcoal-darker border border-white/15 rounded-lg px-4 py-3 text-white
                               placeholder-white/30 text-sm
                               focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper
                               transition-colors duration-200"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Work Email <span className="text-copper">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      placeholder="jane@grandhotel.com"
                      required
                      className={`w-full bg-charcoal-darker border rounded-lg px-4 py-3 text-white
                                 placeholder-white/30 text-sm pr-10
                                 focus:outline-none focus:ring-1 transition-colors duration-200
                                 ${emailStatus === 'invalid'
                                   ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                                   : emailStatus === 'valid'
                                   ? 'border-green-500 focus:border-green-500 focus:ring-green-500/40'
                                   : 'border-white/15 focus:border-copper focus:ring-copper'
                                 }`}
                    />
                    {/* Status icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailStatus === 'checking' && (
                        <Loader2 size={16} className="text-copper animate-spin" />
                      )}
                      {emailStatus === 'valid' && (
                        <CheckCircle size={16} className="text-green-400" />
                      )}
                      {emailStatus === 'invalid' && (
                        <XCircle size={16} className="text-red-400" />
                      )}
                    </div>
                  </div>
                  {emailStatus === 'invalid' && emailError && (
                    <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
                  )}
                </div>

                {/* Hotel Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Hotel Name <span className="text-copper">*</span>
                  </label>
                  <input
                    type="text"
                    name="hotelName"
                    value={form.hotelName}
                    onChange={handleChange}
                    placeholder="The Grand Hotel"
                    required
                    className="w-full bg-charcoal-darker border border-white/15 rounded-lg px-4 py-3 text-white
                               placeholder-white/30 text-sm
                               focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper
                               transition-colors duration-200"
                  />
                </div>

                {/* Global error */}
                {submitError && (
                  <p className="text-sm text-red-400 text-center">{submitError}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || emailStatus === 'checking'}
                  className="w-full flex items-center justify-center gap-2 bg-copper text-white
                             px-6 py-4 rounded-lg font-semibold text-sm
                             hover:bg-copper-dark transition-all duration-300
                             disabled:opacity-60 disabled:cursor-not-allowed
                             hover:shadow-copper hover:scale-[1.01]"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Access the Demo
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-white/30 leading-relaxed">
                  Your details are handled in accordance with our{' '}
                  <a href="/privacy-policy" className="text-copper/70 hover:text-copper underline transition-colors">
                    Privacy Policy
                  </a>
                  . No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
