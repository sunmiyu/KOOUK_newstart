'use client'

import { useState } from 'react'
import { extractMetadata, isValidUrl } from '@/utils/metadata'
import { isYouTubeUrl, getYouTubeMetadata } from '@/utils/youtube'

interface AddBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (bookmark: any) => void
}

export default function AddBookmarkModal({
  isOpen,
  onClose,
  onSuccess
}: AddBookmarkModalProps) {
  const [url, setUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('URL을 입력해주세요')
      return
    }

    // URL 자동 보정: http:// 또는 https:// 추가
    let processedUrl = url.trim()
    
    // 프로토콜이 없으면 https:// 추가
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl
    }

    if (!isValidUrl(processedUrl)) {
      setError('올바른 URL을 입력해주세요')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      let metadata = null

      if (isYouTubeUrl(processedUrl)) {
        // YouTube 메타데이터 가져오기
        try {
          const youtubeData = await getYouTubeMetadata(processedUrl)
          if (youtubeData?.title) {
            metadata = {
              title: youtubeData.title,
              description: youtubeData.description,
              image: youtubeData.thumbnail,
              url: processedUrl,
              domain: new URL(processedUrl).hostname,
              platform: 'youtube'
            }
          }
        } catch (error) {
          console.error('YouTube metadata fetch failed:', error)
        }
      }

      if (!metadata) {
        // 웹 메타데이터 가져오기
        try {
          const webMetadata = await extractMetadata(processedUrl)
          if (webMetadata) {
            metadata = {
              title: webMetadata.title || '북마크',
              description: webMetadata.description || '',
              image: webMetadata.image || '',
              url: processedUrl,
              domain: webMetadata.domain,
              platform: 'web'
            }
          }
        } catch (error) {
          console.error('Web metadata fetch failed:', error)
        }
      }

      // 메타데이터를 가져오지 못한 경우 기본 정보로 처리
      if (!metadata) {
        const urlObj = new URL(processedUrl)
        metadata = {
          title: urlObj.hostname,
          description: '',
          image: '',
          url: processedUrl,
          domain: urlObj.hostname,
          platform: 'web'
        }
      }

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess(metadata)
      }

      // 모달 닫기 및 초기화
      setUrl('')
      setError('')
      onClose()

    } catch (error) {
      console.error('북마크 추가 실패:', error)
      setError('북마크 추가에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add Bookmark
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              웹사이트 URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={handleKeyDown}
              placeholder="example.com 또는 https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoFocus
              disabled={isProcessing}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500 mb-6">
            <p className="mb-2">지원하는 사이트:</p>
            <ul className="space-y-1">
              <li>• 📺 YouTube 동영상</li>
              <li>• 📝 블로그 포스트 (네이버, 티스토리 등)</li>
              <li>• 🌐 모든 웹사이트</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !url.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Add Bookmark
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}