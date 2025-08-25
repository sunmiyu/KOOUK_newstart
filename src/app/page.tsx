'use client'

import LoginButton from '@/components/ui/LoginButton'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="text-white text-2xl font-bold">K</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to KOOUK
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Your personal digital life manager. Organize folders, save bookmarks, 
          and discover amazing content shared by our community.
        </p>
        
        <div className="flex justify-center mb-16">
          <LoginButton size="lg" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">📁</div>
            <h3 className="font-semibold mb-2">My Folder</h3>
            <p className="text-sm text-gray-600">
              Organize your digital content in smart folders. Links, notes, images - everything in one place.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🔖</div>
            <h3 className="font-semibold mb-2">Bookmarks</h3>
            <p className="text-sm text-gray-600">
              Save websites instantly. Auto-categorization and smart search make finding things effortless.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-4">🛍️</div>
            <h3 className="font-semibold mb-2">Marketplace</h3>
            <p className="text-sm text-gray-600">
              Discover and import curated content collections shared by our community.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Simple. Fast. Intuitive.
          </h3>
          <p className="text-gray-600 mb-8">
            No complex setup, no learning curve. Start organizing your digital life in seconds.
          </p>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>✓ Free to use</span>
            <span>✓ No downloads</span>
            <span>✓ Works everywhere</span>
          </div>
        </div>
      </div>
    </div>
  )
}