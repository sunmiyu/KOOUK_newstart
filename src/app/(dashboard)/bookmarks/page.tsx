'use client'

import { useState } from 'react'
import AddBookmarkModal from '@/components/ui/AddBookmarkModal'

export default function BookmarksPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  
  const categories = [
    { id: 'all', name: 'All', count: 247 },
    { id: 'tech', name: 'Tech', count: 89 },
    { id: 'design', name: 'Design', count: 56 },
    { id: 'news', name: 'News', count: 34 },
    { id: 'education', name: 'Education', count: 28 },
    { id: 'entertainment', name: 'Entertainment', count: 40 }
  ]

  const handleBookmarkSuccess = (bookmarkData: any) => {
    console.log('새 북마크 추가됨:', bookmarkData)
    // TODO: 실제 북마크 저장 로직 구현
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookmarks</h1>
            <p className="text-gray-600 mt-1">웹에서 발견한 보물들을 수집하세요</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">🔗</span>
            Add Bookmark
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-6 border-b border-gray-200 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`pb-4 border-b-2 transition-colors group ${
              selectedCategory === category.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                selectedCategory === category.id
                  ? 'text-blue-600'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {category.name}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center space-x-2 transition-colors ${
              showFavoritesOnly
                ? 'text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>⭐</span>
            <span className="text-sm">Favorites</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="recent">Recent</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="domain">Domain</option>
          </select>
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Sample bookmarks */}
        {[
          {
            title: "React Official Documentation",
            url: "https://react.dev",
            description: "The official React documentation with hooks, components, and best practices for building modern web applications.",
            domain: "react.dev",
            favicon: "🔷",
            image: "https://react.dev/images/home/conf2021/cover.svg",
            isFavorite: true,
            addedAt: "2 days ago"
          },
          {
            title: "Tailwind CSS Framework",
            url: "https://tailwindcss.com",
            description: "A utility-first CSS framework packed with classes to build any design, directly in your markup.",
            domain: "tailwindcss.com",
            favicon: "🎨",
            image: "https://tailwindcss.com/_next/static/media/social-card-large.a6e71726.jpg",
            isFavorite: false,
            addedAt: "1 week ago"
          },
          {
            title: "Next.js App Router Guide",
            url: "https://nextjs.org/docs",
            description: "Learn about the new App Router in Next.js 13+ with server components and improved routing.",
            domain: "nextjs.org",
            favicon: "⚡",
            image: "https://nextjs.org/static/blog/next-13/twitter-card.png",
            isFavorite: true,
            addedAt: "3 days ago"
          },
          {
            title: "GitHub Copilot Features",
            url: "https://github.com/features/copilot",
            description: "AI pair programmer that helps you write code faster with whole-line and full function suggestions.",
            domain: "github.com",
            favicon: "🐙",
            image: "https://github.blog/wp-content/uploads/2021/06/GitHub-Copilot_blog-header.png?resize=1600%2C850",
            isFavorite: false,
            addedAt: "1 day ago"
          }
        ].map((bookmark, index) => (
          <div 
            key={index} 
            onClick={() => window.open(bookmark.url, '_blank')}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* 실제 썸네일 이미지 */}
            <div className="h-32 bg-gray-100 overflow-hidden">
              {bookmark.image ? (
                <img
                  src={bookmark.image}
                  alt={bookmark.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // 이미지 로드 실패 시 fallback
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon')
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
              ) : null}
              {/* 이미지 로드 실패 시 fallback */}
              <div className={`fallback-icon w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${bookmark.image ? 'hidden' : 'flex'}`}>
                <span className="text-4xl">{bookmark.favicon}</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{bookmark.favicon}</span>
                  <span className="text-xs text-gray-500">{bookmark.domain}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Toggle favorite:', bookmark.title)
                  }}
                  className={`text-sm ${bookmark.isFavorite ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                >
                  ⭐
                </button>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                {bookmark.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {bookmark.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{bookmark.addedAt}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Options for:', bookmark.title)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleBookmarkSuccess}
      />
    </div>
  )
}