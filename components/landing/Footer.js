import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-charcoal-dark text-white border-t border-gray-800 pt-8 md:pt-12 lg:pt-16 pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-gray-800">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
              <Image
                src="/Untitled (7).png"
                alt="GDPR-Aligned"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-white mb-1">GDPR-Aligned</h4>
            <p className="text-xs text-gray-400">Data Protection</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
              <Image
                src="/Untitled (8).png"
                alt="Enterprise-Grade Security"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-white mb-1">Enterprise-Grade</h4>
            <p className="text-xs text-gray-400">Security</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
              <Image
                src="/Untitled (9).png"
                alt="Privacy-First Design"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-white mb-1">Privacy-First</h4>
            <p className="text-xs text-gray-400">Design</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 flex items-center justify-center">
              <Image
                src="/Untitled (10).png"
                alt="Built for Global Hospitality"
                width={64}
                height={64}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
            <h4 className="text-xs md:text-sm font-bold text-white mb-1">Built for Global</h4>
            <p className="text-xs text-gray-400">Hospitality</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl md:text-2xl font-bold font-playfair tracking-tight text-white mb-3 md:mb-4 block">
              RoomService<span className="text-copper">AI</span>
            </span>
            <p className="text-sm md:text-base text-gray-400 max-w-sm mb-4 md:mb-6">
              The first autonomous voice agent designed exclusively for 4 & 5-star hospitality.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              © 2026 RoomService AI
              <br />
              Technology licensed by RoomService AI IP Ltd (Ireland)
              <br />
              Commercial operations provided by RoomService AI Inc (Delaware, USA)
            </p>
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-copper mb-4 md:mb-6">
              Product
            </h4>
            <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm">
              <li>
                <Link href="/capabilities" className="hover:text-white transition">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link href="/integration-partners" className="hover:text-white transition">
                  Integration Partners
                </Link>
              </li>
              <li>
                <Link href="/revenue-protection" className="hover:text-white transition">
                  Revenue Protection
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/roi" className="hover:text-white transition">
                  ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition">
                  Live Demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-copper mb-4 md:mb-6">
              Company
            </h4>
            <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 mb-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
              <Link href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/cookie-policy" className="hover:text-white transition">
                Cookie Policy
              </Link>
              <button className="hover:text-white transition">
                Cookie Preferences
              </button>
              <Link href="/terms-of-service" className="hover:text-white transition">
                Terms of Service
              </Link>
            </div>
            <div className="flex space-x-6">
              <span>Ireland (HQ)</span>
              <span>UK</span>
              <span>USA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
