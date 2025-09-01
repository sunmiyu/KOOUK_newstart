'use client'

import { useState, lazy, Suspense } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import ContentInput from '@/components/ui/ContentInput'
import ContentCard from '@/components/ui/ContentCard'
import ContentCardMobile from '@/components/ui/ContentCard_m'
import { Folder, CreateContentData, ContentItem, UserUsage, UserPlan, PLAN_LIMITS, ShareOptions } from '@/types/folder'
import { FolderSharingService } from '@/services/folderSharing'
import { StorageCalculator } from '@/utils/storageCalculation'

// 지연 로딩 컴포넌트들 (번들 크기 최적화)
const ShareFolderModal = lazy(() => import('@/components/ui/ShareFolderModal'))
const DeleteFolderModal = lazy(() => import('@/components/ui/DeleteFolderModal'))
const BigNoteModal = lazy(() => import('@/components/ui/BigNoteModal'))
const UpgradeModal = lazy(() => import('@/components/ui/UpgradeModal'))

// 간단한 초기 폴더 데이터 (대용량 데이터는 dynamic import)
const initialFolders: Folder[] = [
  {
    id: '1',
    name: 'React 개발 자료',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    item_count: 2,
    shared_status: 'private'
  },
  {
    id: '2',
    name: '맛집 & 여행',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    item_count: 2,
    shared_status: 'shared-synced'
  }
]

// 최소화된 예시 콘텐츠 (번들 크기 최적화)
const initialContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'React 공식 문서',
    type: 'link',
    url: 'https://react.dev',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Next.js 학습 노트',
    type: 'note',
    content: '# Next.js 14\n- App Router\n- Server Components',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function MyFolderPage() {
  const isMobile = useIsMobile()
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [selectedFolder, setSelectedFolder] = useState<Folder>({
    ...initialFolders[0],
    shared_status: 'shared-synced'
  })
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null)
  const [folderStatuses, setFolderStatuses] = useState<Record<string, Folder['shared_status']>>({
    '1': 'private',
    '2': 'shared-synced'
  })
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'storage' | 'folders' | 'marketplace' | 'paid_selling'>('folders')
  const [showNewFolderPrompt, setShowNewFolderPrompt] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showBigNoteModal, setShowBigNoteModal] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')
  
  // 임시 사용자 사용량 데이터 (실제로는 API에서 가져와야 함)
  const [userUsage] = useState<UserUsage>({
    user_id: 'user1',
    plan: 'free' as UserPlan,
    current_storage_mb: 850, // 85% 사용
    current_folders: 18,     // 90% 사용
    current_marketplace_folders: 4, // 80% 사용
    limits: PLAN_LIMITS.free,
    storage_usage_percent: 85,
    folder_usage_percent: 90,
    marketplace_usage_percent: 80,
    is_storage_warning: true,
    is_storage_full: false,
    is_folders_full: false,
    last_calculated_at: new Date().toISOString()
  })

  const handleAddContent = (contentData: CreateContentData) => {
    // 폴더당 아이템 개수 제한 체크 (모든 플랜: 500개)
    const currentFolderItems = contentItems.filter(item => item.folder_id === contentData.folder_id)
    if (currentFolderItems.length >= 500) {
      alert('⚠️ 폴더당 최대 500개의 아이템만 저장할 수 있습니다.')
      return
    }
    
    const newItem: ContentItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: contentData.title,
      description: contentData.description,
      type: contentData.type,
      url: contentData.url,
      content: contentData.content,
      folder_id: contentData.folder_id,
      user_id: 'user1',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // 저장 공간 체크
    const canAdd = StorageCalculator.canAddItem(userUsage, newItem)
    if (!canAdd.canAdd) {
      setUpgradeReason('storage')
      setShowUpgradeModal(true)
      return
    }

    setContentItems(prev => [newItem, ...prev])
  }

  const handleShareFolder = async (shareOptions: ShareOptions) => {
    // 유료 판매 체크
    if (shareOptions.price > 0) {
      const canSell = StorageCalculator.canShareToMarketplace(userUsage, true)
      if (!canSell.canShare) {
        setUpgradeReason('paid_selling')
        setShowUpgradeModal(true)
        return
      }
    }
    
    // 마켓플레이스 공유 한계 체크
    if (folderStatuses[selectedFolder.id] === 'private') {
      const canShare = StorageCalculator.canShareToMarketplace(userUsage, false)
      if (!canShare.canShare) {
        setUpgradeReason('marketplace')
        setShowUpgradeModal(true)
        return
      }
    }
    
    const folderWithItems = {
      ...selectedFolder,
      items: contentItems.filter(item => item.folder_id === selectedFolder.id)
    }
    
    const result = await FolderSharingService.shareFolder(folderWithItems, shareOptions)
    
    if (result.success) {
      setFolderStatuses(prev => ({
        ...prev,
        [selectedFolder.id]: 'shared-synced'
      }))
      
      setSelectedFolder(prev => ({
        ...prev,
        shared_status: 'shared-synced',
        last_shared_at: new Date().toISOString()
      }))
      
      console.log('폴더 공유 성공:', result.message)
    } else {
      console.log('폴더 공유 실패:', result.message)
    }
    
    setShowShareModal(false)
  }

  const handleDeleteContent = (item: ContentItem) => {
    setContentItems(prev => prev.filter(content => content.id !== item.id))
    console.log('컨텐츠 삭제됨:', item.title)
  }

  const handleDeleteFolder = (folder: Folder) => {
    // 폴더와 관련된 모든 컨텐츠 삭제
    setContentItems(prev => prev.filter(content => content.folder_id !== folder.id))
    
    // 폴더 목록에서 제거
    const updatedFolders = folders.filter(f => f.id !== folder.id)
    setFolders(updatedFolders)
    
    // 첫 번째 폴더로 이동 (삭제된 폴더가 아닌 다른 폴더)
    if (updatedFolders.length > 0) {
      setSelectedFolder({
        ...updatedFolders[0],
        shared_status: folderStatuses[updatedFolders[0].id] || 'private'
      })
    }
    
    console.log('폴더 삭제됨:', folder.name)
    setShowDeleteModal(false)
    setFolderToDelete(null)
  }
  
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName.trim(),
      user_id: 'user1',
      is_shared: false,
      is_public: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      item_count: 0,
      shared_status: 'private'
    }
    
    setFolders(prev => [...prev, newFolder])
    setFolderStatuses(prev => ({ ...prev, [newFolder.id]: 'private' }))
    setNewFolderName('')
    setShowNewFolderPrompt(false)
    
    console.log('새 폴더 생성됨:', newFolder.name)
  }

  const handleSaveNote = (title: string, content: string, folderId: string) => {
    // 노트를 일반 콘텐츠와 같은 방식으로 추가
    const contentData: CreateContentData = {
      title,
      description: content.substring(0, 100) + '...',
      type: 'note',
      content,
      folder_id: folderId
    }
    
    handleAddContent(contentData)
    console.log('노트 저장됨:', title)
  }

  const handleStartEditingFolder = (folder: Folder) => {
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }

  const handleSaveEditingFolder = () => {
    if (!editingFolderName.trim()) return

    setFolders(prev => 
      prev.map(f => 
        f.id === editingFolderId 
          ? { ...f, name: editingFolderName.trim() }
          : f
      )
    )

    // 현재 선택된 폴더가 편집 중인 폴더라면 업데이트
    if (selectedFolder.id === editingFolderId) {
      setSelectedFolder(prev => ({
        ...prev,
        name: editingFolderName.trim()
      }))
    }

    setEditingFolderId(null)
    setEditingFolderName('')
    console.log('폴더명 수정됨:', editingFolderName)
  }

  const handleCancelEditingFolder = () => {
    setEditingFolderId(null)
    setEditingFolderName('')
  }

  // 폴더 상태 아이콘 표시 함수
  const getStatusIcon = (status: Folder['shared_status']) => {
    switch (status) {
      case 'private': return '🔒'
      case 'shared-synced': return '🌐' 
      case 'shared-outdated': return '🔄'
      default: return '🔒'
    }
  }
  
  // 폴더 상태 메시지
  const getStatusMessage = (status: Folder['shared_status']) => {
    switch (status) {
      case 'private': return 'Private only'
      case 'shared-synced': return 'Live in Marketplace' 
      case 'shared-outdated': return 'Has updates'
      default: return 'Private only'
    }
  }
  
  // 공유 버튼 텍스트 - 항상 "Share to Market"으로 표시
  const getShareButtonText = () => {
    return '📤 Share to Market'
  }
  
  // 선택된 폴더의 콘텐츠만 필터링
  const folderContent = contentItems.filter(item => item.folder_id === selectedFolder.id)
  const currentStatus = folderStatuses[selectedFolder.id] || 'private'
  return (
    <div className="h-full flex">
      {/* Folder Tree Section */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">My Folders</h2>
            <button 
              onClick={() => {
                const canCreate = StorageCalculator.canCreateFolder(userUsage)
                if (!canCreate.canCreate) {
                  setUpgradeReason('folders')
                  setShowUpgradeModal(true)
                  return
                }
                setShowNewFolderPrompt(true)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search folders..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {folders.map((folder) => (
              <div 
                key={folder.id}
                onClick={() => {
                  setSelectedFolder({
                    ...folder,
                    shared_status: folderStatuses[folder.id] || 'private'
                  })
                }}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors group ${
                  selectedFolder.id === folder.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center mr-3">
                  <span className="text-lg mr-1">📁</span>
                  <span className="text-xs">
                    {getStatusIcon(folderStatuses[folder.id] || 'private')}
                  </span>
                </div>
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={editingFolderName}
                    onChange={(e) => setEditingFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEditingFolder()
                      } else if (e.key === 'Escape') {
                        handleCancelEditingFolder()
                      }
                    }}
                    onBlur={handleSaveEditingFolder}
                    className="text-sm font-medium flex-1 bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <span className={`text-sm font-medium flex-1 ${
                    selectedFolder.id === folder.id ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {folder.name}
                  </span>
                )}
                <span className="text-xs text-gray-400 mr-2">{folder.item_count} items</span>
                {/* Edit and Delete buttons - only show on hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartEditingFolder(folder)
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-all"
                    title={`"${folder.name}" 폴더명 수정`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFolderToDelete(folder)
                      setShowDeleteModal(true)
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-all"
                    title={`"${folder.name}" 폴더 삭제`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid Section */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{selectedFolder.name}</h1>
                <span className="text-lg">{getStatusIcon(currentStatus)}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 mt-1">
                <span>{selectedFolder.item_count} items</span>
                <span>•</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  currentStatus === 'shared-synced' ? 'bg-green-100 text-green-700' :
                  currentStatus === 'shared-outdated' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {getStatusMessage(currentStatus)}
                </span>
                {currentStatus !== 'private' && selectedFolder.total_downloads && (
                  <>
                    <span>•</span>
                    <span className="text-sm">{selectedFolder.total_downloads} downloads</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {getShareButtonText()}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 pb-0">
          <div className={`grid gap-4 mb-6 ${
            isMobile 
              ? 'grid-cols-1 px-2' // 모바일: 1열, 패딩 추가
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' // PC: 기존대로
          }`}>
            {/* Content Cards - 반응형 */}
            {folderContent.map((item) => (
              isMobile ? (
                <ContentCardMobile
                  key={item.id}
                  item={item}
                  onEdit={(item) => console.log('Edit:', item)}
                  onDelete={handleDeleteContent}
                />
              ) : (
                <ContentCard
                  key={item.id}
                  item={item}
                  onEdit={(item) => console.log('Edit:', item)}
                  onDelete={handleDeleteContent}
                />
              )
            ))}
          </div>
        </div>

        {/* 항상 고정된 Content Input Section */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <ContentInput
            selectedFolder={selectedFolder}
            onAddContent={handleAddContent}
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>

      {/* 지연 로딩 모달들 */}
      <Suspense fallback={null}>
        {/* Share Folder Modal */}
        {showShareModal && (
          <ShareFolderModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            folder={selectedFolder}
            onShareFolder={handleShareFolder}
          />
        )}

        {/* Delete Folder Modal */}
        {showDeleteModal && folderToDelete && (
          <DeleteFolderModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false)
              setFolderToDelete(null)
            }}
            folder={folderToDelete}
            onConfirm={handleDeleteFolder}
          />
        )}
      </Suspense>
      
      {/* New Folder Prompt */}
      {showNewFolderPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">새 폴더 만들기</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="폴더 이름을 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNewFolderPrompt(false)
                  setNewFolderName('')
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Note Button - 두 번째 스크린샷의 연필 아이콘 */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={() => setShowBigNoteModal(true)}
          className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          title="Quick Notes"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>

      {/* 추가 지연 로딩 모달들 */}
      <Suspense fallback={null}>
        {/* Big Note Modal */}
        {showBigNoteModal && (
          <BigNoteModal
            isOpen={showBigNoteModal}
            onClose={() => setShowBigNoteModal(false)}
            onSave={handleSaveNote}
            allFolders={folders.map(f => ({ id: f.id, name: f.name }))}
            selectedFolderId={selectedFolder.id}
            variant="drawer"
          />
        )}
        
        {/* Upgrade Modal */}
        {showUpgradeModal && userUsage && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            usage={userUsage}
            triggerReason={upgradeReason}
          />
        )}
      </Suspense>
    </div>
  )
}