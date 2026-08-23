'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface StudySession {
  id: string
  user_id: string
  subject: string
  duration: number // in seconds
  notes: string | null
  timestamp: string
}

interface DashboardContextType {
  user: User | null
  profile: {
    id: string
    username: string
    full_name: string | null
  }
  sessions: StudySession[]
  isOfflineMode: boolean
  prefilledDuration: number | null
  setPrefilledDuration: (duration: number | null) => void
  handleAddSession: (sessionData: {
    subject: string
    duration: number // seconds
    notes: string
    timestamp: string
  }) => Promise<void>
  handleDeleteSession: (id: string) => Promise<void>
  authLoading: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

interface DashboardProviderProps {
  children: ReactNode
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const supabase = createClient()

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-project-url' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key'

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ id: string; username: string; full_name: string | null }>({
    id: '',
    username: 'user',
    full_name: '',
  })
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [isOfflineMode, setIsOfflineMode] = useState(!isSupabaseConfigured)
  const [prefilledDuration, setPrefilledDuration] = useState<number | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Fetch initial profile & study sessions from database exactly once on client mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user session first - local token verification is fast
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

        if (userError || !currentUser) {
          // If no authenticated user, stop loading and allow redirects/offline
          setUser(null)
          setAuthLoading(false)
          return
        }

        setUser(currentUser)
        setProfile((prev) => ({
          ...prev,
          id: currentUser.id,
          username: currentUser.email?.split('@')[0] || 'user',
        }))

        if (isOfflineMode) {
          setAuthLoading(false)
          return
        }

        // Fetch profile
        const { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (!profError && prof) {
          setProfile(prof)
        }

        // Fetch study history database
        const { data: sess, error: sessError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('timestamp', { ascending: false })

        if (!sessError && sess) {
          setSessions(sess)
        }
      } catch (err) {
        console.error('Failed to load user credentials from Supabase.', err)
        setIsOfflineMode(true)
      } finally {
        setAuthLoading(false)
      }
    }

    fetchUserData()
  }, [isOfflineMode, supabase])

  // Sync state if offline mode cache takes over
  useEffect(() => {
    if (isOfflineMode && user) {
      const stored = localStorage.getItem(`studylog_sessions_${user.id}`)
      if (stored) {
        try {
          setSessions(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse local sessions database', e)
        }
      }
    }
  }, [isOfflineMode, user])

  const saveSessions = (newSessions: StudySession[]) => {
    setSessions(newSessions)
    if (isOfflineMode && user) {
      localStorage.setItem(`studylog_sessions_${user.id}`, JSON.stringify(newSessions))
    }
  }

  const handleAddSession = async (sessionData: {
    subject: string
    duration: number
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
    setPrefilledDuration(null)
  }

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

  return (
    <DashboardContext.Provider
      value={{
        user,
        profile,
        sessions,
        isOfflineMode,
        prefilledDuration,
        setPrefilledDuration,
        handleAddSession,
        handleDeleteSession,
        authLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
