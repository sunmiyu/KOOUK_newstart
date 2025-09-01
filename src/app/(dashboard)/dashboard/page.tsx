'use client'

import { useState } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import DashboardMobile from '@/components/pages/Dashboard_m'
import UsageCard from '@/components/ui/UsageCard'
import UpgradeModal from '@/components/ui/UpgradeModal'
import LimitWarning from '@/components/ui/LimitWarning'
import { ToastContainer } from '@/components/ui/Toast'
import { useUserUsage } from '@/hooks/useUserUsage'
import { useToast } from '@/hooks/useToast'

export default function DashboardPage() {
  const isMobile = useIsMobile()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason] = useState<'storage' | 'folders' | 'marketplace' | 'paid_selling'>('folders')
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([])
  
  // 실제 사용량 데이터 가져오기
  const { usage: userUsage } = useUserUsage()
  const { 
    toasts, 
    removeToast 
  } = useToast()
  
  const handleUpgradeClick = () => {
    setShowUpgradeModal(true)
  }

  // 모바일에서는 전용 컴포넌트 사용
  if (isMobile) {
    return <DashboardMobile />
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

      {/* Main Dashboard Layout - 4열 그리드 구조 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
        {/* 1번 영역 - 사용량 현황 */}
        <div className="lg:col-span-1">
          <UsageCard 
            onUpgradeClick={handleUpgradeClick}
            showUpgradeButton={userUsage?.plan === 'free'}
          />
        </div>
        
        {/* 2번 영역 - Free vs Pro 비교 (Quick Actions 대체) */}
        {userUsage?.plan === 'free' && (
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  <span className="mr-2">⚡</span>Free vs Pro 비교
                </h2>
                
                {/* 컴팩트 비교 테이블 */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-700 pb-2 border-b border-gray-300">
                    <div></div>
                    <div className="text-center">Free</div>
                    <div className="text-center text-blue-600">Pro</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center text-xs">
                      <span className="mr-1">💾</span>저장공간
                    </div>
                    <div className="text-center text-gray-600">1GB</div>
                    <div className="text-center text-blue-600 font-medium">10GB</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center text-xs">
                      <span className="mr-1">📁</span>폴더 개수
                    </div>
                    <div className="text-center text-gray-600">20개</div>
                    <div className="text-center text-blue-600 font-medium">50개</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center text-xs">
                      <span className="mr-1">💰</span>유료 판매
                    </div>
                    <div className="text-center text-gray-400">✕</div>
                    <div className="text-center text-blue-600 font-medium">✓</div>
                  </div>
                  
                  {/* Pro 플랜 안내 (축소) */}
                  <div className="bg-white rounded-lg p-3 border border-blue-200 mt-4">
                    <div className="text-center">
                      <div className="text-blue-600 text-xl mb-2">🚀</div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Pro 플랜 공개 예정!</h3>
                      <p className="text-xs text-gray-600 mb-2">더 강력한 기능으로 돌아올게요</p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• 10배 더 큰 저장공간</p>
                        <p>• 마켓플레이스 유료 판매</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 3~4번 영역 - Recent Activity (넓게) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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