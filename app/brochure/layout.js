import { Outfit, Inter } from 'next/font/google';
import SmoothScroll from '@/components/brochure/SmoothScroll';

// Load Google Fonts
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Brochure Layout
 * Wraps the brochure page with smooth scroll and custom fonts
 */
export const metadata = {
  title: 'RoomService AI - Transform Room Service Into Your Most Profitable Channel',
  description: 'AI-powered voice and chat ordering that delivers 60-75% profit margins while reducing labor costs by 94-98%',
};

export default function BrochureLayout({ children }) {
  return (
    <div className={`${outfit.variable} ${inter.variable}`}>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </div>
  );
}
