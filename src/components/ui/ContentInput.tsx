'use client'

import { useState, useRef, useEffect } from 'react'
import { Folder, CreateContentData } from '@/types/folder'
import { extractMetadata, isValidUrl } from '@/utils/metadata'
import { isYouTubeUrl, getYouTubeMetadata } from '@/utils/youtube'

interface ContentInputProps {
  selectedFolder?: Folder
  onAddContent: (content: CreateContentData) => void
  className?: string
}

export default function ContentInput({
  selectedFolder,
  onAddContent,
  className = ''
}: ContentInputProps) {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [pastedImages, setPastedImages] = useState<File[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 텍스트 영역 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  // 이미지 붙여넣기 핸들러
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageFiles: File[] = []

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        if (file) {
          // 파일명을 현재 시간으로 생성
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          const extension = file.type.split('/')[1] || 'png'
          const newFile = new File([file], `pasted-image-${timestamp}.${extension}`, {
            type: file.type,
            lastModified: Date.now(),
          })
          imageFiles.push(newFile)
        }
      }
    }

    if (imageFiles.length > 0) {
      setPastedImages(prev => [...prev, ...imageFiles])
    }
  }

  // 콘텐츠 타입 자동 감지
  const detectContentType = (content: string): CreateContentData['type'] => {
    const urlRegex = /^https?:\/\/.+/i
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i
    
    if (urlRegex.test(content)) {
      // 이미지 URL 확인
      if (imageExtensions.test(content)) {
        return 'image'
      }
      return 'link'
    }
    
    // 텍스트 길이로 note/document 구분
    if (content.length < 500) {
      return 'note'
    } else {
      return 'document'
    }
  }

  // 메타데이터 추출
  const extractContentMetadata = async (content: string, type: CreateContentData['type']) => {
    const metadata: Record<string, any> = {}

    if (type === 'link' && isYouTubeUrl(content)) {
      try {
        const youtubeData = await getYouTubeMetadata(content)
        if (youtubeData?.title) {
          metadata.title = youtubeData.title
          metadata.description = youtubeData.description
          metadata.thumbnail = youtubeData.thumbnail
          metadata.platform = 'youtube'
        }
      } catch (error) {
        console.error('Failed to fetch YouTube metadata:', error)
      }
    } else if (type === 'link' && isValidUrl(content)) {
      try {
        const webMetadata = await extractMetadata(content)
        if (webMetadata) {
          metadata.title = webMetadata.title
          metadata.description = webMetadata.description
          metadata.thumbnail = webMetadata.image
          metadata.domain = webMetadata.domain
          metadata.platform = 'web'
        }
      } catch (error) {
        console.error('Failed to fetch web metadata:', error)
      }
    }

    return metadata
  }

  // 파일 첨부 핸들러
  const handleFileAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachedFiles(prev => [...prev, ...files])
  }

  // 첨부 파일 제거
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 붙여넣은 이미지 제거
  const removePastedImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index))
  }

  // 콘텐츠 제출
  const handleSubmit = async () => {
    if (!input.trim() && attachedFiles.length === 0 && pastedImages.length === 0) return
    if (!selectedFolder) return

    setIsProcessing(true)

    try {
      // 텍스트 콘텐츠 처리
      if (input.trim()) {
        const type = detectContentType(input.trim())
        const metadata = await extractContentMetadata(input.trim(), type)
        
        // 제목 결정 로직
        let title = 'Content'
        if (type === 'link' && metadata.title) {
          title = metadata.title
        } else if (type === 'link') {
          title = 'Link'
        } else if (type === 'note') {
          title = 'Note'
        } else if (type === 'document') {
          title = 'Document'
        } else if (type === 'image') {
          title = 'Image'
        }

        const contentData: CreateContentData = {
          title,
          description: metadata.description || undefined,
          type,
          folder_id: selectedFolder.id,
          ...(type === 'link' || type === 'image' ? { url: input.trim() } : { content: input.trim() }),
          ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {})
        }

        onAddContent(contentData)
      }

      // 첨부 파일 처리
      for (const file of attachedFiles) {
        const type: CreateContentData['type'] = file.type.startsWith('image/') ? 'image' : 'document'

        const contentData: CreateContentData = {
          title: file.name,
          type,
          folder_id: selectedFolder.id,
          url: URL.createObjectURL(file) // 임시 URL
        }

        onAddContent(contentData)
      }

      // 붙여넣은 이미지 처리
      for (const file of pastedImages) {
        const contentData: CreateContentData = {
          title: file.name,
          type: 'image',
          folder_id: selectedFolder.id,
          url: URL.createObjectURL(file) // 임시 URL
        }

        onAddContent(contentData)
      }
      
      // 초기화
      setInput('')
      setAttachedFiles([])
      setPastedImages([])
    } catch (error) {
      console.error('Failed to save content:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // 키보드 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={className}>
      {/* 첨부 파일 및 붙여넣은 이미지 프리뷰 */}
      {(attachedFiles.length > 0 || pastedImages.length > 0) && (
        <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {/* 첨부 파일 */}
            {attachedFiles.map((file, index) => (
              <div
                key={`file-${index}`}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border"
              >
                <span className="text-xs truncate max-w-32">
                  📎 {file.name}
                </span>
                <button
                  onClick={() => removeAttachedFile(index)}
                  className="p-1 rounded hover:bg-red-100"
                >
                  <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}

            {/* 붙여넣은 이미지 */}
            {pastedImages.map((file, index) => (
              <div
                key={`pasted-${index}`}
                className="relative rounded-lg bg-white border overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-20 h-20 object-cover"
                />
                <button
                  onClick={() => removePastedImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                  🖼️ {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메인 입력 바 */}
      <div className="relative rounded-xl shadow-sm bg-white border border-gray-200">
        <div className="flex items-start gap-3 p-4">
          {/* 텍스트 입력 영역 */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              placeholder="Add links, notes, documents, or anything... (You can paste images here!)"
              className="w-full resize-none border-none outline-none bg-transparent text-sm leading-relaxed"
              style={{ 
                minHeight: '60px',
                maxHeight: '200px'
              }}
            />
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFileAttach}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Attach file"
            >
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && attachedFiles.length === 0 && pastedImages.length === 0) || isProcessing || !selectedFolder}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                (!input.trim() && attachedFiles.length === 0 && pastedImages.length === 0) || isProcessing || !selectedFolder
                  ? 'opacity-50 cursor-not-allowed bg-gray-200' 
                  : 'shadow-sm hover:shadow-md bg-gray-900 hover:bg-gray-800'
              }`}
              title="Send (Enter)"
            >
              <svg 
                className={`w-5 h-5 ${
                  (!input.trim() && attachedFiles.length === 0 && pastedImages.length === 0) || isProcessing || !selectedFolder
                    ? 'text-gray-400'
                    : 'text-white'
                }`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 폴더 선택 상태 표시 */}
      {selectedFolder && (
        <div className="mt-2 px-4 py-2 bg-blue-50 text-blue-700 text-xs rounded-lg">
          Adding to: <span className="font-medium">{selectedFolder.name}</span>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}