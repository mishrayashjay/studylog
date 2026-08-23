'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, LogOut, Menu, LayoutDashboard, Clock, PlusCircle, History, Settings } from 'lucide-react'
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Focus Timer', href: '/dashboard/timer', icon: Clock },
    { name: 'Log Session', href: '/dashboard/log', icon: PlusCircle },
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
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-darkbg/80 backdrop-blur-md transition-colors duration-200 h-[69px] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
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

            <div className="text-right hidden sm:block border-l border-slate-200 dark:border-white/10 pl-4">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Signed in as</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {profile.full_name || profile.username || user?.email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-2 text-sm font-semibold"
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
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:sticky top-[69px] z-40 h-[calc(100vh-69px)] border-r border-slate-200 dark:border-white/10 bg-white dark:bg-darkbg transition-all duration-300 ease-in-out flex flex-col justify-between p-4 shrink-0 overflow-y-auto ${
            isSidebarOpen
              ? 'w-64 translate-x-0'
              : 'w-0 -translate-x-full md:w-0 md:translate-x-0 pointer-events-none p-0 border-r-0'
          }`}
        >
          <div className="space-y-1.5 w-full">
            {navLinks.map((link) => {
              // Exact match for dashboard, startswith for subpages
              const isActive =
                link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-600/10'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <link.icon className="h-4.5 w-4.5" />
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Footer inside sidebar */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-center text-[10px] text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} studylog
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-6 md:p-8 max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
