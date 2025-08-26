'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UsageCard from '@/components/ui/UsageCard'
import UpgradeModal from '@/components/ui/UpgradeModal'
import LimitWarning from '@/components/ui/LimitWarning'
import { ToastContainer } from '@/components/ui/Toast'
import { useUserUsage } from '@/hooks/useUserUsage'
import { useLimitCheck } from '@/hooks/useLimitCheck'
import { useToast } from '@/hooks/useToast'

export default function DashboardPage() {
  const router = useRouter()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'storage' | 'folders' | 'marketplace' | 'paid_selling'>('folders')
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([])
  
  // 실제 사용량 데이터 가져오기
  const { usage: userUsage, loading: usageLoading } = useUserUsage()
  const { checkFoldersLimit, checkStorageLimit, checkMarketplaceLimit } = useLimitCheck()
  const { 
    toasts, 
    removeToast, 
    showFolderLimitError, 
    showStorageError, 
    showMarketplaceLimitError,
    showSuccess 
  } = useToast()
  
  const handleUpgradeClick = () => {
    setShowUpgradeModal(true)
  }

  const handleQuickAction = (action: string, limitType?: 'folders' | 'storage' | 'marketplace') => {
    if (limitType) {
      let limitCheck
      switch (limitType) {
        case 'folders':
          limitCheck = checkFoldersLimit()
          break
        case 'storage':
          limitCheck = checkStorageLimit()
          break
        case 'marketplace':
          limitCheck = checkMarketplaceLimit()
          break
      }

      if (!limitCheck.canProceed && userUsage) {
        // 제한에 걸렸을 때 토스트 표시
        switch (limitCheck.reason) {
          case 'folders_full':
            showFolderLimitError(
              userUsage.current_folders, 
              userUsage.limits.max_folders, 
              () => {
                setUpgradeReason('folders')
                setShowUpgradeModal(true)
              }
            )
            return
          case 'storage_full':
            showStorageError(
              userUsage.storage_usage_percent,
              () => {
                setUpgradeReason('storage')
                setShowUpgradeModal(true)
              }
            )
            return
          case 'marketplace_full':
            showMarketplaceLimitError(
              userUsage.current_marketplace_folders,
              userUsage.limits.max_marketplace_folders,
              () => {
                setUpgradeReason('marketplace')
                setShowUpgradeModal(true)
              }
            )
            return
        }
      }
    }

    // 제한이 없으면 정상 진행
    switch (action) {
      case 'new-folder':
        router.push('/my-folder')
        showSuccess('새 폴더 생성 페이지로 이동합니다')
        break
      case 'add-link':
        router.push('/bookmarks')
        showSuccess('북마크 추가 페이지로 이동합니다')
        break
      case 'write-note':
        router.push('/my-folder')
        showSuccess('노트 작성 페이지로 이동합니다')
        break
      case 'upload-file':
        setUpgradeReason('storage')
        setShowUpgradeModal(true)
        break
    }
  }
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">개인 허브의 중심에서 모든 활동을 한눈에 확인하세요</p>
      </div>

      {/* Limit Warning */}
      {userUsage && !dismissedWarnings.includes('usage-warning') && (
        <LimitWarning
          usage={userUsage}
          onUpgradeClick={handleUpgradeClick}
          onDismiss={() => setDismissedWarnings(prev => [...prev, 'usage-warning'])}
          className="mb-6"
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📁</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Total Folders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🔖</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">247</p>
              <p className="text-sm text-gray-600">Bookmarks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📄</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">89</p>
              <p className="text-sm text-gray-600">Content Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">📤</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Shared Folders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <UsageCard 
            onUpgradeClick={handleUpgradeClick}
            showUpgradeButton={userUsage?.plan === 'free'}
          />
        </div>
        
        {/* Recent Activity moved here */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="ml-3 text-sm text-gray-600">
                  Created new folder <span className="font-medium">Work Projects</span>
                </p>
                <span className="ml-auto text-xs text-gray-400">2m ago</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="ml-3 text-sm text-gray-600">
                  Added bookmark <span className="font-medium">React Documentation</span>
                </p>
                <span className="ml-auto text-xs text-gray-400">1h ago</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="ml-3 text-sm text-gray-600">
                  Shared folder <span className="font-medium">Design Resources</span>
                </p>
                <span className="ml-auto text-xs text-gray-400">3h ago</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="ml-3 text-sm text-gray-600">
                  {userUsage?.is_storage_warning && (
                    <span className="text-orange-600 font-medium">⚠️ 저장공간 90% 사용 중</span>
                  )}
                  {!userUsage?.is_storage_warning && 'Storage usage within normal range'}
                </p>
                <span className="ml-auto text-xs text-gray-400">5h ago</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="ml-3 text-sm text-gray-600">
                  {userUsage?.folder_usage_percent && userUsage.folder_usage_percent >= 90 && (
                    <span className="text-red-600 font-medium">⚠️ 폴더 한계 임박 ({userUsage?.current_folders}/{userUsage?.limits.max_folders})</span>
                  )}
                  {(!userUsage || (userUsage?.folder_usage_percent && userUsage.folder_usage_percent < 90)) && 'Folder usage within normal range'}
                </p>
                <span className="ml-auto text-xs text-gray-400">1d ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleQuickAction('new-folder', 'folders')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-2xl mb-2">📁</div>
                <p className="text-sm font-medium text-gray-700">New Folder</p>
              </button>
              <button 
                onClick={() => handleQuickAction('add-link', 'storage')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-2xl mb-2">🔗</div>
                <p className="text-sm font-medium text-gray-700">Add Link</p>
              </button>
              <button 
                onClick={() => handleQuickAction('write-note', 'storage')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm font-medium text-gray-700">Write Note</p>
              </button>
              <button 
                onClick={() => handleQuickAction('upload-file', 'storage')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <div className="text-2xl mb-2">📤</div>
                <p className="text-sm font-medium text-gray-700">Upload File</p>
              </button>
            </div>
          </div>
        </div>

        {/* Pro vs Free Comparison - Free 사용자만 */}
        {userUsage?.plan === 'free' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                <span className="mr-2">⚡</span>Free vs Pro 비교
              </h2>
              
              {/* 비교 테이블 */}
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 pb-2 border-b border-gray-300">
                  <div></div>
                  <div className="text-center">Free</div>
                  <div className="text-center text-blue-600">Pro</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">💾</span>저장공간
                  </div>
                  <div className="text-center text-gray-600">1GB</div>
                  <div className="text-center text-blue-600 font-medium">10GB</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">📁</span>폴더 개수
                  </div>
                  <div className="text-center text-gray-600">20개</div>
                  <div className="text-center text-blue-600 font-medium">50개</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>유료 판매
                  </div>
                  <div className="text-center text-gray-400">✕</div>
                  <div className="text-center text-blue-600 font-medium">✓</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">📊</span>고급 분석
                  </div>
                  <div className="text-center text-gray-400">✕</div>
                  <div className="text-center text-blue-600 font-medium">✓</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-center">
                  <div className="text-blue-600 text-2xl mb-2">🚀</div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Pro 플랜 공개 예정!</p>
                  <p className="text-xs text-gray-600">더 강력한 기능으로 돌아올게요</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Upgrade Modal */}
      {userUsage && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          usage={userUsage}
          triggerReason={upgradeReason}
        />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}