'use client'

import { UserUsage } from '@/types/folder'

interface LimitWarningProps {
  usage: UserUsage
  onUpgradeClick?: () => void
  onDismiss?: () => void
  className?: string
}

export default function LimitWarning({ 
  usage, 
  onUpgradeClick, 
  onDismiss, 
  className = '' 
}: LimitWarningProps) {
  // 경고할 내용이 없으면 렌더링하지 않음
  const hasWarnings = usage.is_storage_warning || usage.is_storage_full || usage.is_folders_full
  
  if (!hasWarnings) return null

  const getWarningLevel = () => {
    if (usage.is_storage_full || usage.is_folders_full) return 'error'
    if (usage.is_storage_warning) return 'warning'
    return 'info'
  }

  const getWarningStyle = () => {
    const level = getWarningLevel()
    switch (level) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-900',
          icon: '🚫',
          button: 'bg-red-600 hover:bg-red-700'
        }
      case 'warning':
        return {
          container: 'bg-orange-50 border-orange-200',
          text: 'text-orange-900',
          icon: '⚠️',
          button: 'bg-orange-600 hover:bg-orange-700'
        }
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-900',
          icon: 'ℹ️',
          button: 'bg-blue-600 hover:bg-blue-700'
        }
    }
  }

  const getWarningMessages = () => {
    const messages = []
    
    if (usage.is_storage_full) {
      messages.push({
        type: 'storage',
        message: `저장공간이 가득 찼습니다 (${usage.storage_usage_percent}%)`,
        detail: '새로운 콘텐츠를 추가할 수 없습니다.'
      })
    } else if (usage.is_storage_warning) {
      messages.push({
        type: 'storage',
        message: `저장공간 ${usage.storage_usage_percent}% 사용 중`,
        detail: '곧 한계에 도달할 예정입니다.'
      })
    }

    if (usage.is_folders_full) {
      messages.push({
        type: 'folders',
        message: `폴더 개수 한계 도달 (${usage.current_folders}/${usage.limits.max_folders})`,
        detail: '새로운 폴더를 만들 수 없습니다.'
      })
    } else if (usage.folder_usage_percent >= 90) {
      messages.push({
        type: 'folders',
        message: `폴더 ${usage.folder_usage_percent}% 사용 중 (${usage.current_folders}/${usage.limits.max_folders})`,
        detail: '곧 한계에 도달할 예정입니다.'
      })
    }

    if (usage.marketplace_usage_percent >= 100) {
      messages.push({
        type: 'marketplace',
        message: `마켓플레이스 공유 한계 도달 (${usage.current_marketplace_folders}/${usage.limits.max_marketplace_folders})`,
        detail: '더 이상 폴더를 공유할 수 없습니다.'
      })
    } else if (usage.marketplace_usage_percent >= 90) {
      messages.push({
        type: 'marketplace',
        message: `마켓플레이스 공유 ${usage.marketplace_usage_percent}% 사용 중`,
        detail: '곧 한계에 도달할 예정입니다.'
      })
    }

    return messages
  }

  const style = getWarningStyle()
  const messages = getWarningMessages()

  return (
    <div className={`border rounded-lg p-4 ${style.container} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{style.icon}</span>
            <h3 className={`font-medium ${style.text}`}>
              {getWarningLevel() === 'error' ? '사용량 한계 도달' : '사용량 주의'}
            </h3>
          </div>
          
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="text-sm">
                <p className={`font-medium ${style.text}`}>{msg.message}</p>
                <p className={`text-xs ${style.text} opacity-75`}>{msg.detail}</p>
              </div>
            ))}
          </div>

          {usage.plan === 'free' && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
              <p className={`text-xs ${style.text} opacity-75`}>
                Pro로 업그레이드하면 더 많은 저장공간과 폴더를 사용할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {usage.plan === 'free' && onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className={`px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-colors ${style.button}`}
            >
              Pro 업그레이드
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`p-1.5 rounded-lg hover:bg-current hover:bg-opacity-10 transition-colors ${style.text}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}