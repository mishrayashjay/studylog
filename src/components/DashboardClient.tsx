'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, LogOut, WifiOff } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import Timer from './Timer'
import QuickAddForm from './QuickAddForm'
import Stats from './Stats'
import SessionHistory from './SessionHistory'
import ThemeToggle from './ThemeToggle'

export interface StudySession {
  id: string
  user_id: string
  subject: string
  duration: number // in seconds
  notes: string | null
  timestamp: string
}

interface DashboardClientProps {
  user: User | null
  profile: {
    id: string
    username: string
    full_name: string | null
  }
  initialSessions: StudySession[]
}

export default function DashboardClient({ user, profile, initialSessions }: DashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()

  // Determine if Supabase credentials are missing or placeholders
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-project-url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key'

  const [sessions, setSessions] = useState<StudySession[]>(initialSessions)
  const [isOfflineMode, setIsOfflineMode] = useState(!isSupabaseConfigured)

  // Timer-Form interaction states
  const [prefilledDuration, setPrefilledDuration] = useState<number | null>(null) // duration in seconds

  // Synchronize state with localStorage if in offline mode
  useEffect(() => {
    if (isOfflineMode) {
      const stored = localStorage.getItem(`studylog_sessions_${user?.id || 'local'}`)
      if (stored) {
        try {
          setSessions(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse local sessions', e)
        }
      } else if (initialSessions.length > 0) {
        setSessions(initialSessions)
      }
    } else {
      setSessions(initialSessions)
    }
  }, [isOfflineMode, initialSessions, user?.id])

  const saveSessions = (newSessions: StudySession[]) => {
    setSessions(newSessions)
    if (isOfflineMode) {
      localStorage.setItem(`studylog_sessions_${user?.id || 'local'}`, JSON.stringify(newSessions))
    }
  }

  // Action: Add Session
  const handleAddSession = async (sessionData: {
    subject: string
    duration: number // seconds
    notes: string
    timestamp: string
  }) => {
    const newSessionItem: Omit<StudySession, 'id'> = {
      user_id: user?.id || 'local-user',
      subject: sessionData.subject,
      duration: sessionData.duration,
      notes: sessionData.notes || null,
      timestamp: sessionData.timestamp,
    }

    if (isOfflineMode) {
      const sessionWithId: StudySession = {
        ...newSessionItem,
        id: Math.random().toString(36).substr(2, 9),
      }
      const updated = [sessionWithId, ...sessions]
      saveSessions(updated)
    } else {
      try {
        const { data, error } = await supabase
          .from('study_sessions')
          .insert([newSessionItem])
          .select()

        if (error) throw error

        if (data && data[0]) {
          const updated = [data[0], ...sessions]
          setSessions(updated)
        }
      } catch (err) {
        console.error('Failed to add session to Supabase, falling back to local storage', err)
        setIsOfflineMode(true)
        const sessionWithId: StudySession = {
          ...newSessionItem,
          id: Math.random().toString(36).substr(2, 9),
        }
        const updated = [sessionWithId, ...sessions]
        saveSessions(updated)
      }
    }
    setPrefilledDuration(null) // Reset timer transfer
  }

  // Action: Delete Session
  const handleDeleteSession = async (id: string) => {
    if (isOfflineMode) {
      const updated = sessions.filter((s) => s.id !== id)
      saveSessions(updated)
    } else {
      try {
        const { error } = await supabase.from('study_sessions').delete().eq('id', id)

        if (error) throw error

        setSessions(sessions.filter((s) => s.id !== id))
      } catch (err) {
        console.error('Failed to delete session, falling back to local edit', err)
        setIsOfflineMode(true)
        const updated = sessions.filter((s) => s.id !== id)
        saveSessions(updated)
      }
    }
  }

  // Action: Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 font-sans pb-12 transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-600/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 dark:bg-purple-600/5 blur-[100px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-darkbg/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-lg text-white shadow-sm shadow-indigo-600/10">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight font-display">studylog</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="text-right hidden sm:block border-l border-slate-200 dark:border-white/10 pl-4">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Signed in as</p>
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

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-6 relative z-10">
        {/* Offline / Supabase Warning Banner */}
        {isOfflineMode && (
          <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl text-amber-800 dark:text-amber-400 text-sm flex items-start gap-3 transition-colors duration-200">
            <WifiOff className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold">Offline / Local Mode Enabled</p>
              <p className="mt-1 text-amber-700 dark:text-amber-400/80 leading-relaxed text-xs">
                Supabase URL & Anon Key are not configured in your <code>.env.local</code>. Data will be saved in your browser&apos;s local storage. Configure environment variables to enable cloud syncing.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Timer & Log Form */}
          <div className="lg:col-span-5 space-y-6">
            <Timer onTimerStop={(duration) => setPrefilledDuration(duration)} />

            <QuickAddForm
              onAddSession={handleAddSession}
              prefilledDuration={prefilledDuration}
              onClearPrefill={() => setPrefilledDuration(null)}
            />
          </div>

          {/* Right Column: Statistics */}
          <div className="lg:col-span-7">
            <Stats sessions={sessions} />
          </div>
        </div>

        {/* Bottom Section: Past Sessions History */}
        <div className="w-full">
          <SessionHistory sessions={sessions} onDeleteSession={handleDeleteSession} />
        </div>
      </div>
    </div>
  )
}
