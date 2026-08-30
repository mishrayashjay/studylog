'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Flame, Clock, ArrowRight } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { createClient } from '@/utils/supabase/client'

export default function Navbar() {
  const [streak, setStreak] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const checkUserStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('streak')
            .eq('id', session.user.id)
            .single()
          if (profile?.streak && profile.streak > 0) {
            setStreak(profile.streak)
            return
          }
        }
        // Fallback to local storage if offline
        const localSessions = localStorage.getItem('study_sessions')
        if (localSessions) {
          const parsed = JSON.parse(localSessions)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const days = new Set(parsed.map((s: { timestamp: string }) => new Date(s.timestamp).toDateString()))
            setStreak(days.size)
            return
          }
        }
      } catch {
        // Graceful fallback to static placeholder
      }
    }
    checkUserStats()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0b0d14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-3.5 flex items-center justify-between">
        
        {/* Left: Brand Logo & Streak/Time Pill */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Rounded square with purple-to-violet gradient */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:opacity-95 transition-opacity">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-display font-medium text-white text-lg tracking-tight">
              studylog
            </span>
          </Link>

          {/* Pill-shaped stats element */}
          <div className="hidden md:flex items-center gap-2.5 rounded-full bg-white/[0.05] border border-white/10 px-3.5 py-1.5 text-xs text-white/90 shadow-inner">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
              <span className="font-medium text-white/90">
                {streak !== null && streak > 0 ? `${streak} day streak` : '7 day streak'}
              </span>
            </div>
            <div className="w-[1px] h-3.5 bg-white/15" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-medium text-white/80">2,400+ hrs logged</span>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle, Sign In Link & Gradient Get Started Button */}
        <div className="flex items-center gap-4 sm:gap-5">
          <ThemeToggle className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center" />

          <Link
            href="/login"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/login?tab=signup"
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white rounded-xl shadow-md shadow-purple-500/20 transition-all active:scale-[0.98]"
          >
            <span>Get started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </header>
  )
}
