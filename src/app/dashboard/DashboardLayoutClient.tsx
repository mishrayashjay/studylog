'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, LogOut, Menu, LayoutDashboard, Clock, History, Settings, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { useDashboard } from '@/context/DashboardContext'

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { profile, user, authLoading } = useDashboard()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Closed by default
  const [currentTime, setCurrentTime] = useState<string>('')

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

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Focus Timer', href: '/dashboard/timer', icon: Clock },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext flex flex-col">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[100px] pointer-events-none -z-10" />

      {/* Top Navigation Bar - flush to left edge */}
      <nav className="sticky top-0 z-30 border-b border-warmborder dark:border-white/10 bg-warmbg/80 dark:bg-darkbg/80 backdrop-blur-md h-[69px] flex items-center px-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-warmbg dark:hover:bg-white/10 rounded-lg text-warmtext/70 dark:text-darktext/75 hover:text-warmtext dark:hover:text-darktext transition-colors"
              aria-label="Toggle Sidebar Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 ml-2">
              <div className="p-1.5 bg-indigo-600 dark:bg-indigo-50 rounded-lg text-white shadow-sm">
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
                {profile.full_name || profile.username || user?.email || 'Scholar'}
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

      {/* Main Grid: Content wrapper */}
      <div className="flex-1 flex relative">
        {/* Full-width main container (no sidebars permanently showing) */}
        <main className="flex-grow p-6 md:p-8 w-full relative">
          {authLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600 dark:border-indigo-400" />
              <span className="text-[10px] text-warmtext/40 dark:text-darktext/40 font-bold uppercase tracking-widest">
                Authorizing study session...
              </span>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Semi-transparent dark overlay behind drawer */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ease-out"
          />
        )}

        {/* Slide-out drawer navigation (hidden by default, open on click) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FDFCFB] dark:bg-darkbg border-r border-warmborder dark:border-white/10 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-6 w-full">
            {/* Drawer Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-warmborder/60 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-600 dark:bg-indigo-50 rounded-lg text-white shadow-sm">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg tracking-tight font-display">studylog</span>
              </div>
              {/* Close icon button inside drawer */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-warmbg dark:hover:bg-white/10 rounded-lg text-warmtext/50 dark:text-darktext/50 hover:text-warmtext dark:hover:text-darktext transition-colors"
                aria-label="Close Sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Large, touch-friendly nav links */}
            <div className="space-y-2">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-base font-bold transition-colors duration-150 ${
                      isActive
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
                        : 'text-warmtext/60 dark:text-darktext/50 hover:bg-warmbg dark:hover:bg-white/10 hover:text-warmtext dark:hover:text-darktext'
                    }`}
                  >
                    <link.icon className="h-5.5 w-5.5 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Drawer Copyright Footer */}
          <div className="pt-4 border-t border-warmborder/60 dark:border-white/10 text-center text-xs text-warmtext/40 dark:text-darktext/40">
            &copy; {new Date().getFullYear()} studylog
          </div>
        </aside>
      </div>

      {/* Floating Real-Time Clock */}
      {currentTime && (
        <div className="fixed bottom-4 right-4 z-40 bg-[#FDFCFB] dark:bg-white/10 backdrop-blur-md border border-warmborder dark:border-white/20 rounded-xl px-4.5 py-2.5 shadow-md text-sm font-semibold font-mono text-warmtext dark:text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-300 animate-pulse" />
          <span>{currentTime}</span>
        </div>
      )}
    </div>
  )
}
