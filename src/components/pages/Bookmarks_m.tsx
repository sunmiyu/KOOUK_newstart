'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  category: string
  thumbnail?: string
  domain: string
  created_at: string
  is_favorite: boolean
  likes: number
  tags: string[]
}

const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'React - 웹과 네이티브 사용자 인터페이스를 위한 라이브러리',
    url: 'https://react.dev',
    description: '컴포넌트에서 전체 앱까지, React로 빌드하세요',
    category: 'tech',
    thumbnail: '/api/placeholder/300/200',
    domain: 'react.dev',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
    is_favorite: true,
    likes: 24,
    tags: ['React', 'Frontend', 'JavaScript']
  },
  {
    id: '2',
    title: 'Figma 디자인 시스템 완벽 가이드',
    url: 'https://figma.com/design-systems',
    description: '일관성 있는 디자인을 위한 체계적 접근법',
    category: 'design',
    thumbnail: '/api/placeholder/300/200',
    domain: 'figma.com',
    created_at: new Date(Date.now() - 14400000).toISOString(), // 4시간 전
    is_favorite: false,
    likes: 156,
    tags: ['Figma', 'Design System', 'UI/UX']
  },
  {
    id: '3',
    title: 'AI가 바꾸는 웹 개발의 미래',
    url: 'https://techcrunch.com/ai-web-dev',
    description: 'ChatGPT와 GitHub Copilot이 개발자에게 미치는 영향',
    category: 'news',
    thumbnail: '/api/placeholder/300/200',
    domain: 'techcrunch.com',
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12시간 전
    is_favorite: true,
    likes: 89,
    tags: ['AI', 'WebDev', 'Future']
  },
  {
    id: '4',
    title: 'Next.js 14 App Router 마이그레이션 가이드',
    url: 'https://nextjs.org/docs/app',
    description: 'Pages Router에서 App Router로 안전하게 이전하기',
    category: 'tech',
    domain: 'nextjs.org',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    is_favorite: false,
    likes: 67,
    tags: ['Next.js', 'Migration', 'React']
  },
  {
    id: '5',
    title: '2024 UI/UX 디자인 트렌드',
    url: 'https://medium.com/design-trends-2024',
    description: '올해 주목해야 할 디자인 트렌드와 실무 적용법',
    category: 'design',
    thumbnail: '/api/placeholder/300/200',
    domain: 'medium.com',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2일 전
    is_favorite: true,
    likes: 203,
    tags: ['Design', 'Trend', '2024']
  }
]

const categories = [
  { id: 'all', name: '전체', count: 5 },
  { id: 'tech', name: '기술', count: 2 },
  { id: 'design', name: '디자인', count: 2 },
  { id: 'news', name: '뉴스', count: 1 },
  { id: 'entertainment', name: '엔터', count: 0 }
]

export default function BookmarksMobile() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddBookmark, setShowAddBookmark] = useState(false)
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks)
  
  // 필터링된 북마크
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const categoryMatch = selectedCategory === 'all' || bookmark.category === selectedCategory
    const favoriteMatch = !showFavoritesOnly || bookmark.is_favorite
    const searchMatch = searchQuery === '' || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && favoriteMatch && searchMatch
  })

  // 북마크 추가
  const handleAddBookmark = () => {
    if (!newBookmarkUrl.trim()) return
    
    // URL에서 도메인 추출
    const getDomain = (url: string) => {
      try {
        return new URL(url).hostname
      } catch {
        return 'unknown'
      }
    }
    
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: '새 북마크', // 실제로는 메타데이터 API로 제목 가져올 예정
      url: newBookmarkUrl,
      description: '북마크 설명이 여기에 표시됩니다',
      category: selectedCategory === 'all' ? 'tech' : selectedCategory,
      domain: getDomain(newBookmarkUrl),
      created_at: new Date().toISOString(),
      is_favorite: false,
      likes: 0,
      tags: ['새로추가']
    }
    
    setBookmarks(prev => [newBookmark, ...prev])
    setNewBookmarkUrl('')
    setShowAddBookmark(false)
  }

  // 시간 표시
  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}일 전`
    if (hours > 0) return `${hours}시간 전`
    return '방금 전'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900">🔖 북마크</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-blue-600 hover:text-blue-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 검색바 */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="북마크 검색..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* 카테고리 탭 + 즐겨찾기 필터 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center overflow-x-auto space-x-1 flex-1 mr-4">
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
                {category.name} ({category.count})
              </button>
            ))}
          </div>
          
          {/* 즐겨찾기 필터 */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-2 rounded-lg transition-colors ${
              showFavoritesOnly 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 북마크 리스트 */}
      <div className="px-4 py-4">
        {filteredBookmarks.length > 0 ? (
          <div className="space-y-3">
            {filteredBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-3">
                  {/* 썸네일 + 제목 + 좋아요 */}
                  <div className="flex items-start space-x-3 mb-2">
                    {bookmark.thumbnail && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-2xl">🌐</span>
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {bookmark.title}
                      </h3>
                      {bookmark.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {bookmark.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmark.is_favorite 
                            ? 'text-yellow-500 bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 도메인 + 카테고리 + 시간 + 액션 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <span>{bookmark.domain}</span>
                      <span>•</span>
                      <span className="capitalize">{bookmark.category}</span>
                      <span>•</span>
                      <span>{getTimeAgo(bookmark.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{bookmark.likes}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 태그 */}
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bookmark.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {bookmark.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{bookmark.tags.length - 3}</span>
                      )}
                    </div>
                  )}
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
            <p className="text-sm text-gray-600">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>

      {/* 플로팅 추가 버튼 */}
      {!showAddBookmark && (
        <button
          onClick={() => setShowAddBookmark(true)}
          className="fixed right-4 bottom-20 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 z-10"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* 북마크 추가 모달 */}
      {showAddBookmark && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="flex flex-col h-full">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button 
                onClick={() => {
                  setShowAddBookmark(false)
                  setNewBookmarkUrl('')
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                취소
              </button>
              <h2 className="text-lg font-semibold text-gray-900">북마크 추가</h2>
              <button 
                onClick={handleAddBookmark}
                disabled={!newBookmarkUrl.trim()}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                저장
              </button>
            </div>

            {/* 입력 영역 */}
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                웹사이트 URL
              </label>
              <input
                type="url"
                value={newBookmarkUrl}
                onChange={(e) => setNewBookmarkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                style={{ fontSize: '16px' }} // iOS 줌 방지
              />
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">카테고리:</p>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-2">📁</span>
                  <span className="text-sm font-medium text-gray-900">
                    {categories.find(c => c.id === selectedCategory)?.name || '전체'}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 팁</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• URL을 붙여넣으면 자동으로 제목과 설명을 가져옵니다</li>
                  <li>• 카테고리는 현재 선택된 필터를 따릅니다</li>
                  <li>• 나중에 즐겨찾기로 설정할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}