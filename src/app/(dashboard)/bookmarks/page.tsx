'use client'

import { useState } from 'react'
import AddBookmarkModal from '@/components/ui/AddBookmarkModal'

export default function BookmarksPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{id: string, name: string} | null>(null)
  
  // 기본 카테고리 (삭제 불가)
  const defaultCategories = [
    { id: 'all', name: 'All', count: 247, isDefault: true },
    { id: 'tech', name: 'Tech', count: 89, isDefault: true },
    { id: 'design', name: 'Design', count: 56, isDefault: true },
    { id: 'news', name: 'News', count: 34, isDefault: true },
    { id: 'education', name: 'Education', count: 28, isDefault: true },
    { id: 'entertainment', name: 'Entertainment', count: 40, isDefault: true }
  ]
  
  // 커스텀 카테고리 (사용자가 추가한 것들)
  const [customCategories, setCustomCategories] = useState([
    { id: 'custom-1', name: '재밌는 사이트', count: 12, isDefault: false },
    { id: 'custom-2', name: '공부할 사이트', count: 8, isDefault: false },
  ])
  
  // 전체 카테고리 목록
  const allCategories = [...defaultCategories, ...customCategories]

  const handleBookmarkSuccess = (bookmarkData: any) => {
    console.log('새 북마크 추가됨:', bookmarkData)
    // TODO: 실제 북마크 저장 로직 구현
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    
    const newCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      count: 0,
      isDefault: false
    }
    
    setCustomCategories(prev => [...prev, newCategory])
    setNewCategoryName('')
    setShowAddCategory(false)
    console.log('새 카테고리 추가됨:', newCategory.name)
  }

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName })
    setShowDeleteConfirm(true)
  }

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return
    
    setCustomCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id))
    
    // 삭제된 카테고리가 현재 선택된 카테고리라면 'all'로 변경
    if (selectedCategory === categoryToDelete.id) {
      setSelectedCategory('all')
    }
    
    console.log('카테고리 삭제됨:', categoryToDelete.name)
    
    // 상태 초기화
    setShowDeleteConfirm(false)
    setCategoryToDelete(null)
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
      <div className="flex items-center space-x-6 border-b border-gray-200 mb-6 overflow-x-auto">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`pb-4 border-b-2 transition-colors group flex-shrink-0 relative ${
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
              
              {/* 커스텀 카테고리에만 삭제 버튼 표시 */}
              {!category.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCategory(category.id, category.name)
                  }}
                  className="ml-1 w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title={`"${category.name}" 카테고리 삭제`}
                >
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </button>
        ))}
        
        {/* 카테고리 추가 버튼 또는 입력창 */}
        {showAddCategory ? (
          <div className="flex items-center space-x-2 pb-4 flex-shrink-0">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory()
                if (e.key === 'Escape') {
                  setShowAddCategory(false)
                  setNewCategoryName('')
                }
              }}
              placeholder="카테고리 이름..."
              className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleAddCategory}
              className="w-6 h-6 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              title="추가"
            >
              ✓
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false)
                setNewCategoryName('')
              }}
              className="w-6 h-6 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
              title="취소"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategory(true)}
            className="pb-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            title="새 카테고리 추가"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        )}
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
            image: "https://picsum.photos/400/200?random=2",
            isFavorite: false,
            addedAt: "1 week ago"
          },
          {
            title: "Next.js App Router Guide",
            url: "https://nextjs.org/docs",
            description: "Learn about the new App Router in Next.js 13+ with server components and improved routing.",
            domain: "nextjs.org",
            favicon: "⚡",
            image: "https://picsum.photos/400/200?random=3",
            isFavorite: true,
            addedAt: "3 days ago"
          },
          {
            title: "GitHub Copilot Features",
            url: "https://github.com/features/copilot",
            description: "AI pair programmer that helps you write code faster with whole-line and full function suggestions.",
            domain: "github.com",
            favicon: "🐙",
            image: "https://picsum.photos/400/200?random=4",
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
        categories={allCategories}
        defaultCategory={selectedCategory !== 'all' ? selectedCategory : 'tech'}
      />

      {/* Delete Category Confirmation Modal */}
      {showDeleteConfirm && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    카테고리 삭제 확인
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    이 작업은 되돌릴 수 없습니다
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  <span className="font-medium text-red-600">"{categoryToDelete.name}"</span> 카테고리를 삭제하시겠습니까?
                </p>
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-red-700">
                      <p className="font-medium mb-1">⚠️ 주의사항</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 이 카테고리의 모든 북마크가 삭제됩니다</li>
                        <li>• 삭제 후 복구할 수 없습니다</li>
                        <li>• 다른 카테고리로 이동되지 않습니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setCategoryToDelete(null)
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}