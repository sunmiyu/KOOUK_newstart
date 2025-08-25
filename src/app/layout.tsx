import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KOOUK - Personal Digital Storage',
  description: 'Easy Easy Super Easy, Notion을 대신하는 개인 Storage',
  keywords: ['storage', 'bookmark', 'folder', 'personal', 'digital'],
  authors: [{ name: 'KOOUK Team' }],
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
      <body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}