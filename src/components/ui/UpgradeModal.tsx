'use client'

import { useState } from 'react'
import { UserUsage } from '@/types/folder'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  usage: UserUsage
  triggerReason?: 'storage' | 'folders' | 'marketplace' | 'paid_selling' | 'analytics'
}

export default function UpgradeModal({ isOpen, onClose, usage, triggerReason }: UpgradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const getTriggerMessage = () => {
    switch (triggerReason) {
      case 'storage':
        return {
          icon: '💾',
          title: '저장 공간이 부족합니다!',
          message: '더 많은 콘텐츠를 저장하려면 Pro로 업그레이드하세요.'
        }
      case 'folders':
        return {
          icon: '📁',
          title: '폴더 개수 한계에 도달했습니다!',
          message: '더 많은 폴더를 만들려면 Pro로 업그레이드하세요.'
        }
      case 'marketplace':
        return {
          icon: '🛍️',
          title: '마켓플레이스 공유 한계입니다!',
          message: '더 많은 폴더를 공유하려면 Pro로 업그레이드하세요.'
        }
      case 'paid_selling':
        return {
          icon: '💰',
          title: '유료 판매는 Pro 전용 기능입니다!',
          message: '폴더를 유료로 판매하여 수익을 창출하세요.'
        }
      case 'analytics':
        return {
          icon: '📊',
          title: '고급 분석은 Pro 전용입니다!',
          message: '상세한 통계와 수익 분석을 확인하세요.'
        }
      default:
        return {
          icon: '🌟',
          title: 'Pro로 업그레이드하여 더 많은 기능을!',
          message: 'KOOUK의 모든 기능을 제한 없이 사용하세요.'
        }
    }
  }

  const handleUpgrade = async () => {
    setIsProcessing(true)
    
    // TODO: Stripe 결제 연동
    console.log('Pro 플랜 업그레이드 시작...')
    
    // 임시 딜레이
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    onClose()
  }

  const trigger = getTriggerMessage()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="text-4xl mb-3">{trigger.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{trigger.title}</h2>
            <p className="text-purple-100">{trigger.message}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Usage Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-orange-900 mb-2">현재 사용량</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">저장 공간:</span>
                <span className="font-medium text-orange-900">
                  {usage.current_storage_mb}MB / {usage.limits.storage_limit_gb * 1024}MB 
                  ({usage.storage_usage_percent}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">폴더:</span>
                <span className="font-medium text-orange-900">
                  {usage.current_folders} / {usage.limits.max_folders}개 
                  ({usage.folder_usage_percent}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">공유 폴더:</span>
                <span className="font-medium text-orange-900">
                  {usage.current_marketplace_folders} / {usage.limits.max_marketplace_folders}개 
                  ({usage.marketplace_usage_percent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Free vs Pro Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="text-2xl mb-2">🆓</div>
                <h3 className="font-semibold text-gray-900">Free Plan</h3>
                <p className="text-gray-600">현재 플랜</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">💾</span>
                  <span className="text-gray-600">1GB 저장공간</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">📁</span>
                  <span className="text-gray-600">20개 폴더</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">🛍️</span>
                  <span className="text-gray-600">5개 폴더 공유</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-gray-600">유료 판매 불가</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-gray-600">고급 분석 없음</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-purple-300 bg-purple-50 rounded-lg p-4 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">추천</span>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-2xl mb-2">🌟</div>
                <h3 className="font-semibold text-purple-900">Pro Plan</h3>
                <p className="text-purple-700 font-semibold">$9.99/월</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">💾</span>
                  <span className="text-purple-800 font-medium">10GB 저장공간</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">📁</span>
                  <span className="text-purple-800 font-medium">50개 폴더</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">🛍️</span>
                  <span className="text-purple-800 font-medium">25개 폴더 공유</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">💰</span>
                  <span className="text-purple-800 font-medium">유료 판매 가능</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">📊</span>
                  <span className="text-purple-800 font-medium">고급 분석 & 수익 통계</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">🎨</span>
                  <span className="text-purple-800 font-medium">커스텀 카테고리</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">⚡</span>
                  <span className="text-purple-800 font-medium">우선 지원</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Guarantee & Testimonial */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-medium text-green-900">30일 환불 보장</h4>
                <p className="text-sm text-green-700">만족하지 않으시면 언제든지 전액 환불받으세요.</p>
              </div>
            </div>
          </div>

          {/* Pro User Testimonial */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm text-gray-800 italic mb-2">
                  "Pro로 업그레이드한 후 유료 폴더 판매로 한 달에 $200 이상의 부수입을 얻고 있어요. 투자 대비 정말 만족스러운 결과입니다!"
                </p>
                <p className="text-xs text-gray-600">— Sarah K., 디자이너</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            나중에
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className={`px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                처리중...
              </div>
            ) : (
              '🚀 $9.99/월로 Pro 시작하기'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}