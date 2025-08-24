'use client'

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg font-bold">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KOOUK</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              🏠 Dashboard
            </Link>
            <Link 
              href="/my-folder"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              📁 My Folder
            </Link>
            <Link 
              href="/bookmarks"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              🔖 Bookmarks
            </Link>
            <Link 
              href="/marketplace"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              🛍️ Marketplace
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              🔍
            </Button>
            <Button variant="ghost" size="sm">
              🔔
            </Button>
            <Button size="sm">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                🏠 Dashboard
              </Link>
              <Link 
                href="/my-folder"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                📁 My Folder
              </Link>
              <Link 
                href="/bookmarks"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                🔖 Bookmarks
              </Link>
              <Link 
                href="/marketplace"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                🛍️ Marketplace
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Button size="sm" className="w-full">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}