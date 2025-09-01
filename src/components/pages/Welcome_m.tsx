'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function WelcomeMobile() {
  const { signInWithGoogle, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('로그인 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 상태바 공간 */}
      <div className="h-6 bg-transparent" />
      
      <div className="px-6 py-8 flex flex-col items-center">
        {/* 로고 섹션 */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg">
            <span className="text-white text-3xl font-bold">K</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KOOUK</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Easy Easy Super Easy<br />
            개인 디지털 라이프 매니저
          </p>
        </div>

        {/* 메인 설명 */}
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            📱 모든 것을 한 곳에서
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            북마크부터 폴더 관리까지<br />
            디지털 콘텐츠를 쉽고 빠르게 정리하세요
          </p>
        </div>

        {/* 주요 기능 미리보기 */}
        <div className="w-full max-w-sm space-y-4 mb-10">
          {/* My Folder */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">📁</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">My Folder</h3>
                <p className="text-xs text-gray-600">개인 폴더 관리</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              링크, 메모, 문서를 체계적으로 정리하고<br />
              언제 어디서나 빠르게 찾아보세요
            </p>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-lg">🔖</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Bookmarks</h3>
                <p className="text-xs text-gray-600">스마트 북마킹</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              웹사이트를 카테고리별로 저장하고<br />
              인스타그램 스타일로 탐색하세요
            </p>
          </div>

          {/* Marketplace */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-lg">🛍️</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Marketplace</h3>
                <p className="text-xs text-gray-600">커뮤니티 공유</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              유용한 폴더를 공유하고<br />
              다른 사람의 컬렉션을 발견하세요
            </p>
          </div>
        </div>

        {/* 통계 */}
        <div className="w-full max-w-sm mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-gray-900 mb-3 text-center">✨ 지금까지 함께한 사람들</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">10K+</p>
                <p className="text-xs text-gray-600">사용자</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">50K+</p>
                <p className="text-xs text-gray-600">폴더</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">200K+</p>
                <p className="text-xs text-gray-600">북마크</p>
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || loading}
            className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm text-gray-600">로그인 중...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Google로 시작하기</span>
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-500 leading-relaxed">
            로그인하면 <span className="text-blue-600 font-medium">서비스 약관</span> 및 <span className="text-blue-600 font-medium">개인정보처리방침</span>에 동의하게 됩니다
          </p>
        </div>

        {/* 특징 */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <span className="mr-1">🆓</span>
              <span>완전 무료</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">☁️</span>
              <span>클라우드 동기화</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">🚀</span>
              <span>빠른 접근</span>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            Made with ❤️ by KOOUK Team<br />
            Version 1.0.0 • 모바일 최적화
          </p>
        </div>
      </div>

      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-30" />
        <div className="absolute top-1/4 -left-8 w-32 h-32 bg-purple-100 rounded-full opacity-20" />
        <div className="absolute -bottom-8 right-1/4 w-20 h-20 bg-green-100 rounded-full opacity-25" />
      </div>
    </div>
  )
}