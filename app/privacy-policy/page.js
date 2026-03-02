import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 font-sora">Privacy Policy – Global</h1>
          <p className="text-charcoal/70 mb-12">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-charcoal/80 mb-8">
              This Privacy Policy explains how personal data is collected, used, stored, and processed by RoomService AI and its affiliated entities worldwide. We are committed to protecting privacy and processing personal data in accordance with applicable data protection laws, including the EU General Data Protection Regulation (GDPR), UK GDPR, and relevant U.S. and international privacy regulations.
            </p>
            <p className="text-lg text-charcoal/80 mb-12">
              This Privacy Policy applies to all users of the RoomService AI website, platform, and related services ("Services").
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">1. WHO WE ARE (DATA CONTROLLER INFORMATION)</h2>
            <p className="text-charcoal/80 mb-4">
              <strong>Data Controller:</strong><br />
              RoomService AI IP Ltd<br />
              Registered in Ireland
            </p>
            <p className="text-charcoal/80 mb-6">
              <strong>Commercial Operations & Data Processing Entity:</strong><br />
              RoomService AI Inc<br />
              Registered in Delaware, United States
            </p>
            <p className="text-charcoal/80 mb-8">
              For the purposes of applicable data protection laws, RoomService AI IP Ltd acts as the primary Data Controller, and RoomService AI Inc acts as a Data Processor and commercial operating entity.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">2. PERSONAL DATA WE COLLECT</h2>
            <p className="text-charcoal/80 mb-4">We may collect the following categories of personal data:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Contact information (name, email address, phone number)</li>
              <li>Business information (company name, job title, hotel or organisation details)</li>
              <li>Account and authentication information</li>
              <li>Communication data (messages, emails, call records where applicable)</li>
              <li>Usage and technical data (IP address, browser type, device information, log data)</li>
              <li>Transactional and billing data (where payments are applicable)</li>
              <li>Cookie and analytics data (see Cookie Policy)</li>
            </ul>
            <p className="text-charcoal/80 mb-8">We do not knowingly collect personal data from children.</p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">3. HOW WE USE PERSONAL DATA</h2>
            <p className="text-charcoal/80 mb-4">We process personal data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Providing and operating the Services</li>
              <li>Managing customer accounts and relationships</li>
              <li>Processing transactions and payments</li>
              <li>Providing customer support and communications</li>
              <li>Improving platform performance and user experience</li>
              <li>Analytics, security monitoring, and fraud prevention</li>
              <li>Compliance with legal and regulatory obligations</li>
            </ul>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">4. LEGAL BASIS FOR PROCESSING (GDPR / UK GDPR)</h2>
            <p className="text-charcoal/80 mb-4">Where GDPR or UK GDPR applies, we rely on the following lawful bases:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Performance of a contract</li>
              <li>Legitimate business interests</li>
              <li>Compliance with legal obligations</li>
              <li>User consent (where required)</li>
            </ul>
            <p className="text-charcoal/80 mb-8">Users may withdraw consent at any time where processing is based on consent.</p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">5. DATA SHARING AND DISCLOSURE</h2>
            <p className="text-charcoal/80 mb-4">We may share personal data with:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Service providers and subprocessors (e.g. hosting, analytics, payments)</li>
              <li>Professional advisors (legal, accounting, compliance)</li>
              <li>Authorities or regulators where legally required</li>
              <li>Successor entities in the event of a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-charcoal/80 mb-8">We do not sell personal data.</p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">6. INTERNATIONAL DATA TRANSFERS</h2>
            <p className="text-charcoal/80 mb-6">
              Personal data may be processed and stored outside the user's country of residence, including in the United States and the European Union.
            </p>
            <p className="text-charcoal/80 mb-8">
              Where required, appropriate safeguards are implemented to ensure lawful cross-border data transfers, including standard contractual clauses or equivalent mechanisms.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">7. DATA RETENTION</h2>
            <p className="text-charcoal/80 mb-8">
              We retain personal data only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">8. DATA SECURITY</h2>
            <p className="text-charcoal/80 mb-6">
              We implement appropriate technical and organisational measures designed to protect personal data against unauthorised access, loss, misuse, alteration, or disclosure.
            </p>
            <p className="text-charcoal/80 mb-8">
              No system can be guaranteed to be 100% secure, but we continuously review and enhance our security practices.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">9. USER RIGHTS</h2>
            <p className="text-charcoal/80 mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of personal data</li>
              <li>Object to or restrict processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-charcoal/80 mb-8">Requests may be submitted using the contact details below.</p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">10. COOKIES AND TRACKING TECHNOLOGIES</h2>
            <p className="text-charcoal/80 mb-6">
              We use cookies and similar technologies to operate and improve our Services.
            </p>
            <p className="text-charcoal/80 mb-8">
              For detailed information, please refer to our Cookie Policy and manage your preferences through the Cookie Settings tool available on our website.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">11. U.S. PRIVACY RIGHTS (CALIFORNIA)</h2>
            <p className="text-charcoal/80 mb-6">
              California residents may have additional rights under the California Consumer Privacy Act (CCPA/CPRA), including the right to know, delete, or limit certain uses of personal data.
            </p>
            <p className="text-charcoal/80 mb-8">
              Note: RoomService AI does not sell personal data.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">12. MENA AND INTERNATIONAL USERS</h2>
            <p className="text-charcoal/80 mb-8">
              For users located in the Middle East and other international regions, personal data is processed in accordance with applicable local privacy laws and GDPR-aligned principles.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">13. CHANGES TO THIS PRIVACY POLICY</h2>
            <p className="text-charcoal/80 mb-6">
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last updated" date.
            </p>
            <p className="text-charcoal/80 mb-8">
              Continued use of the Services constitutes acceptance of the updated Privacy Policy.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">14. CONTACT INFORMATION</h2>
            <p className="text-charcoal/80 mb-4">For privacy-related questions or requests, please contact:</p>
            <p className="text-lg font-bold text-copper">privacy@roomserviceai.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
