'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  LayoutDashboard,
  Clock,
  Target,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useDashboard } from '@/context/DashboardContext'
import { createClient } from '@/utils/supabase/client'

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { profile, user, authLoading } = useDashboard()
  
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Desktop expand-on-hover state
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false)

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsDesktopExpanded(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', href: '/dashboard/history', icon: Clock },
    { name: 'Focus Timer', href: '/dashboard/timer', icon: Target },
    { name: 'Notes', href: '/dashboard/notes', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const displayName = profile.username || (user?.email ? user.email.split('@')[0] : 'Scholar')
  const initial = (displayName.charAt(0) || 'S').toUpperCase()

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col font-sans transition-colors duration-200">
      
      {/* ── MOBILE TOP NAVIGATION BAR WITH 3-LINE HAMBURGER TRIGGER ── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-sidebar/95 backdrop-blur-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-medium text-theme-text text-base">studylog</span>
        </Link>

        {/* 3-line Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-card rounded-xl border border-transparent hover:border-theme-border transition-all active:scale-95 flex items-center justify-center"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* ── MOBILE SLIDE-OVER DRAWER OVERLAY ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 h-full z-10 bg-theme-sidebar border-r border-theme-border shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col justify-between p-4.5 overflow-y-auto">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2 py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="font-display font-medium text-theme-text text-lg tracking-tight">
                    studylog
                  </span>
                </Link>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname === link.href || pathname.startsWith(`${link.href}/`)

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-400 dark:text-purple-300 border border-purple-500/40 shadow-sm font-semibold'
                          : 'text-theme-muted hover:text-theme-text hover:bg-theme-card'
                      }`}
                    >
                      <link.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-purple-400' : 'text-theme-muted'}`} />
                      <span>{link.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Profile Row */}
            <div className="pt-4 border-t border-theme-border mt-auto">
              <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-theme-card transition-colors cursor-pointer group">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-theme-text truncate">{displayName}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-theme-muted group-hover:text-theme-text transition-colors">View Profile</span>
                      <ChevronDown className="h-3 w-3 text-theme-muted group-hover:text-theme-text transition-colors" />
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-1 text-theme-muted hover:text-red-400 transition-colors ml-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP COLLAPSED / EXPAND-ON-HOVER SIDEBAR (FIXED TO VIEWPORT) ── */}
      <aside
        onMouseEnter={() => setIsDesktopExpanded(true)}
        onMouseLeave={() => setIsDesktopExpanded(false)}
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-theme-sidebar border-r border-theme-border h-screen transition-all duration-300 ease-in-out select-none overflow-x-hidden ${
          isDesktopExpanded ? 'w-64 shadow-2xl shadow-purple-950/20' : 'w-16 shadow-sm'
        }`}
      >
        <div className="flex flex-col justify-between h-full py-4.5 px-3 overflow-y-auto overflow-x-hidden">
          
          {/* Top Brand & Nav */}
          <div className="space-y-6">
            {/* Logo Row */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-1 py-1 group overflow-hidden"
              title="studylog"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0 group-hover:opacity-95 transition-opacity">
                <BookOpen className="h-4 w-4" />
              </div>
              <span
                className={`font-display font-medium text-theme-text text-lg tracking-tight whitespace-nowrap transition-all duration-200 ${
                  isDesktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
                }`}
              >
                studylog
              </span>
            </Link>

            {/* Navigation Items */}
            <nav className="space-y-1.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname === link.href || pathname.startsWith(`${link.href}/`)

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    title={!isDesktopExpanded ? link.name : undefined}
                    className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                      isDesktopExpanded ? 'gap-3.5 px-3.5 py-2.5' : 'justify-center p-2.5'
                    } ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-400 dark:text-purple-300 border border-purple-500/40 shadow-sm font-semibold'
                        : 'text-theme-muted hover:text-theme-text hover:bg-theme-card border border-transparent'
                    }`}
                  >
                    <link.icon
                      className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-purple-400 scale-105' : 'text-theme-muted'
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap transition-all duration-200 ${
                        isDesktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 w-0 hidden'
                      }`}
                    >
                      {link.name}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Bottom Profile Row */}
          <div className="pt-4 border-t border-theme-border mt-auto overflow-hidden">
            <div
              className={`flex items-center rounded-xl hover:bg-theme-card transition-colors cursor-pointer group ${
                isDesktopExpanded ? 'justify-between px-2 py-1.5' : 'justify-center py-1.5'
              }`}
            >
              <Link
                href="/dashboard/settings"
                title={!isDesktopExpanded ? `${displayName} (Settings)` : undefined}
                className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
                  {initial}
                </div>
                <div
                  className={`min-w-0 flex-1 transition-all duration-200 ${
                    isDesktopExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 w-0 hidden'
                  }`}
                >
                  <p className="text-xs font-semibold text-theme-text truncate">{displayName}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-theme-muted group-hover:text-theme-text transition-colors">View Profile</span>
                    <ChevronDown className="h-3 w-3 text-theme-muted group-hover:text-theme-text transition-colors" />
                  </div>
                </div>
              </Link>
              
              {isDesktopExpanded && (
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-1 text-theme-muted hover:text-red-400 transition-colors ml-1 shrink-0 animate-in fade-in duration-150"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </aside>

      {/* ── MAIN CANVAS (OFFSET BY COLLAPSED SIDEBAR MARGIN ON DESKTOP) ── */}
      <main className="flex-1 min-w-0 md:ml-16 bg-theme-bg p-4 sm:p-6 lg:p-8 transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto">
          {authLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
              <span className="text-xs text-theme-muted font-medium">Loading your study universe...</span>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

    </div>
  )
}
