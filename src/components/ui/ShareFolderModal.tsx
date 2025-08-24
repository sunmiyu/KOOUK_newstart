'use client'

import { useState, useRef, useEffect } from 'react'
import { Folder, ShareOptions } from '@/types/folder'
import { FolderSharingService } from '@/services/folderSharing'
import { useUserUsage } from '@/hooks/useUserUsage'
import { useLimitCheck } from '@/hooks/useLimitCheck'
import { useToast } from '@/hooks/useToast'

interface ShareFolderModalProps {
  isOpen: boolean
  onClose: () => void
  folder?: Folder & { items?: any[] }
  onShareFolder?: (shareOptions: ShareOptions) => void
  onUpgradeRequired?: () => void
}

export default function ShareFolderModal({
  isOpen,
  onClose,
  folder,
  onShareFolder,
  onUpgradeRequired
}: ShareFolderModalProps) {
  const [title, setTitle] = useState(folder?.name || '')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('tech')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [price, setPrice] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [changesSummary, setChangesSummary] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Pro Plan 관련 훅들
  const { usage } = useUserUsage()
  const { checkMarketplaceLimit } = useLimitCheck()
  const { showMarketplaceLimitError, showProFeatureError } = useToast()
  
  useEffect(() => {
    if (folder && folder.shared_status && folder.shared_status !== 'private') {
      checkForChanges()
    }
  }, [folder])
  
  const checkForChanges = async () => {
    if (!folder?.id) return
    
    const preview = await FolderSharingService.getChangesPreview(folder.id)
    setHasChanges(preview.hasChanges)
    setChangesSummary(preview.summary)
  }

  const categories = [
    { value: 'business', label: 'Business', emoji: '💼' },
    { value: 'creative', label: 'Creative', emoji: '🎨' },
    { value: 'tech', label: 'Tech', emoji: '💻' },
    { value: 'education', label: 'Education', emoji: '📚' },
    { value: 'lifestyle', label: 'Lifestyle', emoji: '🏠' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎵' },
    { value: 'food', label: 'Food & Recipe', emoji: '🍽️' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'health', label: 'Health & Fitness', emoji: '🏃' },
    { value: 'finance', label: 'Finance', emoji: '💰' },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true)
      const imageUrl = URL.createObjectURL(file)
      setCoverImage(imageUrl)
      setIsUploading(false)
    }
  }

  const handleShare = async () => {
    if (!title.trim()) {
      alert('폴더 이름을 입력해주세요.')
      return
    }

    if (!description.trim()) {
      alert('폴더 설명을 입력해주세요.')
      return
    }

    // 마켓플레이스 공유 제한 체크 (무료/프로 모두)
    const limitCheck = checkMarketplaceLimit()
    if (!limitCheck.canProceed && usage) {
      showMarketplaceLimitError(
        usage.current_marketplace_folders,
        usage.limits.max_marketplace_folders,
        onUpgradeRequired
      )
      return
    }

    // 유료 설정 시 Pro Plan 체크
    if (price > 0 && usage && !usage.limits.can_sell_paid_folders) {
      showProFeatureError('유료 판매', onUpgradeRequired)
      return
    }

    setIsSharing(true)
    
    const shareOptions: ShareOptions = {
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      price,
      description: description.trim(),
      cover_image: coverImage
    }

    if (onShareFolder) {
      await onShareFolder(shareOptions)
    }
    
    setIsSharing(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {folder?.shared_status === 'private' ? 'Share Folder to Marketplace' : 'Update Shared Folder'}
            </h2>
            {folder?.shared_status !== 'private' && (
              <p className="text-sm text-gray-600 mt-1">
                📸 스냅샷 기반 공유 • 원본과 독립적으로 관리됩니다
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Cover Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대표 이미지 (선택사항)
            </label>
            <div className="relative">
              {coverImage ? (
                <div className="relative aspect-[3/1] rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full aspect-[3/1] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
                >
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {isUploading ? '업로드 중...' : '클릭해서 대표 이미지 업로드'}
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Folder Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              폴더 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="폴더 제목을 입력하세요..."
            />
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              카테고리 *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    category === cat.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가격
            </label>
            
            {usage?.limits.can_sell_paid_folders ? (
              /* Pro Plan - 가격 설정 가능 */
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setPrice(0)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      price === 0 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">FREE</div>
                      <div className="text-xs opacity-75">무료 공유</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPrice(0.99)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      price > 0 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">💰 PAID</div>
                      <div className="text-xs opacity-75">유료 판매</div>
                    </div>
                  </button>
                </div>
                
                {price > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">$</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                        min="0.99"
                        max="99.99"
                        step="0.01"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.99"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.99, 1.99, 4.99, 9.99].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setPrice(amount)}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            price === amount
                              ? 'bg-purple-100 border-purple-300 text-purple-700'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-purple-600">
                      💰 수익의 70%를 받으실 수 있습니다 (플랫폼 수수료 30%)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Free Plan - 무료만 가능 */
              <div className="space-y-3">
                <div className="w-full px-4 py-3 border-2 border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">🆓 FREE</span>
                    <span className="text-xs text-green-600">무료 공유</span>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">🌟</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900 mb-1">
                        Pro로 업그레이드하면 유료 판매 가능!
                      </p>
                      <p className="text-xs text-purple-700">
                        폴더를 유료로 판매하여 수익을 창출하세요
                      </p>
                      {onUpgradeRequired && (
                        <button
                          onClick={onUpgradeRequired}
                          className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-purple-700 transition-colors"
                        >
                          Pro 업그레이드
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="이 폴더에 어떤 내용이 있고 왜 유용한지 설명해주세요..."
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {description.length}/500자
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 (선택사항)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="쉼표로 구분해서 입력 (예: react, javascript, tutorial)"
            />
          </div>

          {/* Changes Preview (for updates) */}
          {folder?.shared_status !== 'private' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">변경사항 미리보기</h3>
              <div className={`rounded-lg p-4 border-2 border-dashed ${
                hasChanges ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {hasChanges ? '🔄' : '✅'}
                  </span>
                  <span className="font-medium text-gray-900">
                    {hasChanges ? changesSummary : '변경사항 없음'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {hasChanges 
                    ? '새로운 버전이 생성되어 마켓플레이스에서 업데이트됩니다.' 
                    : '현재 공유된 버전과 동일합니다.'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Folder Stats */}
          {folder && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">폴더 정보</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900">{folder.item_count}</div>
                    <div className="text-sm text-gray-600">개의 아이템</div>
                  </div>
                  {folder.shared_status !== 'private' && folder.total_downloads && (
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-green-600">{folder.total_downloads}</div>
                      <div className="text-sm text-gray-600">다운로드</div>
                    </div>
                  )}
                </div>
                {folder.last_shared_at && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      마지막 공유: {new Date(folder.last_shared_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleShare}
            disabled={isSharing || (!hasChanges && folder?.shared_status !== 'private')}
            className={`px-6 py-2 rounded-lg transition-colors font-medium ${
              isSharing
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : folder?.shared_status === 'private'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : hasChanges
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSharing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                공유 중...
              </div>
            ) : folder?.shared_status === 'private' ? (
              '📤 마켓플레이스에 공유하기'
            ) : hasChanges ? (
              '🔄 새 버전으로 업데이트'
            ) : (
              '✅ 이미 최신 버전'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}