'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/ui/LoginButton'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span>🚀</span>
              <span>Easy Easy Super Easy</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              나만을 위한<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                디지털 라이프
              </span><br />
              매니저
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              폴더 정리부터 북마크 저장까지. 흩어진 디지털 콘텐츠를 
              하나의 공간에서 스마트하게 관리하세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <LoginButton size="lg" />
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
                <span>데모 보기</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 mb-20">
              <span>✓ 무료로 시작</span>
              <span>✓ 설치 불필요</span>
              <span>✓ 어디서나 접근</span>
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