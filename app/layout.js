import './globals.css'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
  metadataBase: new URL('https://roomserviceai.com'),
  title: 'RoomService AI | Autonomous Room Service & Guest Ordering',
  description: 'Autonomous room-service ordering for hotels. Capture every call, reduce errors, prevent chargebacks, and turn in-room dining into a reliable revenue stream — without adding staff.',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://roomserviceai.com',
  },
  openGraph: {
    title: 'RoomService AI | Autonomous Room Service & Guest Ordering',
    description: 'Autonomous room-service ordering for hotels. Capture every call, reduce errors, prevent chargebacks, and turn in-room dining into a reliable revenue stream — without adding staff.',
    url: 'https://roomserviceai.com',
    siteName: 'RoomService AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/hero_roomservice.jpg',
        width: 864,
        height: 1184,
        alt: 'RoomService AI — Autonomous Room Service for Hotels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoomService AI | Autonomous Room Service & Guest Ordering',
    description: 'Autonomous room-service ordering for hotels. Capture every call, reduce errors, prevent chargebacks, and turn in-room dining into a reliable revenue stream — without adding staff.',
    images: ['/hero_roomservice.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{
        '--font-cormorant': '"Cormorant Garamond", Georgia, serif',
        '--font-playfair': '"Cormorant Garamond", Georgia, serif',
        '--font-inter': 'Inter, sans-serif',
        '--font-montserrat': 'Montserrat, sans-serif',
        '--font-outfit': 'Outfit, sans-serif',
      }}
    >
      <body>
        {/* Grain overlay texture */}
        <div className="grain-overlay" />
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
