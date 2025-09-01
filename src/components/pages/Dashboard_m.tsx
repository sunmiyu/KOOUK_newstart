'use client'

import { useState } from 'react'
import { useUserUsage } from '@/hooks/useUserUsage'
import BigNoteModalMobile from '@/components/ui/BigNoteModal_m'

export default function DashboardMobile() {
  const { usage: userUsage } = useUserUsage()
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([])
  const [showNoteModal, setShowNoteModal] = useState(false)
  
  // 임시 폴더 데이터 (실제로는 폴더 훅에서 가져올 것)
  const mockFolders = [
    { id: '1', name: 'React 개발 자료' },
    { id: '2', name: '맛집 & 여행' }
  ]
  
  const handleSaveNote = (noteData: { content: string; selectedFolderId: string }) => {
    console.log('노트 저장:', noteData)
    // 실제로는 노트를 폴더에 저장하는 로직
  }
  
  // 현재 시간 기반 인사말
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return '늦은 밤이에요'
    if (hour < 12) return '좋은 아침이에요'
    if (hour < 18) return '좋은 오후예요'
    return '좋은 저녁이에요'
  }
  
  // 현재 날짜
  const getCurrentDate = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }
    return today.toLocaleDateString('ko-KR', options)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{getGreeting()}! ☀️</h1>
            <p className="text-sm text-gray-600 mt-0.5">{getCurrentDate()}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 통계 현황 - 3개 한줄 배치 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-base font-medium text-gray-900 mb-4">나의 디지털 현황</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">📁</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{userUsage?.current_folders || 12}</p>
              <p className="text-xs text-gray-600">폴더</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🔖</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">247</p>
              <p className="text-xs text-gray-600">북마크</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">📤</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{userUsage?.current_marketplace_folders || 3}</p>
              <p className="text-xs text-gray-600">공유 중</p>
            </div>
          </div>
        </div>

        {/* 빠른 작업 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-base font-medium text-gray-900 mb-4">빠른 작업</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">📂</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">새 폴더</p>
                <p className="text-xs text-gray-600">폴더 만들기</p>
              </div>
            </button>
            <button className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🔗</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">링크 저장</p>
                <p className="text-xs text-gray-600">URL 추가</p>
              </div>
            </button>
          </div>
          <button 
            onClick={() => setShowNoteModal(true)}
            className="w-full mt-3 flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm">📝</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">퀵 노트 작성</p>
              <p className="text-xs text-gray-600">빠른 메모 남기기</p>
            </div>
          </button>
        </div>

        {/* 사용량 현황 */}
        {userUsage && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium text-gray-900">사용량 현황</h2>
              <span className="text-xs text-blue-600 font-medium">{userUsage.plan.toUpperCase()}</span>
            </div>
            
            {/* 저장공간 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">💾 저장공간</span>
                <span className="text-sm text-gray-900">
                  {Math.round((userUsage.current_storage_bytes / (1024 * 1024 * 1024)) * 100) / 100}GB / {userUsage.limits.max_storage_gb}GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    userUsage.storage_usage_percent >= 90 ? 'bg-red-500' : 
                    userUsage.storage_usage_percent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${userUsage.storage_usage_percent}%` }}
                />
              </div>
            </div>

            {/* 폴더 개수 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">📁 폴더</span>
                <span className="text-sm text-gray-900">
                  {userUsage.current_folders} / {userUsage.limits.max_folders}개
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    (userUsage.folder_usage_percent || 0) >= 90 ? 'bg-red-500' : 
                    (userUsage.folder_usage_percent || 0) >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${userUsage.folder_usage_percent || 0}%` }}
                />
              </div>
            </div>

            {/* Pro 업그레이드 (Free 사용자만) */}
            {userUsage.plan === 'free' && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">🚀 Pro 플랜</p>
                    <p className="text-xs text-gray-600">더 큰 공간과 고급 기능</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                    업그레이드
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 최근 활동 - 높은 정보 밀도 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">최근 활동</h2>
            <button className="text-xs text-blue-600 hover:text-blue-800">전체보기</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">"업무 프로젝트" 폴더 생성</p>
                <p className="text-xs text-gray-500">2분 전</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">React 문서 북마크 추가</p>
                <p className="text-xs text-gray-500">1시간 전</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">"디자인 리소스" 폴더 공유</p>
                <p className="text-xs text-gray-500">3시간 전</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">학습 노트 15개 항목 추가</p>
                <p className="text-xs text-gray-500">1일 전</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">마켓플레이스에서 "React 컬렉션" 다운로드</p>
                <p className="text-xs text-gray-500">2일 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 퀵 노트 모달 */}
      <BigNoteModalMobile
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleSaveNote}
        allFolders={mockFolders}
      />
    </div>
  )
}