'use client';

import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';

export default function CookiePreferencesPage() {
  const { toast } = useNotification();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    // TODO: Implement actual cookie consent logic
    localStorage.setItem('cookieConsent', JSON.stringify({
      analytics,
      marketing,
      timestamp: new Date().toISOString()
    }));
    toast.success('Your cookie preferences have been saved.');
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    localStorage.setItem('cookieConsent', JSON.stringify({
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    toast.success('All cookies accepted.');
  };

  const handleRejectAll = () => {
    setAnalytics(false);
    setMarketing(false);
    localStorage.setItem('cookieConsent', JSON.stringify({
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    toast.info('Optional cookies rejected.');
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 font-sora">Cookie Preferences</h1>
          <p className="text-lg text-charcoal/80 mb-12">
            You can control how we use cookies on this website. Some cookies are essential to ensure the site functions properly and cannot be disabled. Other cookies are optional and are only used with your consent.
          </p>
          <p className="text-charcoal/70 mb-12">
            You may change your preferences at any time.
          </p>

          <hr className="my-8" />

          {/* Essential Cookies */}
          <div className="mb-12 p-8 bg-white rounded-lg border-l-4 border-charcoal">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 font-sora">ESSENTIAL COOKIES</h2>
                <span className="inline-block px-3 py-1 bg-charcoal-darker text-white text-xs font-bold rounded-full">
                  Always Active
                </span>
              </div>
            </div>
            <p className="text-charcoal/80 mb-4">
              These cookies are required for the website to function and cannot be switched off. They are usually set in response to actions such as setting privacy preferences, logging in, or filling in forms.
            </p>
            <p className="text-charcoal/80 mb-2"><strong>Used for:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-charcoal/80">
              <li>Security and fraud prevention</li>
              <li>Session management</li>
              <li>Cookie consent storage</li>
              <li>Core site functionality</li>
            </ul>
            <p className="text-sm text-charcoal/70 mt-4">Status: <strong>Always enabled</strong></p>
          </div>

          <hr className="my-8" />

          {/* Analytics Cookies */}
          <div className="mb-12 p-8 bg-offwhite rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 font-sora">ANALYTICS COOKIES</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-copper/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-offwhite after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-copper"></div>
              </label>
            </div>
            <p className="text-charcoal/80 mb-4">
              These cookies help us understand how visitors interact with our website by collecting aggregated and anonymised information. This allows us to improve performance, usability, and overall experience.
            </p>
            <p className="text-charcoal/80 mb-2"><strong>Used for:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-charcoal/80">
              <li>Page views and traffic analysis</li>
              <li>Feature usage insights</li>
              <li>Performance monitoring</li>
            </ul>
          </div>

          <hr className="my-8" />

          {/* Marketing Cookies */}
          <div className="mb-12 p-8 bg-offwhite rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 font-sora">MARKETING COOKIES</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-copper/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-offwhite after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-copper"></div>
              </label>
            </div>
            <p className="text-charcoal/80 mb-4">
              These cookies may be used to measure the effectiveness of communications or campaigns. We do not use cookies for third-party advertising networks unless explicitly stated.
            </p>
            <p className="text-charcoal/80 mb-2"><strong>Used for:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-charcoal/80">
              <li>Campaign performance measurement</li>
              <li>Limited marketing insights</li>
            </ul>
          </div>

          <hr className="my-8" />

          <p className="text-sm text-charcoal/70 mb-8">
            You can update your preferences at any time by clicking "Cookie Preferences" in the website footer.
          </p>
          <p className="text-sm text-charcoal/70 mb-8">
            For more information, please review our <Link href="/cookie-policy" className="text-copper hover:underline">Cookie Policy</Link> and <Link href="/privacy-policy" className="text-copper hover:underline">Privacy Policy</Link>.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleSave}
              className="bg-copper text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide shadow-md hover:bg-copper-hover transition-all"
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="bg-charcoal-darker text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide shadow-md hover:bg-charcoal-darker-dark transition-all"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectAll}
              className="border-2 border-charcoal text-charcoal px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-white transition-all"
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
