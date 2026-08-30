'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { StudySession, useDashboard } from '@/context/DashboardContext'
import {
  Search,
  Calendar,
  Trash2,
  Clock,
  AlertCircle,
  Folder,
  Plus,
  Check,
  X,
  ChevronDown,
  Tag,
  AlertTriangle
} from 'lucide-react'

interface SessionHistoryProps {
  sessions: StudySession[]
  onDeleteSession: (id: string) => Promise<void>
}

export default function SessionHistory({ sessions, onDeleteSession }: SessionHistoryProps) {
  const { customSubjects, addCustomSubject, handleUpdateSession } = useDashboard()

  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  // Section Assignment Popover State
  const [openSectionDropdownId, setOpenSectionDropdownId] = useState<string | null>(null)
  const [isCreatingNewSection, setIsCreatingNewSection] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')

  // Custom In-App Delete Confirmation Modal State
  const [sessionToDelete, setSessionToDelete] = useState<StudySession | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenSectionDropdownId(null)
        setIsCreatingNewSection(false)
        setNewSectionName('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close delete modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sessionToDelete) {
          setSessionToDelete(null)
        }
        if (openSectionDropdownId) {
          setOpenSectionDropdownId(null)
          setIsCreatingNewSection(false)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sessionToDelete, openSectionDropdownId])

  // Available sections list across the app
  const availableSections = useMemo(() => {
    const set = new Set<string>()
    customSubjects.forEach((s) => s && s.trim() && set.add(s.trim()))
    sessions.forEach((s) => {
      if (s.section && s.section.trim()) set.add(s.section.trim())
      if (s.subject && s.subject.trim()) set.add(s.subject.trim())
    })
    return Array.from(set).sort()
  }, [customSubjects, sessions])

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDurationDetailed = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    const parts = []
    if (hrs > 0) parts.push(`${hrs}h`)
    if (mins > 0) parts.push(`${mins}m`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

    return parts.join(' ')
  }

  // Handle assigning an existing section or unassigning
  const handleAssignSection = async (sessionId: string, sectionName: string | null) => {
    await handleUpdateSession(sessionId, { section: sectionName })
    setOpenSectionDropdownId(null)
    setIsCreatingNewSection(false)
    setNewSectionName('')
  }

  // Handle creating a new section and immediately assigning it
  const handleCreateAndAssignSection = async (sessionId: string) => {
    const trimmed = newSectionName.trim()
    if (!trimmed) return

    addCustomSubject(trimmed)
    await handleUpdateSession(sessionId, { section: trimmed })
    setOpenSectionDropdownId(null)
    setIsCreatingNewSection(false)
    setNewSectionName('')
  }

  // Handle executing delete
  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return
    setIsDeleting(true)
    try {
      await onDeleteSession(sessionToDelete.id)
      setSessionToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.section && s.section.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()))

    const sessionDate = new Date(s.timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    let matchesDate = true
    if (dateFilter === 'today') {
      matchesDate = sessionDate >= today
    } else if (dateFilter === 'week') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(now.getDate() - 7)
      matchesDate = sessionDate >= sevenDaysAgo
    } else if (dateFilter === 'month') {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      matchesDate = sessionDate >= firstOfMonth
    }

    return matchesSearch && matchesDate
  })

  return (
    <div className="bg-theme-card p-5 sm:p-6 rounded-2xl border border-theme-border shadow-sm transition-colors duration-200">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-theme-border pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-theme-text font-display">Study History</h2>
          <p className="text-theme-muted text-xs mt-0.5">
            View, search, assign sections, and filter your logged study sessions.
          </p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by subject, section, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3.5 py-1.5 border border-theme-border rounded-xl focus:outline-none focus:border-purple-500 bg-theme-subtle text-theme-text placeholder:text-theme-muted text-xs transition-colors duration-200"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="w-full sm:w-40 pl-9 pr-8 py-1.5 border border-theme-border rounded-xl focus:outline-none focus:border-purple-500 bg-theme-subtle text-theme-text text-xs appearance-none cursor-pointer font-medium transition-colors duration-200"
            >
              <option value="all">All History</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
            <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted pointer-events-none" />
            <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-theme-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredSessions.length === 0 ? (
        <div className="py-12 text-center text-theme-muted text-sm flex flex-col items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8 text-theme-border" />
          <p>No study sessions found matching your criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-theme-border max-h-[560px] overflow-y-auto pr-1">
          {filteredSessions.map((session) => {
            const isDropdownOpen = openSectionDropdownId === session.id

            return (
              <div
                key={session.id}
                className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 group transition-colors"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  {/* Subject & Time */}
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="font-bold text-theme-text truncate text-sm sm:text-base">
                      {session.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-theme-muted">
                      {formatDateTime(session.timestamp)}
                    </span>
                  </div>

                  {/* Badges Row: Duration + Interactive Section Tag */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Duration Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full w-fit border border-indigo-500/20">
                      <Clock className="h-3 w-3" />
                      <span>{formatDurationDetailed(session.duration)}</span>
                    </div>

                    {/* Section Assignment Pill & Popover Dropdown */}
                    <div className="relative">
                      {session.section ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenSectionDropdownId(isDropdownOpen ? null : session.id)
                            setIsCreatingNewSection(false)
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 px-2.5 py-0.5 rounded-full transition-all cursor-pointer group/sec"
                          title="Click to change section"
                        >
                          <Folder className="h-3 w-3" />
                          <span className="truncate max-w-[140px] sm:max-w-[200px]">{session.section}</span>
                          <ChevronDown className="h-3 w-3 opacity-60 group-hover/sec:opacity-100" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenSectionDropdownId(isDropdownOpen ? null : session.id)
                            setIsCreatingNewSection(false)
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-theme-muted hover:text-purple-400 bg-theme-subtle hover:bg-purple-500/10 border border-dashed border-theme-border hover:border-purple-500/30 px-2.5 py-0.5 rounded-full transition-all cursor-pointer"
                        >
                          <Tag className="h-3 w-3" />
                          <span>+ Assign Section</span>
                        </button>
                      )}

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div
                          ref={dropdownRef}
                          className="absolute left-0 top-full mt-1.5 z-40 w-64 bg-theme-card border border-theme-border rounded-xl shadow-xl p-2 space-y-1.5 animate-in fade-in zoom-in-95"
                        >
                          <div className="flex items-center justify-between px-2 py-1 border-b border-theme-border text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                            <span>Assign Section</span>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenSectionDropdownId(null)
                                setIsCreatingNewSection(false)
                              }}
                              className="text-theme-muted hover:text-theme-text"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Inline Create New Section Input */}
                          {isCreatingNewSection ? (
                            <div className="p-1 space-y-2 animate-in fade-in duration-200">
                              <input
                                type="text"
                                placeholder="Section / topic name..."
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleCreateAndAssignSection(session.id)
                                  }
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-theme-subtle border border-purple-500/50 text-xs text-theme-text placeholder:text-theme-muted focus:outline-none"
                              />
                              <div className="flex items-center gap-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCreatingNewSection(false)
                                    setNewSectionName('')
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-theme-muted hover:text-theme-text"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCreateAndAssignSection(session.id)}
                                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold rounded-lg shadow-xs"
                                >
                                  Save & Assign
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Option: None / Remove Section */}
                              {session.section && (
                                <button
                                  type="button"
                                  onClick={() => handleAssignSection(session.id, null)}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-theme-muted hover:text-theme-text hover:bg-theme-subtle transition-colors flex items-center justify-between"
                                >
                                  <span className="italic">None (No Section)</span>
                                </button>
                              )}

                              {/* List of existing sections */}
                              <div className="max-h-36 overflow-y-auto space-y-0.5 pr-0.5">
                                {availableSections.map((sec) => {
                                  const isSelected = session.section === sec
                                  return (
                                    <button
                                      key={sec}
                                      type="button"
                                      onClick={() => handleAssignSection(session.id, sec)}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                        isSelected
                                          ? 'bg-purple-600/20 text-purple-300'
                                          : 'text-theme-text hover:bg-theme-subtle'
                                      }`}
                                    >
                                      <span className="truncate">{sec}</span>
                                      {isSelected && <Check className="h-3 w-3 text-purple-400 shrink-0" />}
                                    </button>
                                  )
                                })}
                              </div>

                              {/* Create New Section Option */}
                              <div className="border-t border-theme-border pt-1">
                                <button
                                  type="button"
                                  onClick={() => setIsCreatingNewSection(true)}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-1.5"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>+ Create new section</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {session.notes && (
                    <p className="text-theme-muted text-xs leading-relaxed italic bg-theme-subtle p-2.5 rounded-xl border border-theme-border max-w-2xl mt-1">
                      {session.notes}
                    </p>
                  )}
                </div>

                {/* Delete Button (Triggers Custom In-App Modal) */}
                <button
                  type="button"
                  onClick={() => setSessionToDelete(session)}
                  className="p-2 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 text-theme-muted hover:text-red-400 rounded-xl transition-all shrink-0 opacity-80 group-hover:opacity-100 focus:opacity-100"
                  title="Delete Study Log"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CUSTOM IN-APP DELETE CONFIRMATION MODAL (No window.confirm)
          ═══════════════════════════════════════════════════════════ */}
      {sessionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSessionToDelete(null)}
        >
          <div
            className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-base font-bold text-theme-text font-display">
                  Delete Study Session?
                </h3>
                <p className="text-xs text-theme-muted leading-relaxed">
                  Are you sure you want to delete this study session for{' '}
                  <span className="font-semibold text-theme-text">&ldquo;{sessionToDelete.subject}&rdquo;</span>{' '}
                  ({formatDurationDetailed(sessionToDelete.duration)})? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-text text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/25 flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Session'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
