import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 font-sora">Cookie Policy</h1>
          <p className="text-charcoal/70 mb-12">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-charcoal/80 mb-8">
              This Cookie Policy explains how RoomService AI uses cookies and similar technologies on our website and platform. It should be read alongside our <Link href="/privacy-policy" className="text-copper hover:underline">Privacy Policy</Link>.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">1. WHAT ARE COOKIES?</h2>
            <p className="text-charcoal/80 mb-6">
              Cookies are small text files that are stored on your device when you visit a website. Cookies help websites function properly, improve user experience, and provide analytics and insights into site usage.
            </p>
            <p className="text-charcoal/80 mb-8">
              Cookies may be "session cookies" (deleted when you close your browser) or "persistent cookies" (stored for a defined period).
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">2. HOW WE USE COOKIES</h2>
            <p className="text-charcoal/80 mb-4">RoomService AI uses cookies to:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Operate and maintain our website and platform</li>
              <li>Enable core functionality and security</li>
              <li>Understand how visitors interact with our Services</li>
              <li>Improve performance and user experience</li>
              <li>Support analytics and measurement</li>
            </ul>
            <p className="text-charcoal/80 mb-8">We do not use cookies to sell personal data.</p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">3. TYPES OF COOKIES WE USE</h2>

            <h3 className="text-2xl font-bold mb-4 text-charcoal">a) ESSENTIAL COOKIES</h3>
            <p className="text-charcoal/80 mb-4">
              These cookies are strictly necessary for the website and platform to function properly. They enable core features such as security, authentication, and accessibility.
            </p>
            <p className="text-charcoal/80 mb-4">
              <strong>Essential cookies cannot be disabled.</strong>
            </p>
            <p className="text-charcoal/80 mb-4">Examples:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Security and fraud prevention</li>
              <li>Session management</li>
              <li>Cookie preference storage</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4 text-charcoal">b) ANALYTICS COOKIES</h3>
            <p className="text-charcoal/80 mb-4">
              Analytics cookies help us understand how visitors use our website by collecting aggregated and anonymised information.
            </p>
            <p className="text-charcoal/80 mb-4">Examples:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-charcoal/80">
              <li>Page visits and traffic sources</li>
              <li>Feature usage and performance metrics</li>
              <li>Error monitoring</li>
            </ul>
            <p className="text-charcoal/80 mb-8">
              Analytics cookies are only set where consent is provided (where required by law).
            </p>

            <h3 className="text-2xl font-bold mb-4 text-charcoal">c) MARKETING COOKIES (IF APPLICABLE)</h3>
            <p className="text-charcoal/80 mb-6">
              Marketing cookies may be used to measure the effectiveness of campaigns or communications.
            </p>
            <p className="text-charcoal/80 mb-8">
              RoomService AI does not currently use cookies for third-party advertising networks, unless explicitly stated.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">4. THIRD-PARTY COOKIES</h2>
            <p className="text-charcoal/80 mb-4">
              Some cookies may be set by trusted third-party service providers that support our Services, such as:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Hosting and infrastructure providers</li>
              <li>Analytics providers</li>
              <li>Payment processors (where applicable)</li>
            </ul>
            <p className="text-charcoal/80 mb-8">
              Third-party cookies are governed by the privacy policies of those providers.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">5. COOKIE RETENTION PERIODS</h2>
            <p className="text-charcoal/80 mb-4">
              Cookies are retained for different periods depending on their purpose:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Session cookies: deleted when the browser is closed</li>
              <li>Persistent cookies: retained for a defined period or until deleted</li>
            </ul>
            <p className="text-charcoal/80 mb-8">
              Retention periods are limited to what is necessary for their intended purpose.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">6. MANAGING COOKIE PREFERENCES</h2>
            <p className="text-charcoal/80 mb-6">
              You can manage your cookie preferences at any time by using the <Link href="/cookie-preferences" className="text-copper hover:underline">Cookie Preferences</Link> link available on our website.
            </p>
            <p className="text-charcoal/80 mb-8">
              Depending on your location, you may also adjust browser settings to block or delete cookies. Note that disabling certain cookies may affect website functionality.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">7. LEGAL BASIS FOR COOKIE USE</h2>
            <p className="text-charcoal/80 mb-6">
              Where required under GDPR or UK GDPR, cookies (other than essential cookies) are used based on user consent.
            </p>
            <p className="text-charcoal/80 mb-8">
              Users may withdraw consent at any time through the Cookie Preferences tool.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">8. INTERNATIONAL USERS</h2>
            <p className="text-charcoal/80 mb-8">
              This Cookie Policy applies globally. For users in the EU and UK, it is designed to comply with GDPR and UK GDPR requirements. For users in the United States and other regions, it aligns with applicable local privacy regulations and best practices.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">9. UPDATES TO THIS COOKIE POLICY</h2>
            <p className="text-charcoal/80 mb-8">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">10. CONTACT INFORMATION</h2>
            <p className="text-charcoal/80 mb-4">If you have questions about our use of cookies, please contact:</p>
            <p className="text-lg font-bold text-copper">privacy@roomserviceai.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
