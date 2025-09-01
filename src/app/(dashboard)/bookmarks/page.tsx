'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/useMediaQuery'
import BookmarksMobile from '@/components/pages/Bookmarks_m'
import AddBookmarkModal from '@/components/ui/AddBookmarkModal'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Bookmark, BookmarkFormData } from '@/types/common'

export default function BookmarksPage() {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<{id: string, name: string} | null>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  
  // 실제 북마크 데이터 상태
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  
  // 동적 카테고리 카운트 계산
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return bookmarks.length
    }
    return bookmarks.filter(bookmark => bookmark.category === categoryId).length
  }

  // 기본 카테고리 (삭제 불가)
  const defaultCategories = [
    { id: 'all', name: 'All', count: getCategoryCount('all'), isDefault: true },
    { id: 'tech', name: 'Tech', count: getCategoryCount('tech'), isDefault: true },
    { id: 'design', name: 'Design', count: getCategoryCount('design'), isDefault: true },
    { id: 'news', name: 'News', count: getCategoryCount('news'), isDefault: true },
    { id: 'education', name: 'Education', count: getCategoryCount('education'), isDefault: true },
    { id: 'entertainment', name: 'Entertainment', count: getCategoryCount('entertainment'), isDefault: true }
  ]
  
  // 커스텀 카테고리 (사용자가 추가한 것들) - 동적 카운트 적용
  const [customCategories, setCustomCategories] = useState([
    { id: 'custom-1', name: '개발 도구', isDefault: false },
    { id: 'custom-2', name: '유튜브 채널', isDefault: false },
  ])
  
  // 전체 카테고리 목록 (동적 카운트 포함)
  const allCategories = [
    ...defaultCategories,
    ...customCategories.map(cat => ({
      ...cat,
      count: getCategoryCount(cat.id)
    }))
  ]

  // 북마크 로드
  const loadBookmarks = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('북마크 로드 실패:', error)
        return
      }
      
      setBookmarks(data || [])
    } catch (error) {
      console.error('북마크 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트시 북마크 로드
  useEffect(() => {
    if (user) {
      loadBookmarks()
    }
  }, [user])

  const handleBookmarkSuccess = async (bookmarkData: BookmarkFormData) => {
    if (!user) return
    
    try {
      // Supabase에 저장
      // @ts-expect-error: Supabase 타입 불일치 임시 처리
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          title: bookmarkData.title,
          url: bookmarkData.url,
          description: bookmarkData.description || null,
          category: bookmarkData.category,
          user_id: user.id,
          thumbnail: bookmarkData.image || null,
          favicon: '🌐', // 기본 파비콘
          is_favorite: false,
          tags: [],
          metadata: {
            domain: bookmarkData.domain,
            platform: bookmarkData.platform || 'web'
          }
        })
        .select()
        .single()
      
      if (error) {
        console.error('북마크 저장 실패:', error)
        return
      }
      
      // 로컬 상태 업데이트 (맨 앞에 추가)
      setBookmarks(prev => [data, ...prev])
      
      console.log('새 북마크 추가됨:', data)
    } catch (error) {
      console.error('북마크 저장 오류:', error)
    }
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    
    const newCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
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

  const handleStartEditingCategory = (categoryId: string, categoryName: string) => {
    setEditingCategoryId(categoryId)
    setEditingCategoryName(categoryName)
  }

  const handleSaveEditingCategory = () => {
    if (!editingCategoryName.trim()) return

    setCustomCategories(prev => 
      prev.map(cat => 
        cat.id === editingCategoryId 
          ? { ...cat, name: editingCategoryName.trim() }
          : cat
      )
    )

    setEditingCategoryId(null)
    setEditingCategoryName('')
    console.log('카테고리명 수정됨:', editingCategoryName)
  }

  const handleCancelEditingCategory = () => {
    setEditingCategoryId(null)
    setEditingCategoryName('')
  }

  // 모바일에서는 전용 컴포넌트 사용
  if (isMobile) {
    return <BookmarksMobile />
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
              {editingCategoryId === category.id ? (
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEditingCategory()
                    } else if (e.key === 'Escape') {
                      handleCancelEditingCategory()
                    }
                  }}
                  onBlur={handleSaveEditingCategory}
                  className="text-sm font-medium bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-20"
                  autoFocus
                />
              ) : (
                <span className={`text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'text-blue-600'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {category.name}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
              
              {/* 커스텀 카테고리에만 편집/삭제 버튼 표시 */}
              {!category.isDefault && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartEditingCategory(category.id, category.name)
                    }}
                    className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                    title={`"${category.name}" 카테고리명 수정`}
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCategory(category.id, category.name)
                    }}
                    className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    title={`"${category.name}" 카테고리 삭제`}
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">북마크를 불러오는 중...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks
            .filter(bookmark => {
              // 카테고리 필터링
              if (selectedCategory !== 'all' && bookmark.category !== selectedCategory) {
                return false
              }
              
              // 즐겨찾기 필터링
              if (showFavoritesOnly && !bookmark.is_favorite) {
                return false
              }
              
              // 검색 필터링
              if (searchTerm) {
                const searchLower = searchTerm.toLowerCase()
                return (
                  bookmark.title.toLowerCase().includes(searchLower) ||
                  bookmark.description?.toLowerCase().includes(searchLower) ||
                  bookmark.url.toLowerCase().includes(searchLower)
                )
              }
              
              return true
            })
            .map((bookmark) => (
              <div 
                key={bookmark.id} 
                onClick={() => window.open(bookmark.url, '_blank')}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* 썸네일 이미지 */}
                <div className="h-32 bg-gray-100 overflow-hidden">
                  {bookmark.thumbnail ? (
                    <Image
                      src={bookmark.thumbnail}
                      alt={bookmark.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // 이미지 로드 실패 시 fallback
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement?.parentElement?.querySelector('.fallback-icon')
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  {/* 이미지 로드 실패 시 fallback */}
                  <div className={`fallback-icon w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${bookmark.thumbnail ? 'hidden' : 'flex'}`}>
                    <span className="text-4xl">{bookmark.favicon || '🌐'}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{bookmark.favicon || '🌐'}</span>
                      <span className="text-xs text-gray-500">{bookmark.metadata?.domain || new URL(bookmark.url).hostname}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: 즐겨찾기 토글 기능 구현
                        console.log('Toggle favorite:', bookmark.title)
                      }}
                      className={`text-sm ${bookmark.is_favorite ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                    >
                      ⭐
                    </button>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                    {bookmark.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {bookmark.description || '설명이 없습니다'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
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
          
          {/* 북마크가 없을 때 표시 */}
          {bookmarks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-lg font-medium mb-2">아직 북마크가 없습니다</h3>
              <p className="text-sm text-center mb-4">
                &quot;Add Bookmark&quot; 버튼을 클릭하여<br />
                첫 번째 북마크를 추가해보세요
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">🔗</span>
                첫 북마크 추가하기
              </button>
            </div>
          )}
        </div>
      )}


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
                  <span className="font-medium text-red-600">&quot;{categoryToDelete.name}&quot;</span> 카테고리를 삭제하시겠습니까?
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