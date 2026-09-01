'use client'

import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react'
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

export interface SectionNote {
  id: string
  user_id: string
  section_name: string
  content: string
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
  sectionNotes: SectionNote[]
  customSubjects: string[]
  allSubjects: string[]
  addCustomSubject: (subject: string) => void
  handleSaveSectionNote: (sectionName: string, content: string) => Promise<void>
  handleGetSectionNote: (sectionName: string) => string
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
  updateUsername: (newUsername: string) => Promise<{ success: boolean; error?: string }>
  updateFullName: (newFullName: string) => Promise<{ success: boolean; error?: string }>
  requestEmailChange: (newEmail: string) => Promise<{ success: boolean; error?: string; message?: string }>
  verifyEmailChangeOtp: (newEmail: string, token: string) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
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
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ id: string; username: string; full_name: string | null }>({
    id: '',
    username: 'user',
    full_name: '',
  })
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [sectionNotes, setSectionNotes] = useState<SectionNote[]>([])
  const [customSubjects, setCustomSubjects] = useState<string[]>([])
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [prefilledDuration, setPrefilledDuration] = useState<number | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const addCustomSubject = useCallback((newSubject: string) => {
    const trimmed = newSubject.trim()
    if (!trimmed) return
    setCustomSubjects((prev) => {
      if (prev.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return prev
      return [trimmed, ...prev]
    })
  }, [])

  // ── Unified Master Subjects & Sections List Across Entire App ──
  const allSubjects = useMemo(() => {
    const set = new Set<string>()
    customSubjects.forEach((s) => s && s.trim() && set.add(s.trim()))
    sectionNotes.forEach((sn) => sn.section_name && sn.section_name.trim() && set.add(sn.section_name.trim()))
    sessions.forEach((s) => {
      if (s.subject && s.subject.trim()) set.add(s.subject.trim())
      if (s.section && s.section.trim()) set.add(s.section.trim())
    })
    notes.forEach((n) => {
      if (n.category && n.category.trim() && n.category.trim().toLowerCase() !== 'general') {
        set.add(n.category.trim())
      }
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }, [customSubjects, sectionNotes, sessions, notes])

  // ── Direct Supabase Data Fetching for Authenticated User ──
  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

      if (userError || !currentUser) {
        setUser(null)
        setProfile({ id: '', username: 'user', full_name: '' })
        setSessions([])
        setNotes([])
        setSectionNotes([])
        setCustomSubjects([])
        setAuthLoading(false)
        return
      }

      setUser(currentUser)
      setProfile((prev) => ({
        ...prev,
        id: currentUser.id,
        username: currentUser.email?.split('@')[0] || 'scholar',
      }))

      // Fetch remote profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (prof) {
        setProfile(prof)
      }

      // Fetch study sessions directly from Supabase
      const { data: sess, error: sessError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('timestamp', { ascending: false })

      if (!sessError && sess) {
        setSessions(sess)
      }

      // Fetch notes directly from Supabase
      const { data: nts, error: ntsError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false })

      let currentNotes: Note[] = []
      if (!ntsError && nts) {
        currentNotes = nts
        setNotes(nts)
      }

      // Fetch section notes directly from Supabase
      try {
        const { data: secNotes, error: secNotesError } = await supabase
          .from('section_notes')
          .select('*')
          .eq('user_id', currentUser.id)

        if (!secNotesError && secNotes) {
          setSectionNotes(secNotes)
          // Ensure any existing section_notes appear in notes list
          secNotes.forEach((sn) => {
            if (
              sn.section_name &&
              !currentNotes.some(
                (n) => n.category && n.category.trim().toLowerCase() === sn.section_name.trim().toLowerCase()
              )
            ) {
              const autoNote: Note = {
                id: sn.id || Math.random().toString(36).substr(2, 9),
                user_id: currentUser.id,
                title: `${sn.section_name} Notes`,
                content: sn.content,
                category: sn.section_name,
                created_at: sn.created_at || new Date().toISOString(),
                updated_at: sn.updated_at || new Date().toISOString(),
              }
              currentNotes.push(autoNote)
            }
          })
          currentNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          setNotes([...currentNotes])
        }
      } catch {
        // section_notes table may not exist yet
      }

      setIsOfflineMode(false)
    } catch (err) {
      console.error('Failed to load user data from Supabase:', err)
      setIsOfflineMode(true)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // Initial fetch and subscribe to Supabase Auth State Changes
  useEffect(() => {
    fetchUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[Auth Listener] Supabase auth state change:', event)
      fetchUserData()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  // ── Session Handlers (Direct to Supabase) ──
  const handleAddSession = useCallback(async (sessionData: {
    subject: string
    section?: string | null
    duration: number
    notes: string
    timestamp: string
  }) => {
    if (!user) return

    if (sessionData.subject) addCustomSubject(sessionData.subject)
    if (sessionData.section) addCustomSubject(sessionData.section)

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{
          user_id: user.id,
          subject: sessionData.subject,
          section: sessionData.section || null,
          duration: sessionData.duration,
          notes: sessionData.notes || null,
          timestamp: sessionData.timestamp,
        }])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setSessions((prev) => [data[0], ...prev])
      }
    } catch (err) {
      console.error('Failed to insert session into Supabase:', err)
      throw err
    }

    setPrefilledDuration(null)
  }, [user, addCustomSubject])

  const handleUpdateSession = useCallback(async (id: string, updates: Partial<StudySession>) => {
    if (!user) return

    if (updates.subject) addCustomSubject(updates.subject)
    if (updates.section) addCustomSubject(updates.section)

    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )

    try {
      const { error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      console.error('Failed to update session in Supabase:', err)
      throw err
    }
  }, [user, addCustomSubject])

  const handleDeleteSession = useCallback(async (id: string) => {
    if (!user) return

    setSessions((prev) => prev.filter((s) => s.id !== id))

    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      console.error('Failed to delete session from Supabase:', err)
      throw err
    }
  }, [user])

  const handleAddNote = useCallback(async (title = 'Untitled Note', content = '', category = 'General'): Promise<Note> => {
    if (!user) {
      throw new Error('User must be authenticated to add notes')
    }

    if (category && category.trim() && category.trim().toLowerCase() !== 'general') {
      addCustomSubject(category.trim())
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title,
          content,
          category,
        }])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setNotes((prev) => [data[0], ...prev])
        return data[0]
      }
      throw new Error('Failed to create note in database')
    } catch (err) {
      console.error('Failed to insert note into Supabase:', err)
      throw err
    }
  }, [user, addCustomSubject])

  const handleUpdateNoteState = useCallback((id: string, updates: Partial<Note>) => {
    const updatedTime = new Date().toISOString()
    const fullUpdates = {
      ...updates,
      updated_at: updatedTime,
    }

    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((n) => (n.id === id ? { ...n, ...fullUpdates } : n))
      return updatedNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    })
  }, [])

  const handleUpdateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    if (!user) return

    const updatedTime = new Date().toISOString()
    const fullUpdates = {
      ...updates,
      updated_at: updatedTime,
    }

    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((n) => (n.id === id ? { ...n, ...fullUpdates } : n))
      return updatedNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    })

    try {
      const { error } = await supabase
        .from('notes')
        .update(fullUpdates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      console.error('Failed to update note in Supabase:', err)
      throw err
    }
  }, [user])

  const handleDeleteNote = useCallback(async (id: string) => {
    if (!user) return

    setNotes((prev) => prev.filter((n) => n.id !== id))

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      console.error('Failed to delete note from Supabase:', err)
      throw err
    }
  }, [user])

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
        setTimerState((prev) => ({
          ...prev,
          seconds: prev.seconds + 1,
        }))
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
    if (duration > 0 && user) {
      await handleAddSession({
        subject,
        duration,
        notes: notes || 'Live focus session',
        timestamp: new Date().toISOString(),
      })
    }
  }, [timerState.seconds, timerState.subject, user, handleAddSession])

  const handleSaveSectionNote = useCallback(async (sectionName: string, content: string) => {
    if (!user) return
    const trimmed = sectionName.trim()
    if (!trimmed) return

    addCustomSubject(trimmed)

    const updatedTime = new Date().toISOString()

    // 1. Check if a note already exists in unified notes matching this category/section
    const existingNote = notes.find(
      (n) =>
        (n.category && n.category.trim().toLowerCase() === trimmed.toLowerCase()) ||
        n.title.trim().toLowerCase() === `${trimmed.toLowerCase()} notes`
    )

    if (existingNote) {
      handleUpdateNoteState(existingNote.id, {
        content,
        category: trimmed,
        updated_at: updatedTime,
      })
      await handleUpdateNote(existingNote.id, {
        content,
        category: trimmed,
        updated_at: updatedTime,
      })
    } else {
      await handleAddNote(`${trimmed} Notes`, content, trimmed)
    }

    // 2. Also keep sectionNotes state in sync and persist to section_notes table
    setSectionNotes((prev) => {
      const existing = prev.find((sn) => sn.section_name.toLowerCase() === trimmed.toLowerCase())
      if (existing) {
        return prev.map((sn) =>
          sn.section_name.toLowerCase() === trimmed.toLowerCase()
            ? { ...sn, content, updated_at: updatedTime }
            : sn
        )
      } else {
        const newNote: SectionNote = {
          id: Math.random().toString(36).substr(2, 9),
          user_id: user.id,
          section_name: trimmed,
          content,
          created_at: updatedTime,
          updated_at: updatedTime,
        }
        return [newNote, ...prev]
      }
    })

    try {
      await supabase
        .from('section_notes')
        .upsert(
          {
            user_id: user.id,
            section_name: trimmed,
            content,
            updated_at: updatedTime,
          },
          { onConflict: 'user_id,section_name' }
        )
    } catch {
      // ignore if section_notes table is not present yet
    }
  }, [user, addCustomSubject, notes, handleUpdateNoteState, handleUpdateNote, handleAddNote])

  const handleGetSectionNote = useCallback((sectionName: string): string => {
    const trimmed = sectionName.trim().toLowerCase()
    const foundNote = notes.find(
      (n) =>
        (n.category && n.category.trim().toLowerCase() === trimmed) ||
        n.title.trim().toLowerCase() === `${trimmed} notes`
    )
    if (foundNote) return foundNote.content

    const foundSec = sectionNotes.find((sn) => sn.section_name.toLowerCase() === trimmed)
    return foundSec ? foundSec.content : ''
  }, [notes, sectionNotes])

  // ── Profile & Account Management ──
  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (!userError && currentUser) {
        setUser(currentUser)
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        if (prof) {
          setProfile(prof)
        } else {
          setProfile({
            id: currentUser.id,
            username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'scholar',
            full_name: currentUser.user_metadata?.full_name || null,
          })
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const updateUsername = useCallback(async (newUsername: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = newUsername.trim()
    if (!trimmed) {
      return { success: false, error: 'Username cannot be empty.' }
    }
    if (trimmed.length < 3 || trimmed.length > 30) {
      return { success: false, error: 'Username must be between 3 and 30 characters.' }
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return { success: false, error: 'Username can only contain letters, numbers, and underscores.' }
    }

    if (!user) {
      return { success: false, error: 'You must be signed in to update your username.' }
    }

    try {
      // 1. Try updating existing row in profiles table
      const { data: updateData, error: profileError } = await supabase
        .from('profiles')
        .update({
          username: trimmed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()

      if (profileError) {
        if (
          profileError.code === '23505' ||
          profileError.message?.toLowerCase().includes('unique') ||
          profileError.message?.toLowerCase().includes('duplicate')
        ) {
          return { success: false, error: 'This username is already taken. Please choose another one.' }
        }
        return { success: false, error: profileError.message }
      }

      // If no row existed, insert a new profile row
      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: trimmed,
            full_name: profile.full_name || '',
            updated_at: new Date().toISOString(),
          })

        if (insertError) {
          if (
            insertError.code === '23505' ||
            insertError.message?.toLowerCase().includes('unique') ||
            insertError.message?.toLowerCase().includes('duplicate')
          ) {
            return { success: false, error: 'This username is already taken. Please choose another one.' }
          }
          return { success: false, error: insertError.message }
        }
      }

      // 2. Update user_metadata in Supabase Auth
      await supabase.auth.updateUser({
        data: {
          username: trimmed,
        },
      })

      // 3. Update local state immediately so all components across the app update in real time
      setProfile((prev) => ({
        ...prev,
        username: trimmed,
      }))

      return { success: true }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update username.'
      return { success: false, error: errorMsg }
    }
  }, [user, profile.full_name])

  const updateFullName = useCallback(async (newFullName: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = newFullName.trim()
    if (!user) {
      return { success: false, error: 'You must be signed in to update your profile.' }
    }

    try {
      const { data: updateData, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: trimmed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()

      if (profileError) {
        return { success: false, error: profileError.message }
      }

      if (!updateData || updateData.length === 0) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: profile.username || user.email?.split('@')[0] || 'scholar',
            full_name: trimmed,
            updated_at: new Date().toISOString(),
          })

        if (insertError) {
          return { success: false, error: insertError.message }
        }
      }

      await supabase.auth.updateUser({
        data: {
          full_name: trimmed,
        },
      })

      setProfile((prev) => ({
        ...prev,
        full_name: trimmed,
      }))

      return { success: true }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update full name.'
      return { success: false, error: errorMsg }
    }
  }, [user, profile.username])

  const requestEmailChange = useCallback(async (newEmail: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    const trimmed = newEmail.trim().toLowerCase()
    if (!trimmed) {
      return { success: false, error: 'Email address cannot be empty.' }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { success: false, error: 'Please enter a valid email address.' }
    }
    if (user && user.email && trimmed === user.email.toLowerCase()) {
      return { success: false, error: 'The new email is the same as your current email.' }
    }

    if (!user) {
      return { success: false, error: 'You must be signed in to change your email.' }
    }

    try {
      const { error } = await supabase.auth.updateUser(
        { email: trimmed },
        { emailRedirectTo: `${window.location.origin}/auth/callback` }
      )

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        message: `Confirmation sent to ${trimmed}! Please enter the verification code or click the confirmation link in your email.`,
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request email change.'
      return { success: false, error: errorMsg }
    }
  }, [user])

  const verifyEmailChangeOtp = useCallback(async (newEmail: string, token: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = newEmail.trim().toLowerCase()
    const trimmedToken = token.trim()
    if (!trimmedToken) {
      return { success: false, error: 'Please enter the verification code.' }
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: trimmedToken,
        type: 'email_change',
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Refresh current user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (!userError && userData?.user) {
        setUser(userData.user)
      }

      return { success: true }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to verify email change code.'
      return { success: false, error: errorMsg }
    }
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        user,
        profile,
        sessions,
        notes,
        sectionNotes,
        customSubjects,
        allSubjects,
        addCustomSubject,
        handleSaveSectionNote,
        handleGetSectionNote,
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
        updateUsername,
        updateFullName,
        requestEmailChange,
        verifyEmailChangeOtp,
        refreshUser,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
