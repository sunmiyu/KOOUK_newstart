'use client'

import { useState, useRef, useEffect } from 'react'
import { Folder } from '@/types/folder'

interface BigNoteModalMobileProps {
  isOpen: boolean
  onClose: () => void
  onSave: (noteData: { content: string; selectedFolderId: string }) => void
  allFolders: { id: string; name: string }[]
  selectedFolderId?: string
}

export default function BigNoteModalMobile({
  isOpen,
  onClose,
  onSave,
  allFolders,
  selectedFolderId = ''
}: BigNoteModalMobileProps) {
  const [content, setContent] = useState('')
  const [selectedFolder, setSelectedFolder] = useState(selectedFolderId)
  const [showFolderSelect, setShowFolderSelect] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      // 모바일에서 키보드가 올라올 때 자동 포커스
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedFolder(selectedFolderId)
  }, [selectedFolderId])

  const handleSave = () => {
    if (!content.trim()) return
    
    onSave({
      content: content.trim(),
      selectedFolderId: selectedFolder
    })
    
    setContent('')
    onClose()
  }

  const handleCancel = () => {
    setContent('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* 모바일 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button 
          onClick={handleCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">퀵 노트</h2>
        
        <button 
          onClick={handleSave}
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          저장
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
        {/* 텍스트 영역 */}
        <div className="flex-1 p-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="📝 빠른 메모를 작성하세요...

아이디어, 할 일, 중요한 생각들을 자유롭게 적어보세요.
언제든 다시 찾아볼 수 있습니다."
            className="w-full h-full resize-none border-none outline-none text-base leading-relaxed placeholder-gray-400"
            style={{ 
              fontFamily: 'inherit',
              background: 'transparent',
              fontSize: '16px' // iOS 줌 방지
            }}
          />
        </div>

        {/* 하단 도구 영역 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {/* 폴더 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              저장할 폴더
            </label>
            <button
              onClick={() => setShowFolderSelect(!showFolderSelect)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center">
                <span className="mr-2">📁</span>
                <span className="text-gray-900">
                  {allFolders.find(f => f.id === selectedFolder)?.name || '폴더 선택'}
                </span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${showFolderSelect ? 'rotate-180' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* 폴더 드롭다운 */}
            {showFolderSelect && (
              <div className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {allFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolder(folder.id)
                      setShowFolderSelect(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center ${
                      selectedFolder === folder.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    <span className="mr-3">📂</span>
                    <span>{folder.name}</span>
                    {selectedFolder === folder.id && (
                      <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {content.length > 0 ? `${content.length}자` : '내용을 입력하세요'}
            </span>
            <span>
              💡 Ctrl+Enter로 빠른 저장
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}