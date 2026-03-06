import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 font-sora">Privacy Policy</h1>
          <p className="text-charcoal/70 mb-2">Last Updated: March 3, 2026</p>
          <p className="text-charcoal/70 mb-12">Entity: RoomService AI Inc. (Delaware, USA)</p>

          <div className="prose prose-lg max-w-none">

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">1. Introduction</h2>
            <p className="text-charcoal/80 mb-8">
              RoomService AI Inc. ("we," "us," or "our") provides AI-driven guest service solutions via{' '}
              <a href="https://www.roomserviceai.com" className="text-copper hover:underline">www.roomserviceai.com</a>.
              This Privacy Policy explains how we collect, use, and protect your information globally.
              By using our website or opting into our SMS services, you agree to these practices.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">2. Information We Collect</h2>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>
                <strong>Direct Information:</strong> Name, email, and phone number when you request
                info or a demo.
              </li>
              <li>
                <strong>Automated Information:</strong> IP address, browser type, and usage data
                collected via cookies.
              </li>
              <li>
                <strong>SMS Consent Data:</strong> We track the time, date, and source (IP) of your
                opt-in to comply with international "Proof of Consent" requirements.
              </li>
            </ul>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">3. SMS & Mobile Communications (A2P 10DLC Compliance)</h2>
            <p className="text-charcoal/80 mb-4">
              We use SMS to provide requested information and follow-up support.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-3 text-charcoal/80">
              <li>
                <strong>Consent:</strong> Mobile consent is obtained via an explicit, unchecked
                checkbox on our web forms.
              </li>
              <li>
                <strong>No Sharing:</strong> Mobile information will not be shared with third
                parties/affiliates for marketing/promotional purposes. All the above categories
                exclude text messaging originator opt-in data and consent; this information will not
                be shared with any third parties.
              </li>
              <li>
                <strong>Rates & Frequency:</strong> Message frequency varies. Message and data rates
                may apply.
              </li>
              <li>
                <strong>Control:</strong> Reply <strong>STOP</strong> to opt-out at any time. Reply{' '}
                <strong>HELP</strong> for assistance.
              </li>
            </ul>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">4. International Data Transfers (EU/UK/Global)</h2>
            <p className="text-charcoal/80 mb-4">
              As a US-based Delaware corporation, we process data in the United States.
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-3 text-charcoal/80">
              <li>
                <strong>Safeguards:</strong> For users in the EU and UK, we process data based on
                Standard Contractual Clauses (SCCs) or the EU-U.S. Data Privacy Framework.
              </li>
              <li>
                <strong>Lawful Basis:</strong> For EU/UK/Singapore/South Africa, our lawful basis
                for SMS and email marketing is Explicit Consent. For service-related communication,
                it is Legitimate Interest or Contractual Necessity.
              </li>
            </ul>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">5. Region-Specific Rights</h2>
            <p className="text-charcoal/80 mb-4">
              Depending on your location, you have specific rights regarding your data:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-3 text-charcoal/80">
              <li>
                <strong>EU (GDPR) & UK (DPA 2018):</strong> You have the right to access, rectify,
                or erase your data ("Right to be Forgotten"), and the right to data portability.
              </li>
              <li>
                <strong>California (CCPA/CPRA):</strong> You have the right to know what data is
                collected and to opt-out of the "sale" of data. Note: We do not sell your personal
                data.
              </li>
              <li>
                <strong>South Africa (POPIA):</strong> We maintain data only for specified, lawful
                purposes. You may object to processing at any time.
              </li>
              <li>
                <strong>Singapore (PDPA):</strong> We honor Do Not Call (DNC) registry requirements
                and process opt-outs within 10 business days.
              </li>
            </ul>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">6. Data Retention</h2>
            <p className="text-charcoal/80 mb-8">
              We retain your personal data only as long as necessary to fulfill the purposes for
              which it was collected (e.g., as long as you are a client or active lead). SMS opt-in
              records are kept for the duration of the communication plus 4 years to defend against
              potential regulatory inquiries.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">7. Security</h2>
            <p className="text-charcoal/80 mb-8">
              We implement industry-standard encryption (SSL/TLS) for data in transit and at rest.
              Access to personal data is restricted to authorized employees on a "need-to-know" basis.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">8. Contact & Redress</h2>
            <p className="text-charcoal/80 mb-4">
              If you have questions or wish to exercise your rights, please contact:
            </p>
            <address className="not-italic text-charcoal/80 mb-2">
              <strong>Privacy Officer</strong><br />
              RoomService AI Inc.<br />
              Delaware, USA
            </address>
            <p className="text-lg font-bold text-copper mt-4">
              <a href="mailto:privacy@roomserviceai.com" className="hover:underline">
                privacy@roomserviceai.com
              </a>
            </p>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
