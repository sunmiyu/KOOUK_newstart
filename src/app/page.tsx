'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/useMediaQuery'
import WelcomeMobile from '@/components/pages/Welcome_m'
import LoginButton from '@/components/ui/LoginButton'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const isMobile = useIsMobile()
  const { user, loading } = useAuth()
  const router = useRouter()

  // 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // 로딩 중일 때는 스피너 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // 이미 로그인된 사용자는 리다이렉트 중 (빈 화면)
  if (user) {
    return null
  }

  // 모바일에서는 전용 Welcome 페이지 사용
  if (isMobile) {
    return <WelcomeMobile />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">KOOUK</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">About</a>
            </div>
            
            <LoginButton />
          </div>
        </div>
      </nav>

      {/* Hero Section - Notion 스타일 좌우 레이아웃 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* 왼쪽: 텍스트 콘텐츠 */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <span>🚀</span>
                <span>Easy Easy Super Easy</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                나만을 위한<br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI 워크스페이스
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                팀이 모든 답을 찾고, 반복 업무를 자동화하며, 
                프로젝트를 완료할 수 있는 하나의 공간.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <LoginButton size="lg" />
                <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2 px-4 py-2">
                  <span>데모 요청하기</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-sm text-gray-500 pt-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  무료로 시작
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  설치 불필요
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  어디서나 접근
                </span>
              </div>
            </div>

            {/* 오른쪽: 시각적 요소 */}
            <div className="relative">
              <div className="relative">
                {/* 메인 일러스트 영역 */}
                <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                  <div className="space-y-6">
                    {/* 상단: 대시보드 미니 프리뷰 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">📊</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Dashboard</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-blue-50 h-8 rounded flex items-center justify-center">
                          <span className="text-xs">📁 12</span>
                        </div>
                        <div className="bg-green-50 h-8 rounded flex items-center justify-center">
                          <span className="text-xs">🔖 89</span>
                        </div>
                        <div className="bg-purple-50 h-8 rounded flex items-center justify-center">
                          <span className="text-xs">🔗 3</span>
                        </div>
                      </div>
                    </div>

                    {/* 중간: 폴더 구조 미니 프리뷰 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500">📁</span>
                          <span className="text-xs text-gray-600">Work Projects</span>
                        </div>
                        <div className="flex items-center space-x-2 pl-4">
                          <span className="text-blue-500">🔗</span>
                          <span className="text-xs text-gray-500">React Documentation</span>
                        </div>
                        <div className="flex items-center space-x-2 pl-4">
                          <span className="text-green-500">📝</span>
                          <span className="text-xs text-gray-500">Meeting Notes</span>
                        </div>
                      </div>
                    </div>

                    {/* 하단: 마켓플레이스 카드 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🛍️</span>
                          <div>
                            <div className="text-xs font-medium text-gray-700">Marketplace</div>
                            <div className="text-xs text-gray-500">새로운 발견</div>
                          </div>
                        </div>
                        <div className="text-xs text-blue-600">→</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 떠있는 요소들 */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-lg">✨</span>
                </div>
                <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm">🚀</span>
                </div>
                <div className="absolute top-1/2 -right-8 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs">💡</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Screenshot Showcase - 자연스럽게 화면들 보여주기 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              모든 것이 한 곳에
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dashboard에서 한눈에 파악하고, My Folder에서 체계적으로 정리하고, 
              Marketplace에서 새로운 발견을 경험하세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard Preview */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white p-1 transition-transform group-hover:scale-105">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <div className="text-lg font-semibold text-gray-800">Dashboard</div>
                    <div className="text-sm text-gray-600 mt-2">통계와 빠른 액션</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">한눈에 보는 현황</h3>
                <p className="text-gray-600">사용량부터 최근 활동까지 모든 정보를 대시보드에서 확인하세요</p>
              </div>
            </div>

            {/* My Folder Preview */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white p-1 transition-transform group-hover:scale-105">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📁</div>
                    <div className="text-lg font-semibold text-gray-800">My Folder</div>
                    <div className="text-sm text-gray-600 mt-2">스마트한 폴더 관리</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">체계적인 정리</h3>
                <p className="text-gray-600">링크, 노트, 이미지를 폴더별로 깔끔하게 분류하고 관리하세요</p>
              </div>
            </div>

            {/* Marketplace Preview */}
            <div className="group">
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white p-1 transition-transform group-hover:scale-105">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🛍️</div>
                    <div className="text-lg font-semibold text-gray-800">Marketplace</div>
                    <div className="text-sm text-gray-600 mt-2">커뮤니티 콘텐츠 발견</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">새로운 발견</h3>
                <p className="text-gray-600">다른 사용자들이 공유한 유용한 콘텐츠 컬렉션을 탐색하세요</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Organization</h3>
              <p className="text-gray-600 leading-relaxed">
                AI 기반 자동 분류와 태그 시스템으로 콘텐츠를 더 쉽게 찾고 관리하세요
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔖</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Instant Save</h3>
              <p className="text-gray-600 leading-relaxed">
                웹사이트 메타데이터 자동 추출로 북마크를 저장하는 순간 정리가 완료됩니다
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                전문가들이 큐레이션한 콘텐츠 컬렉션을 발견하고 나만의 컬렉션을 공유하세요
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}