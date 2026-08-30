'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  LayoutDashboard,
  Clock,
  BookMarked,
  Target,
  Calendar,
  FileText,
  BarChart2,
  Award,
  Settings,
  Flame,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Sessions', href: '/dashboard/history', icon: Clock },
    { name: 'Subjects', href: '/dashboard/history?filter=subjects', icon: BookMarked },
    { name: 'Goals', href: '/dashboard/timer', icon: Target },
    { name: 'Calendar', href: '/dashboard/history?view=calendar', icon: Calendar },
    { name: 'Notes', href: '/dashboard/notes', icon: FileText },
    { name: 'Analytics', href: '/dashboard', icon: BarChart2 },
    { name: 'Achievements', href: '/dashboard/settings', icon: Award },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const displayName = profile.username || (user?.email ? user.email.split('@')[0] : 'mishrayashjay')
  const initial = (displayName.charAt(0) || 'M').toUpperCase()

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4.5 bg-[#07090e] text-white border-r border-white/[0.08] select-none">
      {/* Brand Header */}
      <div className="space-y-6">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:opacity-95 transition-opacity">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-display font-medium text-white text-lg tracking-tight">
            studylog
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href.split('?')[0]))

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/30 shadow-sm shadow-purple-950/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <link.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Area: Motivational Card + User Profile */}
      <div className="space-y-4 pt-4 border-t border-white/[0.06]">
        {/* "Keep going!" Motivational Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] shadow-inner">
          <div className="flex items-center gap-2 mb-1.5">
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            <span className="text-xs font-bold text-white tracking-tight">Keep going!</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
            You&apos;re building something great. Consistency is the key.
          </p>
          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 w-3/4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold text-zinc-400">75%</span>
            </div>
          </div>
        </div>

        {/* User Profile Row */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <Link href="/dashboard/settings" className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 transition-colors">View Profile</span>
                <ChevronDown className="h-3 w-3 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-1 text-zinc-400 hover:text-red-400 transition-colors ml-1"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col md:flex-row overflow-x-hidden font-sans">
      {/* ── Mobile Top Header Bar ── */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#07090e]/95 backdrop-blur-md sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-medium text-white text-base">studylog</span>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white rounded-lg"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ── Persistent Desktop Left Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* ── Main Canvas ── */}
      <main className="flex-1 min-w-0 bg-[#07090e] p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {authLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
            <span className="text-xs text-zinc-400 font-medium">Loading your study universe...</span>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
