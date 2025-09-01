import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'KOOUK - Personal Digital Storage',
    template: '%s | KOOUK'
  },
  description: 'Easy Easy Super Easy, Notion을 대신하는 개인 Storage. 북마크, 폴더, 마켓플레이스에서 디지털 콘텐츠를 효율적으로 관리하세요.',
  keywords: ['storage', 'bookmark', 'folder', 'personal', 'digital', 'notion', 'alternative', '개인저장소', '북마크관리'],
  authors: [{ name: 'KOOUK Team' }],
  creator: 'KOOUK Team',
  publisher: 'KOOUK',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://koouk.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://koouk.vercel.app',
    siteName: 'KOOUK',
    title: 'KOOUK - Personal Digital Storage',
    description: 'Easy Easy Super Easy, Notion을 대신하는 개인 Storage. 북마크, 폴더, 마켓플레이스에서 디지털 콘텐츠를 효율적으로 관리하세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KOOUK - Personal Digital Storage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KOOUK - Personal Digital Storage',
    description: 'Easy Easy Super Easy, Notion을 대신하는 개인 Storage',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}