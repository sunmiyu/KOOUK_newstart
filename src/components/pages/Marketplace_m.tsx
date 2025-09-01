'use client'

import { useState } from 'react'

interface MarketplaceItem {
  id: string
  title: string
  description: string
  author: string
  author_avatar?: string
  category: string
  price: number
  cover_image?: string
  likes: number
  downloads: number
  views: number
  tags: string[]
  created_at: string
  is_featured: boolean
}

const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    title: '🚀 React 마스터 컬렉션',
    description: 'React 개발에 필요한 모든 리소스와 예제 코드를 모았습니다. 초급자부터 고급자까지!',
    author: '코딩애플',
    author_avatar: '/api/placeholder/40/40',
    category: 'tech',
    price: 0,
    cover_image: '/api/placeholder/400/240',
    likes: 1247,
    downloads: 3421,
    views: 8932,
    tags: ['React', 'JavaScript', 'Frontend'],
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
    is_featured: true
  },
  {
    id: '2',
    title: '🎨 UI/UX 디자인 킷 Pro',
    description: '실무에서 바로 사용할 수 있는 모던 UI 컴포넌트와 디자인 시스템',
    author: '디자인구루',
    author_avatar: '/api/placeholder/40/40',
    category: 'design',
    price: 4.99,
    cover_image: '/api/placeholder/400/240',
    likes: 856,
    downloads: 2103,
    views: 5670,
    tags: ['UI/UX', 'Figma', 'Design System'],
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
    is_featured: true
  },
  {
    id: '3',
    title: '📚 웹 개발 학습 로드맵',
    description: '체계적인 웹 개발 학습을 위한 단계별 가이드와 실습 프로젝트',
    author: '개발멘토',
    author_avatar: '/api/placeholder/40/40',
    category: 'education',
    price: 0,
    cover_image: '/api/placeholder/400/240',
    likes: 2341,
    downloads: 5678,
    views: 12450,
    tags: ['웹개발', '로드맵', '학습'],
    created_at: new Date(Date.now() - 14400000).toISOString(), // 4시간 전
    is_featured: false
  },
  {
    id: '4',
    title: '💼 스타트업 비즈니스 템플릿',
    description: '사업계획서부터 피치덱까지, 스타트업에 필요한 모든 문서 템플릿',
    author: '비즈니스멘토',
    category: 'business',
    price: 9.99,
    cover_image: '/api/placeholder/400/240',
    likes: 567,
    downloads: 1234,
    views: 3456,
    tags: ['스타트업', '비즈니스', '템플릿'],
    created_at: new Date(Date.now() - 28800000).toISOString(), // 8시간 전
    is_featured: false
  },
  {
    id: '5',
    title: '🎯 마케팅 전략 워크시트',
    description: '디지털 마케팅 전략 수립을 위한 실무 중심 워크시트와 체크리스트',
    author: '마케팅전문가',
    category: 'marketing',
    price: 2.99,
    cover_image: '/api/placeholder/400/240',
    likes: 423,
    downloads: 891,
    views: 2340,
    tags: ['마케팅', '전략', '디지털'],
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    is_featured: false
  }
]

const categories = [
  { id: 'all', name: '전체', count: 5 },
  { id: 'trending', name: '🔥 인기', count: 3 },
  { id: 'tech', name: '기술', count: 1 },
  { id: 'design', name: '디자인', count: 1 },
  { id: 'free', name: '무료', count: 2 },
  { id: 'paid', name: '유료', count: 3 }
]

export default function MarketplaceMobile() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('trending') // trending, latest, popular
  
  // 필터링 및 정렬된 아이템
  const getFilteredAndSortedItems = () => {
    let filtered = mockMarketplaceItems.filter(item => {
      const categoryMatch = 
        selectedCategory === 'all' || 
        selectedCategory === 'trending' && item.is_featured ||
        selectedCategory === 'free' && item.price === 0 ||
        selectedCategory === 'paid' && item.price > 0 ||
        item.category === selectedCategory
      
      const searchMatch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return categoryMatch && searchMatch
    })

    // 정렬
    switch (sortBy) {
      case 'latest':
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'popular':
        return filtered.sort((a, b) => b.downloads - a.downloads)
      case 'trending':
      default:
        return filtered.sort((a, b) => (b.likes + b.downloads) - (a.likes + a.downloads))
    }
  }

  const filteredItems = getFilteredAndSortedItems()

  // 시간 표시
  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}일 전`
    if (hours > 0) return `${hours}시간 전`
    return '방금 전'
  }

  // 숫자 포매팅 (1234 → 1.2K)
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900">🛍️ 마켓플레이스</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 검색바 */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="템플릿, 리소스 검색..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* 카테고리 탭 + 정렬 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center overflow-x-auto space-x-2 flex-1 mr-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* 정렬 드롭다운 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="trending">인기순</option>
            <option value="latest">최신순</option>
            <option value="popular">다운로드순</option>
          </select>
        </div>
      </div>

      {/* 마켓플레이스 아이템 리스트 */}
      <div className="px-4 py-4">
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* 커버 이미지 */}
                <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-4xl">{item.category === 'tech' ? '💻' : item.category === 'design' ? '🎨' : '📚'}</span>
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                      🔥 HOT
                    </div>
                  )}
                  {item.price > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                      ${item.price}
                    </div>
                  )}
                  {item.price === 0 && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                      FREE
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* 제목 + 가격 */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* 설명 */}
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                    {item.description}
                  </p>

                  {/* 작성자 + 통계 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs">👤</span>
                      </div>
                      <span className="text-xs text-gray-600">{item.author}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{formatNumber(item.likes)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>{formatNumber(item.downloads)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{item.tags.length - 3}</span>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(item.created_at)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 font-medium">
                        💾 내 폴더에 추가
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-sm text-gray-600">다른 검색어나 카테고리를 시도해보세요</p>
          </div>
        )}
      </div>

      {/* 플로팅 공유 버튼 */}
      <button className="fixed right-4 bottom-20 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 z-10">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
      </button>
    </div>
  )
}