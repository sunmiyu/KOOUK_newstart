'use client'

import { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export default function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for mobile/landing page */}
      {!showSidebar && <Header />}
      
      <div className="flex">
        {/* Sidebar for authenticated pages */}
        {showSidebar && <Sidebar />}
        
        {/* Main Content */}
        <main className={`flex-1 ${showSidebar ? '' : 'max-w-8xl mx-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}