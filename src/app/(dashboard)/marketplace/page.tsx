'use client'

import { useState } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import MarketplaceMobile from '@/components/pages/Marketplace_m'
import { MarketplaceCollection } from '@/types/common'

export default function MarketplacePage() {
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  
  const categories = [
    { id: 'all', name: 'All', count: 1247 },
    { id: 'productivity', name: 'Productivity', count: 234 },
    { id: 'design', name: 'Design', count: 189 },
    { id: 'development', name: 'Development', count: 156 },
    { id: 'education', name: 'Education', count: 123 },
    { id: 'resources', name: 'Resources', count: 98 }
  ]

  const mainSortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'category', label: 'By Category' }
  ]

  const popularOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'downloads', label: 'Most Downloads' },
    { value: 'likes', label: 'Most Liked' }
  ]

  const handleAddToMyFolder = (collection: MarketplaceCollection) => {
    console.log('컬렉션을 My Folder에 추가:', collection)
  }

  // 모바일에서는 전용 컴포넌트 사용
  if (isMobile) {
    return <MarketplaceMobile />
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">집단 지성의 보물창고에서 큐레이션된 콘텐츠를 발견하세요</p>
        </div>
      </div>


      {/* Category Tabs - Bookmarks와 동일한 스타일 */}
      <div className="flex items-center space-x-6 border-b border-gray-200 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`pb-4 border-b-2 transition-colors group flex-shrink-0 ${
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

      {/* Search and Filters - Bookmarks와 동일한 위치 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            {mainSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout: 3개 카드 + 오른쪽 패널 = 4개 카드 느낌 */}
      <div className="lg:flex lg:gap-6">
        {/* Main Content - 카드 3개, Bookmarks 4개 카드와 동일한 너비감 */}
        <div className="lg:flex-1">
          {/* Collections Grid - 3개 카드 (xl에서) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {[
          {
            id: "1",
            name: "Essential Dev Tools 2024",
            description: "A comprehensive collection of development tools, VS Code extensions, and productivity apps every developer should know.",
            author: "Alex Chen",
            downloads: 1200,
            likes: 234,
            views: 5600,
            category: "Development",
            created_at: "2024-01-15",
            items_count: 25,
            thumbnail: "💻",
            tags: ["VSCode", "Tools", "Productivity"],
            featured: false
          },
          {
            id: "2",
            name: "UI Design Inspiration Hub",
            description: "Beautiful UI designs, color palettes, typography resources, and design system examples from top companies.",
            author: "Sarah Kim",
            downloads: 2100,
            likes: 456,
            views: 8900,
            category: "Design",
            created_at: "2024-01-12",
            items_count: 42,
            thumbnail: "🎨",
            tags: ["UI", "Design", "Inspiration"],
            featured: true
          },
          {
            id: "3",
            name: "Learning React Masterclass",
            description: "From basics to advanced concepts: hooks, context, performance optimization, and real-world project examples.",
            author: "Mike Johnson",
            downloads: 856,
            likes: 189,
            views: 3200,
            category: "Education",
            created_at: "2024-01-10",
            items_count: 18,
            thumbnail: "📚",
            tags: ["React", "JavaScript", "Tutorial"],
            featured: false
          },
          {
            id: "4",
            name: "Startup Growth Hacks",
            description: "Proven strategies, tools, and resources used by successful startups to achieve rapid growth and market penetration.",
            author: "Emma Davis",
            downloads: 1800,
            likes: 312,
            views: 6700,
            category: "Business",
            created_at: "2024-01-08",
            items_count: 35,
            thumbnail: "🚀",
            tags: ["Startup", "Growth", "Marketing"],
            featured: false
          },
          {
            id: "5",
            name: "Photography Essentials",
            description: "Camera settings, composition techniques, post-processing tutorials, and gear recommendations for photographers.",
            author: "David Park",
            downloads: 934,
            likes: 267,
            views: 4100,
            category: "Creative",
            created_at: "2024-01-05",
            items_count: 28,
            thumbnail: "📷",
            tags: ["Photography", "Tutorial", "Creative"],
            featured: false
          },
          {
            id: "6",
            name: "Remote Work Toolkit",
            description: "Apps, systems, and strategies for productive remote work. Communication tools, time management, and team collaboration.",
            author: "Lisa Wang",
            downloads: 2700,
            likes: 423,
            views: 9100,
            category: "Productivity",
            created_at: "2024-01-03",
            items_count: 31,
            thumbnail: "🏠",
            tags: ["Remote", "Productivity", "Tools"],
            featured: true
          }
        ].map((collection, index) => (
          <div 
            key={index} 
            onClick={() => console.log('Selected collection:', collection)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {collection.featured && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-medium px-3 py-1 text-center">
                ⭐ Featured
              </div>
            )}
            
            {/* Thumbnail */}
            <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <span className="text-5xl">{collection.thumbnail}</span>
            </div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded">
                  {collection.category}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Like toggled:', collection.name)
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                {collection.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {collection.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {collection.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">👤</span>
                  <span className="text-sm text-gray-600">{collection.author}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>❤️ {collection.likes}</span>
                  <span>⬇️ {collection.downloads}</span>
                </div>
              </div>

              {/* Price and Add Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-green-600">FREE</span>
                  {/* 향후 유료 버전을 위한 주석 처리된 가격 표시 */}
                  {/* <span className="text-lg font-semibold text-gray-900">$19</span> */}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToMyFolder(collection)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add to My Folder
                </button>
              </div>
            </div>
          </div>
        ))}
          </div>
        </div>

        {/* Right Sidebar - Bookmarks 4번째 카드 위치에 해당하는 패널 */}
        <div className="hidden xl:block w-72 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              Popular Collections
            </h3>
            
            {/* Popular Tabs */}
            <div className="flex flex-col space-y-2 mb-6">
              {popularOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === option.value
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* Mini Popular List */}
            <div className="space-y-4">
              {[
                { name: "UI Design System", downloads: 2100, likes: 456, thumbnail: "🎨" },
                { name: "Remote Work Tools", downloads: 1800, likes: 312, thumbnail: "🏠" },
                { name: "Dev Tools 2024", downloads: 1200, likes: 234, thumbnail: "💻" },
                { name: "React Resources", downloads: 856, likes: 189, thumbnail: "📚" },
                { name: "Photography Guide", downloads: 934, likes: 267, thumbnail: "📷" }
              ].slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className="text-2xl">{item.thumbnail}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                      <span>⬇️ {item.downloads}</span>
                      <span>❤️ {item.likes}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">#{index + 1}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => console.log('View all popular')}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
              >
                View All Popular →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}