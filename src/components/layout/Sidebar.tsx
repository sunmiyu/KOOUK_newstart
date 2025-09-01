'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import AccountMenuModal from '@/components/ui/AccountMenuModal'
import PWAInstallBanner from '@/components/ui/PWAInstallBanner'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
    description: '개인 허브의 중심'
  },
  {
    name: 'My Folder',
    href: '/my-folder',
    icon: '📁',
    description: '개인 정보 관리'
  },
  {
    name: 'Bookmarks',
    href: '/bookmarks',
    icon: '🔖',
    description: '북마크 컬렉션'
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: '🛍️',
    description: '공유 콘텐츠 탐색'
  }
]


export default function Sidebar() {
  const pathname = usePathname()
  const { user, loading, signInWithGoogle } = useAuth()
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const accountButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <aside className="w-64 bg-gray-950 text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-gray-900 text-lg font-bold">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">KOOUK</h1>
            <p className="text-xs text-gray-400">Personal Hub</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg transition-colors group',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className={cn(
                    'text-xs',
                    isActive ? 'text-blue-100' : 'text-gray-400'
                  )}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : user ? (
          <div>
            <button
              ref={accountButtonRef}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setMenuPosition({
                  x: rect.right,
                  y: rect.top
                })
                setShowAccountMenu(true)
              }}
              className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">👤</div>'
                    }
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  👤
                </div>
              )}
              <div className="ml-3 flex-1 text-left">
                <p className="text-sm font-medium truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-400">계정 메뉴</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-medium">👤</span>
              </div>
              <p className="text-sm font-medium">Guest User</p>
              <p className="text-xs text-gray-400">Not signed in</p>
            </div>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        )}
      </div>

      {/* Account Menu Modal */}
      <AccountMenuModal
        isOpen={showAccountMenu}
        onClose={() => setShowAccountMenu(false)}
        userProfilePosition={menuPosition}
      />
    </aside>
  )
}