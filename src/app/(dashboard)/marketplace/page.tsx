'use client'

import { useState } from 'react'

export default function MarketplacePage() {
  const [selectedCollection, setSelectedCollection] = useState<any>(null)
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

  const handleAddToMyFolder = (collection: any) => {
    console.log('컬렉션을 My Folder에 추가:', collection)
    // TODO: My Folder에 추가하는 로직 구현
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


      {/* Main Layout: Left Content + Right Sidebar */}
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category.id
                      ? 'border-gray-500 bg-gray-50 text-gray-800'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {mainSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Essential Dev Tools 2024",
            description: "A comprehensive collection of development tools, VS Code extensions, and productivity apps every developer should know.",
            author: { name: "Alex Chen", avatar: "👨‍💻" },
            stats: { likes: 234, downloads: 1200, views: 5600 },
            category: "Development",
            thumbnail: "💻",
            tags: ["VSCode", "Tools", "Productivity"],
            featured: false
          },
          {
            name: "UI Design Inspiration Hub",
            description: "Beautiful UI designs, color palettes, typography resources, and design system examples from top companies.",
            author: { name: "Sarah Kim", avatar: "👩‍🎨" },
            stats: { likes: 456, downloads: 2100, views: 8900 },
            category: "Design",
            thumbnail: "🎨",
            tags: ["UI", "Design", "Inspiration"],
            featured: true
          },
          {
            name: "Learning React Masterclass",
            description: "From basics to advanced concepts: hooks, context, performance optimization, and real-world project examples.",
            author: { name: "Mike Johnson", avatar: "👨‍🏫" },
            stats: { likes: 189, downloads: 856, views: 3200 },
            category: "Education",
            thumbnail: "📚",
            tags: ["React", "JavaScript", "Tutorial"],
            featured: false
          },
          {
            name: "Startup Growth Hacks",
            description: "Proven strategies, tools, and resources used by successful startups to achieve rapid growth and market penetration.",
            author: { name: "Emma Davis", avatar: "👩‍💼" },
            stats: { likes: 312, downloads: 1800, views: 6700 },
            category: "Business",
            thumbnail: "🚀",
            tags: ["Startup", "Growth", "Marketing"],
            featured: false
          },
          {
            name: "Photography Essentials",
            description: "Camera settings, composition techniques, post-processing tutorials, and gear recommendations for photographers.",
            author: { name: "David Park", avatar: "📸" },
            stats: { likes: 267, downloads: 934, views: 4100 },
            category: "Creative",
            thumbnail: "📷",
            tags: ["Photography", "Tutorial", "Creative"],
            featured: false
          },
          {
            name: "Remote Work Toolkit",
            description: "Apps, systems, and strategies for productive remote work. Communication tools, time management, and team collaboration.",
            author: { name: "Lisa Wang", avatar: "👩‍💻" },
            stats: { likes: 423, downloads: 2700, views: 9100 },
            category: "Productivity",
            thumbnail: "🏠",
            tags: ["Remote", "Productivity", "Tools"],
            featured: true
          }
        ].map((collection, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedCollection(collection)}
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
                  <span className="text-lg">{collection.author.avatar}</span>
                  <span className="text-sm text-gray-600">{collection.author.name}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>❤️ {collection.stats.likes}</span>
                  <span>⬇️ {collection.stats.downloads}</span>
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

        {/* Right Sidebar - Popular Collections */}
        <div className="w-80 flex-shrink-0">
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