'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { UserUsage, UserPlan, PLAN_LIMITS } from '@/types/folder'

interface AccountMenuModalProps {
  isOpen: boolean
  onClose: () => void
  userProfilePosition?: { x: number; y: number }
}

export default function AccountMenuModal({ 
  isOpen, 
  onClose, 
  userProfilePosition 
}: AccountMenuModalProps) {
  const { user, signOut } = useAuth()
  const [showComingSoon, setShowComingSoon] = useState(false)
  
  // 임시 사용자 데이터 (실제로는 API에서 가져와야 함)
  const [userUsage] = useState<UserUsage>({
    user_id: user?.id || '',
    plan: 'free' as UserPlan,
    current_storage_mb: 850,
    current_folders: 18,
    current_marketplace_folders: 4,
    limits: PLAN_LIMITS.free,
    storage_usage_percent: 85,
    folder_usage_percent: 90,
    marketplace_usage_percent: 80,
    is_storage_warning: true,
    is_storage_full: false,
    is_folders_full: false,
    last_calculated_at: new Date().toISOString()
  })

  if (!isOpen) return null

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const handleMyInfo = () => {
    console.log('내 정보 보기')
    onClose()
  }

  const handlePrivacyPolicy = () => {
    window.open('/privacy', '_blank')
    onClose()
  }
  
  const handleProPlanClick = () => {
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 3000)
  }
  
  const formatStorage = (mb: number) => {
    if (mb >= 1024) {
      return `${Math.round(mb / 1024 * 10) / 10} GB`
    }
    return `${Math.round(mb)} MB`
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Menu Modal */}
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48"
        style={{
          top: userProfilePosition ? userProfilePosition.y + 10 : '50%',
          left: userProfilePosition ? userProfilePosition.x - 150 : '50%',
          transform: userProfilePosition ? 'none' : 'translate(-50%, -50%)'
        }}
      >
        {/* User Info Header */}
        {user && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Current Plan Status */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">현재 플랜</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              userUsage.plan === 'pro' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {userUsage.plan === 'pro' ? '🌟 Pro Plan' : '🆓 Free Plan'}
            </span>
          </div>
          
          {/* Quick Usage Overview */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>저장공간:</span>
              <span className={userUsage.is_storage_warning ? 'text-orange-600 font-medium' : ''}>
                {formatStorage(userUsage.current_storage_mb)} / {userUsage.limits.storage_limit_gb}GB
              </span>
            </div>
            <div className="flex justify-between">
              <span>폴더:</span>
              <span className={userUsage.is_folders_full ? 'text-red-600 font-medium' : ''}>
                {userUsage.current_folders} / {userUsage.limits.max_folders}개
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <button
            onClick={handleMyInfo}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            <span>내 정보</span>
          </button>
          
          {/* Pro Plan Menu Item */}
          {userUsage.plan === 'free' && (
            <button 
              onClick={handleProPlanClick}
              className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors group relative flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <span className="text-purple-700 font-medium text-sm">🚀 Pro 플랜</span>
                  <div className="text-xs text-purple-600">더 많은 기능을 이용하세요</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                  공개 예정
                </span>
                <svg className="w-3 h-3 text-purple-400 group-hover:text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Coming Soon Tooltip */}
              {showComingSoon && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50">
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                    🚀 Pro 플랜 공개 예정! 기대해주세요
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )}
            </button>
          )}
          
          {userUsage.plan === 'pro' && (
            <button className="w-full px-4 py-2 text-left text-purple-700 bg-purple-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div>
                  <span className="font-medium text-sm">🌟 Pro 플랜 관리</span>
                  <div className="text-xs text-purple-600">결제 상태 및 설정</div>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">활성</span>
            </button>
          )}
          
          <button
            onClick={handlePrivacyPolicy}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8A6 6 0 006.114 2.114 6 6 0 002.114 6.114 6.003 6.003 0 002 8c0 .995.24 1.934.668 2.763L7 10.464V8a1 1 0 012 0v4.286l4.087 2.177c.42-.15.814-.36 1.17-.624.21-.156.39-.34.54-.544A6.017 6.017 0 0018 8z" clipRule="evenodd" />
            </svg>
            <span>개인정보정책</span>
          </button>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}