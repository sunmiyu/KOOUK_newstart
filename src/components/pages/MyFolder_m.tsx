'use client'

import { useState } from 'react'
import { Folder, ContentItem, CreateContentData } from '@/types/folder'
import { initialFolders } from '@/data/mockData'

// 초기 콘텐츠 (모바일용 간소화)
const initialContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'React 공식 문서',
    type: 'link',
    url: 'https://react.dev',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    metadata: { domain: 'react.dev', platform: 'web' }
  },
  {
    id: '2',
    title: 'Next.js 학습 노트',
    type: 'note',
    content: '# Next.js 14 주요 업데이트\n- App Router 시스템\n- Server Components',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
]

export default function MyFolderMobile() {
  const [folders] = useState<Folder[]>(initialFolders)
  const [selectedFolder, setSelectedFolder] = useState<Folder>(initialFolders[0])
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems)
  const [showFolderDropdown, setShowFolderDropdown] = useState(false)
  const [showAddContent, setShowAddContent] = useState(false)
  const [newContentText, setNewContentText] = useState('')
  
  const folderContent = contentItems.filter(item => item.folder_id === selectedFolder.id)

  // 폴더 상태 아이콘
  const getFolderStatusIcon = (folder: Folder) => {
    switch (folder.shared_status) {
      case 'private': return '🔒'
      case 'shared-synced': return '🌐'
      case 'shared-outdated': return '🔄'
      default: return '🔒'
    }
  }

  // 콘텐츠 타입 아이콘
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'link': return '🌐'
      case 'note': return '📝'
      case 'document': return '📄'
      case 'image': return '📷'
      default: return '📄'
    }
  }

  // 시간 표시
  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'just now'
  }

  // 파일 크기 추정 (더미 데이터)
  const getEstimatedSize = (item: ContentItem) => {
    const baseSizes = { link: 2, note: 1, document: 5, image: 50 }
    const base = baseSizes[item.type as keyof typeof baseSizes] || 1
    const random = Math.floor(Math.random() * 100) + base
    return random > 1000 ? `${Math.round(random/1024)}MB` : `${random}KB`
  }

  // 콘텐츠 추가
  const handleAddContent = () => {
    if (!newContentText.trim()) return

    const newItem: ContentItem = {
      id: Date.now().toString(),
      title: newContentText.includes('http') ? 'New Link' : 'New Note',
      type: newContentText.includes('http') ? 'link' : 'note',
      ...(newContentText.includes('http') ? { url: newContentText } : { content: newContentText }),
      folder_id: selectedFolder.id,
      user_id: 'user1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setContentItems(prev => [newItem, ...prev])
    setNewContentText('')
    setShowAddContent(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* 폴더 선택 드롭다운 */}
          <div className="flex-1 mx-3">
            <button 
              onClick={() => setShowFolderDropdown(!showFolderDropdown)}
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center">
                <span className="mr-2">📁</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {selectedFolder.name}
                </span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showFolderDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* 드롭다운 메뉴 */}
            {showFolderDropdown && (
              <div className="absolute left-4 right-4 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-2">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setSelectedFolder(folder)
                        setShowFolderDropdown(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                        folder.id === selectedFolder.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">📂</span>
                        <div>
                          <p className="text-sm font-medium">{folder.name}</p>
                          <p className="text-xs text-gray-500">
                            {folderContent.length}개 항목
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">{getFolderStatusIcon(folder)}</span>
                        {folder.id === selectedFolder.id && (
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center">
                      <span className="mr-3">+</span>
                      새 폴더 만들기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 콘텐츠 리스트 - 높은 정보 밀도 */}
      <div className="px-4 py-4">
        {folderContent.length > 0 ? (
          <div className="space-y-2">
            {folderContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3">
                {/* 첫 번째 줄: 타입아이콘 + 제목 + 크기 */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="mr-2 text-sm">{getContentIcon(item.type)}</span>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs text-gray-500">{getEstimatedSize(item)}</span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* 두 번째 줄: 설명/도메인 + 시간 */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate">
                    {item.type === 'link' && item.metadata?.domain ? 
                      item.metadata.domain : 
                      item.content ? item.content.slice(0, 50) + '...' : '내용 없음'
                    }
                  </span>
                  <span className="ml-2 whitespace-nowrap">{getTimeAgo(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">폴더가 비어있습니다</h3>
            <p className="text-sm text-gray-600 mb-4">링크, 메모, 파일을 추가해보세요</p>
            <button 
              onClick={() => setShowAddContent(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              첫 번째 콘텐츠 추가
            </button>
          </div>
        )}
      </div>

      {/* 플로팅 추가 버튼 */}
      {!showAddContent && (
        <button
          onClick={() => setShowAddContent(true)}
          className="fixed right-4 bottom-20 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 z-10"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* 전체화면 콘텐츠 추가 */}
      {showAddContent && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="flex flex-col h-full">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button 
                onClick={() => {
                  setShowAddContent(false)
                  setNewContentText('')
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                취소
              </button>
              <h2 className="text-lg font-semibold text-gray-900">콘텐츠 추가</h2>
              <button 
                onClick={handleAddContent}
                disabled={!newContentText.trim()}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                완료
              </button>
            </div>

            {/* 입력 영역 */}
            <div className="flex-1 p-4 pb-8">
              <textarea
                value={newContentText}
                onChange={(e) => setNewContentText(e.target.value)}
                placeholder="링크, 메모, 또는 텍스트를 입력하세요...

예시:
• https://example.com (링크)
• 오늘 배운 것... (메모)"
                className="w-full h-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-base leading-relaxed"
                autoFocus
                style={{
                  fontFamily: 'inherit',
                  fontSize: '16px' // iOS 줌 방지
                }}
              />
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">저장될 폴더:</p>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-2">📁</span>
                  <span className="text-sm font-medium text-gray-900">{selectedFolder.name}</span>
                </div>
              </div>

              {/* 빠른 입력 타입 */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">빠른 추가:</p>
                <div className="grid grid-cols-4 gap-2">
                  <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-xl mb-1">🔗</span>
                    <span className="text-xs text-gray-600">링크</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-xl mb-1">📝</span>
                    <span className="text-xs text-gray-600">메모</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-xl mb-1">📷</span>
                    <span className="text-xs text-gray-600">사진</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <span className="text-xl mb-1">📄</span>
                    <span className="text-xs text-gray-600">문서</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}