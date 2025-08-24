'use client'

import { useState } from 'react'
import ContentInput from '@/components/ui/ContentInput'
import ContentCard from '@/components/ui/ContentCard'
import ShareFolderModal from '@/components/ui/ShareFolderModal'
import DeleteFolderModal from '@/components/ui/DeleteFolderModal'
import { Folder, CreateContentData, ContentItem, UserUsage, UserPlan, PLAN_LIMITS } from '@/types/folder'
import { FolderSharingService } from '@/services/folderSharing'
import { StorageCalculator } from '@/utils/storageCalculation'
import UpgradeModal from '@/components/ui/UpgradeModal'

// 샘플 폴더 데이터 (초기값)
const initialFolders: Folder[] = [
  {
    id: '1',
    name: 'Work Projects',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    item_count: 12,
    shared_status: 'private'
  },
  {
    id: '2', 
    name: 'Personal',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    item_count: 8,
    shared_status: 'private'
  },
  {
    id: '3',
    name: 'Design Resources',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    item_count: 24,
    shared_status: 'private'
  },
  {
    id: '4',
    name: 'Learning',
    user_id: 'user1',
    is_shared: false,
    is_public: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    item_count: 15,
    shared_status: 'private'
  }
]

// 샘플 콘텐츠 아이템들
const initialContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'React Documentation',
    description: 'Official React documentation with hooks, components, and best practices.',
    type: 'link',
    url: 'https://react.dev',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {
      domain: 'react.dev',
      platform: 'web'
    }
  },
  {
    id: '2',
    title: 'Project Ideas',
    description: 'Collection of interesting project ideas for portfolio development...',
    type: 'note',
    content: 'Collection of interesting project ideas for portfolio development...',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'UI Mockup v2.png',
    description: 'Updated mockup designs for the new dashboard interface.',
    type: 'image',
    url: 'https://picsum.photos/400/300',
    folder_id: '1',
    user_id: 'user1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function MyFolderPage() {
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
    '1': 'shared-synced',
    '2': 'private', 
    '3': 'shared-outdated',
    '4': 'private'
  })
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'storage' | 'folders' | 'marketplace' | 'paid_selling'>('folders')
  const [showNewFolderPrompt, setShowNewFolderPrompt] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  
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

  const handleShareFolder = async (shareOptions: any) => {
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
  
  // 공유 버튼 텍스트
  const getShareButtonText = (status: Folder['shared_status']) => {
    switch (status) {
      case 'private': return '📤 Share to Marketplace'
      case 'shared-synced': return '✅ Up to date'
      case 'shared-outdated': return '🔄 Update Shared'
      default: return '📤 Share to Marketplace'
    }
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
                <span className={`text-sm font-medium flex-1 ${
                  selectedFolder.id === folder.id ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {folder.name}
                </span>
                <span className="text-xs text-gray-400 mr-2">{folder.item_count} items</span>
                {/* Delete button - only show on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFolderToDelete(folder)
                    setShowDeleteModal(true)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                  title={`"${folder.name}" 폴더 삭제`}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
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
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentStatus === 'shared-synced' ? 
                    'bg-green-600 text-white hover:bg-green-700' :
                  currentStatus === 'shared-outdated' ?
                    'bg-orange-600 text-white hover:bg-orange-700' :
                    'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                {getShareButtonText(currentStatus)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {/* Content Cards */}
            {folderContent.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onEdit={(item) => console.log('Edit:', item)}
                onDelete={handleDeleteContent}
              />
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

      {/* Share Folder Modal */}
      <ShareFolderModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        folder={selectedFolder}
        onShareFolder={handleShareFolder}
      />

      {/* Delete Folder Modal */}
      <DeleteFolderModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setFolderToDelete(null)
        }}
        folder={folderToDelete}
        onConfirm={handleDeleteFolder}
      />
      
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
      
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        usage={userUsage}
        triggerReason={upgradeReason}
      />
    </div>
  )
}