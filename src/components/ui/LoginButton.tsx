'use client'

import { useAuth } from '@/hooks/useAuth'
import Button from './Button'
import Image from 'next/image'

interface LoginButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  redirectTo?: string
}

export default function LoginButton({ 
  variant = 'primary', 
  size = 'md',
  className,
  redirectTo = '/dashboard'
}: LoginButtonProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full mr-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  const div = document.createElement('div')
                  div.className = 'w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs mr-2'
                  div.innerHTML = '👤'
                  parent.insertBefore(div, e.currentTarget.nextSibling)
                }
              }}
              unoptimized
            />
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
              👤
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs text-gray-500">Signed in</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size={size}
          onClick={signOut}
          isLoading={loading}
          className={className}
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={signInWithGoogle}
      isLoading={loading}
      className={className}
      leftIcon={
        <svg className="w-4 h-4" viewBox="0 0 24 24">
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
      }
    >
      Continue with Google
    </Button>
  )
}