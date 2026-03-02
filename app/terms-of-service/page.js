import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4 font-sora">Terms of Service</h1>
          <p className="text-charcoal/70 mb-12">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-charcoal/80 mb-8">
              These Terms of Service ("Terms") govern access to and use of the RoomService AI website, platform, and related services ("Services"). By accessing or using the Services, you agree to be bound by these Terms.
            </p>
            <p className="text-lg text-charcoal/80 mb-12">
              If you do not agree to these Terms, you may not access or use the Services.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">1. COMPANY INFORMATION</h2>
            <p className="text-charcoal/80 mb-4">
              RoomService AI® services are provided through the following entities:
            </p>
            <p className="text-charcoal/80 mb-4">
              <strong>Technology Licensor:</strong><br />
              RoomService AI IP Ltd<br />
              Registered in Ireland
            </p>
            <p className="text-charcoal/80 mb-6">
              <strong>Commercial Operations Provider:</strong><br />
              RoomService AI Inc<br />
              Registered in Delaware, United States
            </p>
            <p className="text-charcoal/80 mb-8">
              References to "RoomService AI," "we," "us," or "our" refer collectively to these entities.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">2. ELIGIBILITY</h2>
            <p className="text-charcoal/80 mb-6">
              You must be at least 18 years old and have the legal authority to enter into binding agreements to use the Services.
            </p>
            <p className="text-charcoal/80 mb-8">
              If you are using the Services on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">3. SERVICES DESCRIPTION</h2>
            <p className="text-charcoal/80 mb-6">
              RoomService AI provides AI-powered technology solutions for hospitality and related industries. Features and functionality may vary by plan, region, or deployment.
            </p>
            <p className="text-charcoal/80 mb-8">
              We reserve the right to modify, enhance, or discontinue any aspect of the Services at any time.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">4. ACCOUNT REGISTRATION</h2>
            <p className="text-charcoal/80 mb-4">Some features may require account creation.</p>
            <p className="text-charcoal/80 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your login credentials</li>
              <li>Notify us promptly of any unauthorised access</li>
            </ul>
            <p className="text-charcoal/80 mb-8">
              You are responsible for all activity occurring under your account.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">5. ACCEPTABLE USE</h2>
            <p className="text-charcoal/80 mb-4">You agree not to use the Services to:</p>
            <ul className="list-disc pl-6 mb-8 space-y-2 text-charcoal/80">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe intellectual property rights</li>
              <li>Transmit malicious code or interfere with system security</li>
              <li>Engage in fraudulent, deceptive, or harmful conduct</li>
              <li>Reverse engineer, copy, or misuse the platform or AI systems</li>
            </ul>
            <p className="text-charcoal/80 mb-8">
              We may suspend or terminate access for violations of this section.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">6. INTELLECTUAL PROPERTY</h2>
            <p className="text-charcoal/80 mb-6">
              All intellectual property rights in the Services, including software, AI models, designs, trademarks, and content, are owned by or licensed to RoomService AI IP Ltd.
            </p>
            <p className="text-charcoal/80 mb-6">
              These Terms grant you a limited, non-exclusive, non-transferable right to use the Services solely for their intended purpose.
            </p>
            <p className="text-charcoal/80 mb-8">
              No ownership rights are transferred.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">7. CUSTOMER DATA</h2>
            <p className="text-charcoal/80 mb-6">
              You retain ownership of data you submit through the Services.
            </p>
            <p className="text-charcoal/80 mb-8">
              By using the Services, you grant RoomService AI the right to process such data solely for the purpose of providing and improving the Services, in accordance with our Privacy Policy.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">8. FEES AND PAYMENTS</h2>
            <p className="text-charcoal/80 mb-6">
              Certain Services may require payment.
            </p>
            <p className="text-charcoal/80 mb-6">
              Pricing, billing cycles, and payment terms will be disclosed at the time of purchase or in a separate agreement.
            </p>
            <p className="text-charcoal/80 mb-8">
              All fees are non-refundable unless expressly stated otherwise.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">9. THIRD-PARTY SERVICES</h2>
            <p className="text-charcoal/80 mb-6">
              The Services may integrate with third-party tools or services.
            </p>
            <p className="text-charcoal/80 mb-8">
              RoomService AI is not responsible for third-party products, services, or content, which are governed by their own terms and policies.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">10. SERVICE AVAILABILITY</h2>
            <p className="text-charcoal/80 mb-6">
              We aim to provide reliable and continuous service but do not guarantee uninterrupted or error-free operation.
            </p>
            <p className="text-charcoal/80 mb-8">
              Maintenance, updates, or technical issues may result in temporary interruptions.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">11. DISCLAIMERS</h2>
            <p className="text-charcoal/80 mb-6">
              The Services are provided "as is" and "as available."
            </p>
            <p className="text-charcoal/80 mb-8">
              To the fullest extent permitted by law, RoomService AI disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">12. LIMITATION OF LIABILITY</h2>
            <p className="text-charcoal/80 mb-4">
              To the maximum extent permitted by law:
            </p>
            <p className="text-charcoal/80 mb-6">
              RoomService AI shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, or data.
            </p>
            <p className="text-charcoal/80 mb-8">
              Our total liability arising out of or relating to the Services shall not exceed the amount paid by you to RoomService AI in the twelve (12) months preceding the claim.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">13. INDEMNIFICATION</h2>
            <p className="text-charcoal/80 mb-8">
              You agree to indemnify and hold harmless RoomService AI and its affiliates, directors, officers, employees, and agents from any claims, damages, or expenses arising from your use of the Services or violation of these Terms.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">14. TERMINATION</h2>
            <p className="text-charcoal/80 mb-6">
              We may suspend or terminate access to the Services at any time for violation of these Terms or applicable law.
            </p>
            <p className="text-charcoal/80 mb-6">
              You may discontinue use of the Services at any time.
            </p>
            <p className="text-charcoal/80 mb-8">
              Sections relating to intellectual property, disclaimers, limitation of liability, and governing law shall survive termination.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">15. GOVERNING LAW AND JURISDICTION</h2>
            <p className="text-charcoal/80 mb-8">
              These Terms of Service are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">16. CHANGES TO THESE TERMS</h2>
            <p className="text-charcoal/80 mb-6">
              We may update these Terms from time to time. Updates will be posted on this page with a revised "Last updated" date.
            </p>
            <p className="text-charcoal/80 mb-8">
              Continued use of the Services constitutes acceptance of the updated Terms.
            </p>

            <hr className="my-12" />

            <h2 className="text-3xl font-bold mb-4 font-sora">17. CONTACT INFORMATION</h2>
            <p className="text-charcoal/80 mb-4">For questions regarding these Terms, please contact:</p>
            <p className="text-lg font-bold text-copper">legal@roomserviceai.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
