'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, LogOut, Menu, LayoutDashboard, Clock, History, Settings } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import ThemeToggle from '@/components/ThemeToggle'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  profile: {
    id: string
    username: string
    full_name: string | null
  }
  user: User | null
}

export default function DashboardLayoutClient({ children, profile, user }: DashboardLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')

  // Listen to window size to adapt sidebar responsive state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile) // Open on desktop, closed on mobile by default
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Start real-time clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }) +
          ' • ' +
          now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Standalone "Log Session" link has been removed.
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Focus Timer', href: '/dashboard/timer', icon: Clock },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  // Close sidebar on mobile after clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext flex flex-col transition-colors duration-300">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[100px] pointer-events-none -z-10 animate-pulse duration-8000" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[100px] pointer-events-none -z-10 animate-pulse duration-10000" />

      {/* Top Navigation Bar - starts flush at the very left edge */}
      <nav className="sticky top-0 z-50 border-b border-warmborder dark:border-white/10 bg-warmbg/80 dark:bg-darkbg/80 backdrop-blur-md transition-colors duration-300 h-[69px] flex items-center px-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-warmbg dark:hover:bg-white/10 rounded-lg text-warmtext/70 dark:text-darktext/75 hover:text-warmtext dark:hover:text-darktext transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 ml-2">
              <div className="p-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-lg text-white shadow-sm shadow-indigo-600/10">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-bold text-base tracking-tight font-display">studylog</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="text-right hidden sm:block border-l border-warmborder dark:border-white/10 pl-4">
              <p className="text-[9px] font-bold text-warmtext/50 dark:text-darktext/50 uppercase tracking-wider">Signed in as</p>
              <p className="text-xs font-bold text-warmtext/80 dark:text-darktext/80">
                {profile.full_name || profile.username || user?.email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-warmbg dark:hover:bg-white/10 rounded-lg text-warmtext/60 dark:text-darktext/50 hover:text-warmtext dark:hover:text-darktext transition-colors flex items-center gap-2 text-sm font-semibold"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid: Sidebar + Content */}
      <div className="flex-1 flex relative">
        {/* Mobile Drawer Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
          />
        )}

        {/* Sidebar Navigation - starts flush at left edge, collapsible */}
        <aside
          className={`z-40 border-r border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg transition-all duration-300 ease-in-out flex flex-col justify-between p-4 shrink-0 ${
            isMobile
              ? `fixed left-0 top-[69px] h-[calc(100vh-69px)] ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full pointer-events-none p-0 border-r-0'}`
              : `sticky top-[69px] h-[calc(100vh-69px)] overflow-y-auto ${isSidebarOpen ? 'w-64' : 'w-16 px-2'}`
          }`}
        >
          <div className="space-y-1.5 w-full">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`flex items-center rounded-xl text-sm font-bold transition-all duration-200 ${
                    isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
                  } ${
                    isActive
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-600/10'
                      : 'text-warmtext/60 dark:text-darktext/50 hover:bg-warmbg dark:hover:bg-white/10 hover:text-warmtext dark:hover:text-darktext'
                  }`}
                  title={!isSidebarOpen ? link.name : undefined}
                >
                  <link.icon className="h-4.5 w-4.5 shrink-0" />
                  {isSidebarOpen && <span className="truncate">{link.name}</span>}
                </Link>
              )
            })}
          </div>

          {/* Footer inside sidebar */}
          <div className="pt-4 border-t border-warmborder/60 dark:border-white/10 text-center text-[10px] text-warmtext/40 dark:text-darktext/40">
            {isSidebarOpen ? `© ${new Date().getFullYear()} studylog` : '©'}
          </div>
        </aside>

        {/* Main Content Area - occupies remaining screen width */}
        <main className="flex-1 min-w-0 p-6 md:p-8 w-full relative">
          {children}
        </main>
      </div>

      {/* Floating Real-Time Clock */}
      {currentTime && (
        <div className="fixed bottom-4 right-4 z-40 bg-[#FDFCFB]/95 dark:bg-darkbg/95 backdrop-blur-md border border-warmborder dark:border-white/10 rounded-xl px-4.5 py-2.5 shadow-md text-sm font-semibold font-mono text-warmtext dark:text-darktext flex items-center gap-2 transition-colors duration-300">
          <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span>{currentTime}</span>
        </div>
      )}
    </div>
  )
}
