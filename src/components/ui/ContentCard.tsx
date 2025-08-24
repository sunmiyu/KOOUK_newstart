'use client'

import { ContentItem } from '@/types/folder'
import { isYouTubeUrl } from '@/utils/youtube'

interface ContentCardProps {
  item: ContentItem
  onEdit?: (item: ContentItem) => void
  onDelete?: (item: ContentItem) => void
}

export default function ContentCard({ item, onEdit, onDelete }: ContentCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'link':
        if (isYouTubeUrl(item.url || '')) {
          return (
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          )
        }
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        )
      case 'note':
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
            <path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        )
      case 'document':
        return (
          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getBackgroundColor = () => {
    switch (item.type) {
      case 'link':
        return isYouTubeUrl(item.url || '') ? 'bg-red-50' : 'bg-blue-50'
      case 'image':
        return 'bg-green-50'
      case 'note':
        return 'bg-yellow-50'
      case 'document':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
  }

  const getThumbnail = () => {
    // 메타데이터에서 썸네일 가져오기
    const thumbnail = item.metadata?.thumbnail || item.thumbnail
    
    if (thumbnail) {
      return (
        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )
    }

    // 썸네일이 없을 때 타입별 아이콘 표시
    return (
      <div className={`w-full h-32 mb-3 rounded-lg flex items-center justify-center ${getBackgroundColor()}`}>
        <div className="text-4xl opacity-50">
          {item.type === 'link' && (isYouTubeUrl(item.url || '') ? '📹' : '🔗')}
          {item.type === 'image' && '🖼️'}
          {item.type === 'note' && '📝'}
          {item.type === 'document' && '📄'}
        </div>
      </div>
    )
  }

  const handleClick = () => {
    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank')
    } else if (onEdit) {
      onEdit(item)
    }
  }

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
      onClick={handleClick}
    >
      {/* 썸네일 */}
      {getThumbnail()}

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center min-w-0 flex-1">
          <div className={`p-1 rounded ${getBackgroundColor()} mr-2 flex-shrink-0`}>
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {item.title}
            </h3>
            {item.metadata?.domain && (
              <p className="text-xs text-gray-500 truncate">
                {item.metadata.domain}
              </p>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(item)
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="편집"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`"${item.title}"을(를) 삭제하시겠습니까?`)) {
                  onDelete(item)
                }
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="삭제"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 설명 */}
      {(item.description || item.metadata?.description) && (
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {item.description || item.metadata?.description}
        </p>
      )}

      {/* 메타정보 */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="capitalize">{item.type}</span>
        <span>
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}