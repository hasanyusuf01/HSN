import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/hooks/useCart'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: {
    default: 'Luxe Essence — Premium Perfumes',
    template: '%s | Luxe Essence',
  },
  description: 'Discover rare and exquisite fragrances crafted for those who seek the extraordinary.',
  keywords: ['luxury perfume', 'niche fragrance', 'oud', 'oriental perfume', 'premium scents'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Luxe Essence',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
