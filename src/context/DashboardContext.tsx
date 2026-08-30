'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface StudySession {
  id: string
  user_id: string
  subject: string
  section?: string | null
  duration: number // in seconds
  notes: string | null
  timestamp: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  category?: string
  created_at: string
  updated_at: string
}

export interface ActiveTimerState {
  isRunning: boolean
  seconds: number
  subject: string
  mode: 'stopwatch' | 'timer'
  targetDuration: number // seconds for timer countdown (e.g. 1500 = 25m)
}

interface DashboardContextType {
  user: User | null
  profile: {
    id: string
    username: string
    full_name: string | null
  }
  sessions: StudySession[]
  notes: Note[]
  customSubjects: string[]
  addCustomSubject: (subject: string) => void
  isOfflineMode: boolean
  prefilledDuration: number | null
  setPrefilledDuration: (duration: number | null) => void
  handleAddSession: (sessionData: {
    subject: string
    section?: string | null
    duration: number // seconds
    notes: string
    timestamp: string
  }) => Promise<void>
  handleUpdateSession: (id: string, updates: Partial<StudySession>) => Promise<void>
  handleDeleteSession: (id: string) => Promise<void>
  handleAddNote: (title?: string, content?: string, category?: string) => Promise<Note>
  handleUpdateNoteState: (id: string, updates: Partial<Note>) => void
  handleUpdateNote: (id: string, updates: Partial<Note>) => Promise<void>
  handleDeleteNote: (id: string) => Promise<void>
  authLoading: boolean
  timerState: ActiveTimerState
  startTimer: (newSubject?: string) => void
  pauseTimer: () => void
  resetTimer: () => void
  setTimerSubject: (subject: string) => void
  setTimerMode: (mode: 'stopwatch' | 'timer') => void
  setTimerTargetDuration: (duration: number) => void
  stopAndLogTimer: (notes?: string) => Promise<void>
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

const supabase = createClient()

export function DashboardProvider({ children }: DashboardProviderProps) {

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
  const [notes, setNotes] = useState<Note[]>([])
  const [customSubjects, setCustomSubjects] = useState<string[]>([])
  const [isOfflineMode, setIsOfflineMode] = useState(!isSupabaseConfigured)
  const [prefilledDuration, setPrefilledDuration] = useState<number | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Load custom subjects from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('studylog_custom_subjects')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setCustomSubjects(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const addCustomSubject = useCallback((newSubject: string) => {
    const trimmed = newSubject.trim()
    if (!trimmed) return
    setCustomSubjects((prev) => {
      if (prev.includes(trimmed)) return prev
      const updated = [trimmed, ...prev]
      try {
        localStorage.setItem('studylog_custom_subjects', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }, [])

  // Fetch initial profile, study sessions, and notes from database exactly once on client mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user session first
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

        if (userError || !currentUser) {
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

        // Fetch study notes database
        const { data: nts, error: ntsError } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('updated_at', { ascending: false })

        if (!ntsError && nts) {
          setNotes(nts)
        }
      } catch (err) {
        console.error('Failed to load user credentials from Supabase.', err)
        setIsOfflineMode(true)
      } finally {
        setAuthLoading(false)
      }
    }

    fetchUserData()
  }, [isOfflineMode])

  // Sync state if offline mode cache takes over
  useEffect(() => {
    if (isOfflineMode && user) {
      // Sync sessions
      const storedSess = localStorage.getItem(`studylog_sessions_${user.id}`)
      if (storedSess) {
        try {
          setSessions(JSON.parse(storedSess))
        } catch (e) {
          console.error('Failed to parse local sessions database', e)
        }
      }

      // Sync notes
      const storedNotes = localStorage.getItem(`studylog_notes_${user.id}`)
      if (storedNotes) {
        try {
          setNotes(JSON.parse(storedNotes))
        } catch (e) {
          console.error('Failed to parse local notes database', e)
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

  const handleAddSession = useCallback(async (sessionData: {
    subject: string
    section?: string | null
    duration: number
    notes: string
    timestamp: string
  }) => {
    const newSessionItem: Omit<StudySession, 'id'> = {
      user_id: user?.id || 'local-user',
      subject: sessionData.subject,
      section: sessionData.section || null,
      duration: sessionData.duration,
      notes: sessionData.notes || null,
      timestamp: sessionData.timestamp,
    }

    if (isOfflineMode) {
      const sessionWithId: StudySession = {
        ...newSessionItem,
        id: Math.random().toString(36).substr(2, 9),
      }
      setSessions((prev) => {
        const updated = [sessionWithId, ...prev]
        if (user) {
          localStorage.setItem(`studylog_sessions_${user.id}`, JSON.stringify(updated))
        }
        return updated
      })
    } else {
      try {
        const { data, error } = await supabase
          .from('study_sessions')
          .insert([newSessionItem])
          .select()

        if (error) throw error

        if (data && data[0]) {
          setSessions((prev) => [data[0], ...prev])
        }
      } catch (err) {
        console.error('Failed to add session to Supabase, falling back to local storage', err)
        setIsOfflineMode(true)
        const sessionWithId: StudySession = {
          ...newSessionItem,
          id: Math.random().toString(36).substr(2, 9),
        }
        setSessions((prev) => {
          const updated = [sessionWithId, ...prev]
          if (user) {
            localStorage.setItem(`studylog_sessions_${user.id}`, JSON.stringify(updated))
          }
          return updated
        })
      }
    }
    setPrefilledDuration(null)
  }, [isOfflineMode, user])

  const handleUpdateSession = useCallback(async (id: string, updates: Partial<StudySession>) => {
    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )

    if (isOfflineMode) {
      if (user) {
        const stored = localStorage.getItem(`studylog_sessions_${user.id}`)
        if (stored) {
          try {
            const list: StudySession[] = JSON.parse(stored)
            const updated = list.map((s) => (s.id === id ? { ...s, ...updates } : s))
            localStorage.setItem(`studylog_sessions_${user.id}`, JSON.stringify(updated))
          } catch (e) {
            console.error('Failed to update local session storage', e)
          }
        }
      }
    } else {
      try {
        const { error } = await supabase
          .from('study_sessions')
          .update(updates)
          .eq('id', id)
        if (error) throw error
      } catch (err) {
        console.error('Failed to update session in Supabase, saving to local cache', err)
        setIsOfflineMode(true)
        if (user) {
          const stored = localStorage.getItem(`studylog_sessions_${user.id}`)
          if (stored) {
            try {
              const list: StudySession[] = JSON.parse(stored)
              const updated = list.map((s) => (s.id === id ? { ...s, ...updates } : s))
              localStorage.setItem(`studylog_sessions_${user.id}`, JSON.stringify(updated))
            } catch {}
          }
        }
      }
    }
  }, [isOfflineMode, user])

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

  const handleAddNote = useCallback(async (title = 'Untitled Note', content = '', category = 'General') => {
    const newNoteItem = {
      user_id: user?.id || 'local-user',
      title,
      content,
      category,
    }

    if (isOfflineMode) {
      const noteWithId: Note = {
        ...newNoteItem,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setNotes((prev) => {
        const updated = [noteWithId, ...prev]
        if (user) {
          localStorage.setItem(`studylog_notes_${user.id}`, JSON.stringify(updated))
        }
        return updated
      })
      return noteWithId
    } else {
      try {
        const { data, error } = await supabase
          .from('notes')
          .insert([newNoteItem])
          .select()

        if (error) throw error

        if (data && data[0]) {
          setNotes((prev) => [data[0], ...prev])
          return data[0]
        }
        throw new Error('Failed to insert note')
      } catch (err) {
        console.error('Failed to add note to Supabase, falling back to local storage', err)
        setIsOfflineMode(true)
        const noteWithId: Note = {
          ...newNoteItem,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setNotes((prev) => {
          const updated = [noteWithId, ...prev]
          if (user) {
            localStorage.setItem(`studylog_notes_${user.id}`, JSON.stringify(updated))
          }
          return updated
        })
        throw err
      }
    }
  }, [isOfflineMode, user])

  const handleUpdateNoteState = useCallback((id: string, updates: Partial<Note>) => {
    const updatedTime = new Date().toISOString()
    const fullUpdates = {
      ...updates,
      updated_at: updatedTime,
    }

    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((n) => (n.id === id ? { ...n, ...fullUpdates } : n))
      updatedNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      if (isOfflineMode && user) {
        localStorage.setItem(`studylog_notes_${user.id}`, JSON.stringify(updatedNotes))
      }
      return updatedNotes
    })
  }, [isOfflineMode, user])

  const handleUpdateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    if (isOfflineMode) return

    const updatedTime = new Date().toISOString()
    const fullUpdates = {
      ...updates,
      updated_at: updatedTime,
    }

    try {
      const { error } = await supabase
        .from('notes')
        .update(fullUpdates)
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Failed to update note in Supabase, falling back to local storage', err)
      setIsOfflineMode(true)
      setNotes((prevNotes) => {
        if (user) {
          localStorage.setItem(`studylog_notes_${user.id}`, JSON.stringify(prevNotes))
        }
        return prevNotes
      })
      throw err
    }
  }, [isOfflineMode, user])

  const handleDeleteNote = useCallback(async (id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id)
      if (isOfflineMode && user) {
        localStorage.setItem(`studylog_notes_${user.id}`, JSON.stringify(updated))
      }
      return updated
    })

    if (!isOfflineMode) {
      try {
        const { error } = await supabase.from('notes').delete().eq('id', id)
        if (error) throw error
      } catch (err) {
        console.error('Failed to delete note from Supabase, falling back to local storage', err)
        setIsOfflineMode(true)
        setNotes((prev) => {
          if (user) {
            localStorage.setItem(`studylog_notes_${user.id}`, JSON.stringify(prev))
          }
          return prev
        })
        throw err
      }
    }
  }, [isOfflineMode, user])

  // ── Global Live Timer State ──
  const [timerState, setTimerState] = useState<ActiveTimerState>({
    isRunning: false,
    seconds: 0,
    subject: '',
    mode: 'timer',
    targetDuration: 1500, // 25 mins default
  })

  // Precision timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState((prev) => {
          const nextSecs = prev.seconds + 1
          if (prev.mode === 'timer' && nextSecs >= prev.targetDuration) {
            // Reached countdown target
            return { ...prev, seconds: prev.targetDuration, isRunning: false }
          }
          return { ...prev, seconds: nextSecs }
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerState.isRunning])

  const startTimer = useCallback((newSubject?: string) => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      subject: newSubject || prev.subject || 'General Study',
    }))
  }, [])

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isRunning: false }))
  }, [])

  const resetTimer = useCallback(() => {
    setTimerState((prev) => ({ ...prev, isRunning: false, seconds: 0 }))
  }, [])

  const setTimerSubject = useCallback((subject: string) => {
    setTimerState((prev) => ({ ...prev, subject }))
  }, [])

  const setTimerMode = useCallback((mode: 'stopwatch' | 'timer') => {
    setTimerState((prev) => ({
      ...prev,
      mode,
      seconds: 0,
      isRunning: false,
    }))
  }, [])

  const setTimerTargetDuration = useCallback((targetDuration: number) => {
    setTimerState((prev) => ({
      ...prev,
      targetDuration,
      seconds: 0,
      isRunning: false,
    }))
  }, [])

  const stopAndLogTimer = useCallback(async (notes?: string) => {
    const duration = timerState.seconds
    const subject = timerState.subject || 'General Study'
    setTimerState((prev) => ({ ...prev, isRunning: false, seconds: 0 }))
    if (duration > 0) {
      await handleAddSession({
        subject,
        duration,
        notes: notes || 'Live focus session',
        timestamp: new Date().toISOString(),
      })
    }
  }, [timerState.seconds, timerState.subject, handleAddSession])

  return (
    <DashboardContext.Provider
      value={{
        user,
        profile,
        sessions,
        notes,
        customSubjects,
        addCustomSubject,
        isOfflineMode,
        prefilledDuration,
        setPrefilledDuration,
        handleAddSession,
        handleUpdateSession,
        handleDeleteSession,
        handleAddNote,
        handleUpdateNoteState,
        handleUpdateNote,
        handleDeleteNote,
        authLoading,
        timerState,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimerSubject,
        setTimerMode,
        setTimerTargetDuration,
        stopAndLogTimer,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
