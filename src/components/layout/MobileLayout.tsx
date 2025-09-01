'use client'

import { useState } from 'react'
import DashboardMobile from '@/components/pages/Dashboard_m'
import MyFolderMobile from '@/components/pages/MyFolder_m'
import BookmarksMobile from '@/components/pages/Bookmarks_m'
import MarketplaceMobile from '@/components/pages/Marketplace_m'

type TabType = 'dashboard' | 'folder' | 'bookmarks' | 'marketplace'

export default function MobileLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: '홈',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      component: <DashboardMobile />
    },
    {
      id: 'folder' as TabType,
      name: '폴더',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      ),
      component: <MyFolderMobile />
    },
    {
      id: 'bookmarks' as TabType,
      name: '북마크',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
      component: <BookmarksMobile />
    },
    {
      id: 'marketplace' as TabType,
      name: '마켓',
      icon: (active: boolean) => (
        <svg className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 12a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      component: <MarketplaceMobile />
    }
  ]

  const currentTab = tabs.find(tab => tab.id === activeTab)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-hidden">
        {currentTab?.component}
      </div>

      {/* 하단 네비게이션 */}
      <div className="bg-white border-t border-gray-200 safe-area-pb">
        <div className="grid grid-cols-4 h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center space-y-1 transition-colors"
            >
              {tab.icon(activeTab === tab.id)}
              <span className={`text-xs font-medium ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {tab.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}