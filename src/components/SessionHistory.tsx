'use client'

import { useState, useEffect, useRef } from 'react'
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
  AlertTriangle,
  FileText
} from 'lucide-react'
import CustomSelect from '@/components/CustomSelect'

interface SessionHistoryProps {
  sessions: StudySession[]
  onDeleteSession: (id: string) => Promise<void>
}

export default function SessionHistory({ sessions, onDeleteSession }: SessionHistoryProps) {
  const {
    allSubjects,
    addCustomSubject,
    handleUpdateSession,
    handleSaveSectionNote,
    handleGetSectionNote
  } = useDashboard()

  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  // Section Assignment Popover State
  const [openSectionDropdownId, setOpenSectionDropdownId] = useState<string | null>(null)
  const [isCreatingNewSection, setIsCreatingNewSection] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')

  // Section Notes Modal State
  const [activeSectionForNotes, setActiveSectionForNotes] = useState<string | null>(null)
  const [sectionNoteContent, setSectionNoteContent] = useState('')
  const [isSavingSectionNote, setIsSavingSectionNote] = useState(false)
  const [sectionNoteNotification, setSectionNoteNotification] = useState<string | null>(null)

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

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSectionForNotes) {
          setActiveSectionForNotes(null)
        }
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
  }, [sessionToDelete, openSectionDropdownId, activeSectionForNotes])

  // Unified available sections/subjects list across the entire app
  const availableSections = allSubjects

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

  // Open Section Notes Modal for a given section name
  const openSectionNoteModal = (sectionName: string) => {
    const existing = handleGetSectionNote(sectionName)
    setSectionNoteContent(existing)
    setActiveSectionForNotes(sectionName)
    setOpenSectionDropdownId(null)
  }

  // Save Section Notes
  const handleSaveActiveSectionNote = async () => {
    if (!activeSectionForNotes) return
    setIsSavingSectionNote(true)
    try {
      await handleSaveSectionNote(activeSectionForNotes, sectionNoteContent)
      setSectionNoteNotification(`Saved notes for ${activeSectionForNotes}!`)
      setTimeout(() => {
        setSectionNoteNotification(null)
        setActiveSectionForNotes(null)
      }, 700)
    } finally {
      setIsSavingSectionNote(false)
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-theme-border pb-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-theme-text font-display">Study History</h2>
          <p className="text-theme-muted text-xs sm:text-sm mt-0.5 leading-relaxed">
            View, search, assign sections, write per-section notes, and filter your logged study sessions.
          </p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
          {/* Text Search - Sized and padded so placeholder never clips */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by subject, section, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-9 pr-3.5 py-2 border border-theme-border rounded-xl focus:outline-none focus:border-purple-500 bg-theme-subtle text-theme-text placeholder:text-theme-muted text-xs sm:text-sm transition-colors duration-200 shadow-2xs"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
          </div>

          {/* Date Filter CustomSelect */}
          <div className="w-full sm:w-44">
            <CustomSelect
              value={dateFilter}
              onChange={(val) => setDateFilter(val as 'all' | 'today' | 'week' | 'month')}
              options={[
                { value: 'all', label: 'All History' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'This Month' },
              ]}
              prefixIcon={<Calendar className="h-3.5 w-3.5" />}
              className="py-2 px-3 text-xs sm:text-sm font-medium"
              aria-label="Filter study sessions by date"
            />
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredSessions.length === 0 ? (
        <div className="py-12 text-center text-theme-muted text-sm sm:text-base flex flex-col items-center justify-center gap-2.5">
          <AlertCircle className="h-8 w-8 text-theme-border" />
          <p className="font-medium text-theme-muted">No study sessions found matching your criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-theme-border max-h-[560px] overflow-y-auto pr-1">
          {filteredSessions.map((session) => {
            const isDropdownOpen = openSectionDropdownId === session.id

            return (
              <div
                key={session.id}
                className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-3.5 group transition-colors"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  {/* Subject & Time */}
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="font-bold text-theme-text truncate text-sm sm:text-base">
                      {session.subject}
                    </span>
                    <span className="text-xs font-semibold text-theme-muted">
                      {formatDateTime(session.timestamp)}
                    </span>
                  </div>

                  {/* Badges Row: Duration + Interactive Section Tag + Section Notes Icon */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Duration Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full w-fit border border-indigo-500/20 shadow-2xs">
                      <Clock className="h-3 w-3" />
                      <span>{formatDurationDetailed(session.duration)}</span>
                    </div>

                    {/* Section Assignment Pill & Popover Dropdown */}
                    <div className="relative flex items-center gap-1.5">
                      {session.section ? (
                        <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/25 rounded-full pl-2.5 pr-1 py-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenSectionDropdownId(isDropdownOpen ? null : session.id)
                              setIsCreatingNewSection(false)
                            }}
                            className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                            title="Click to change section"
                          >
                            <Folder className="h-3 w-3" />
                            <span className="truncate max-w-[130px] sm:max-w-[180px]">{session.section}</span>
                            <ChevronDown className="h-3 w-3 opacity-60" />
                          </button>

                          {/* Dedicated Per-Section Notes Trigger Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              openSectionNoteModal(session.section!)
                            }}
                            className="p-1 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-full transition-colors cursor-pointer"
                            title={`Open ${session.section} Notes`}
                          >
                            <FileText className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenSectionDropdownId(isDropdownOpen ? null : session.id)
                            setIsCreatingNewSection(false)
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-theme-muted hover:text-purple-400 bg-theme-subtle hover:bg-purple-500/10 border border-dashed border-theme-border hover:border-purple-500/30 px-2.5 py-0.5 rounded-full transition-all cursor-pointer shadow-2xs"
                        >
                          <Tag className="h-3 w-3" />
                          <span>+ Assign Section</span>
                        </button>
                      )}

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div
                          ref={dropdownRef}
                          className="absolute left-0 top-full mt-1.5 z-40 w-72 bg-theme-card border border-theme-border rounded-xl shadow-2xl p-2.5 space-y-2 animate-in fade-in zoom-in-95"
                        >
                          <div className="flex items-center justify-between px-2 py-1 border-b border-theme-border text-xs font-bold uppercase tracking-wider text-theme-muted">
                            <span>Assign Section</span>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenSectionDropdownId(null)
                                setIsCreatingNewSection(false)
                              }}
                              className="text-theme-muted hover:text-theme-text p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Inline Create New Section Input */}
                          {isCreatingNewSection ? (
                            <div className="p-1 space-y-2 animate-in fade-in duration-200">
                              <input
                                type="text"
                                placeholder="Type section name (e.g. DSA)..."
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
                                  className="px-2.5 py-1 text-xs font-semibold text-theme-muted hover:text-theme-text"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCreateAndAssignSection(session.id)}
                                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs"
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
                              <div className="max-h-44 overflow-y-auto space-y-1 pr-0.5">
                                {availableSections.length === 0 ? (
                                  <p className="px-2 py-2 text-xs text-theme-muted italic">
                                    No sections created yet. Use &ldquo;+ Create new section&rdquo; below.
                                  </p>
                                ) : (
                                  availableSections.map((sec) => {
                                    const isSelected = session.section === sec
                                    return (
                                       <div
                                         key={sec}
                                         className={`group/secitem w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                           isSelected
                                             ? 'bg-purple-600 text-white font-semibold shadow-xs'
                                             : 'text-theme-text hover:bg-theme-subtle hover:text-theme-text'
                                         }`}
                                       >
                                         <button
                                           type="button"
                                           onClick={() => handleAssignSection(session.id, sec)}
                                           className="flex-1 text-left flex items-center gap-2 truncate cursor-pointer"
                                         >
                                           <Folder className={`h-3 w-3 shrink-0 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                                           <span className="truncate">{sec}</span>
                                           {isSelected && <Check className="h-3 w-3 text-white shrink-0 ml-1" />}
                                         </button>

                                         {/* Notes icon button next to each section in dropdown */}
                                         <button
                                           type="button"
                                           onClick={(e) => {
                                              e.stopPropagation()
                                              openSectionNoteModal(sec)
                                           }}
                                           className={`p-1 rounded-md transition-colors shrink-0 ml-1.5 cursor-pointer ${
                                             isSelected
                                               ? 'text-white/80 hover:text-white hover:bg-white/20'
                                               : 'text-theme-muted hover:text-purple-400 hover:bg-purple-500/10'
                                           }`}
                                           title={`View/Edit ${sec} Notes`}
                                         >
                                           <FileText className="h-3.5 w-3.5" />
                                         </button>
                                       </div>
                                    )
                                  })
                                )}
                              </div>

                              {/* Create New Section Option */}
                              <div className="border-t border-theme-border pt-1.5">
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

                  {/* Session Notes */}
                  {session.notes && (
                    <p className="text-theme-muted/90 text-xs sm:text-sm leading-relaxed italic bg-theme-subtle p-2.5 rounded-xl border border-theme-border max-w-2xl mt-1">
                      {session.notes}
                    </p>
                  )}
                </div>

                {/* Delete Button (Triggers Custom In-App Modal) */}
                <button
                  type="button"
                  onClick={() => setSessionToDelete(session)}
                  className="p-2 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 text-theme-muted hover:text-red-400 rounded-xl transition-all shrink-0 opacity-80 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
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
          PER-SECTION NOTES MODAL (Persistent across all sessions)
          ═══════════════════════════════════════════════════════════ */}
      {activeSectionForNotes && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveSectionForNotes(null)}
        >
          <div
            className="w-full max-w-lg bg-theme-card border border-theme-border rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-theme-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-theme-text font-display flex items-center gap-2">
                    <span>{activeSectionForNotes}</span>
                    <span className="text-[10px] font-semibold text-purple-400 font-sans px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                      Section Notes
                    </span>
                  </h3>
                  <p className="text-xs text-theme-muted mt-0.5 leading-relaxed">
                    Persistent takeaways, formulas, and resources for this entire section.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSectionForNotes(null)}
                className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg transition-colors cursor-pointer"
                aria-label="Close section notes"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <textarea
                rows={7}
                placeholder={`Write persistent reference notes, formulas, or reminders for ${activeSectionForNotes}...`}
                value={sectionNoteContent}
                onChange={(e) => setSectionNoteContent(e.target.value)}
                autoFocus
                className="w-full p-3.5 bg-theme-subtle border border-theme-border rounded-xl text-xs sm:text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-purple-500 resize-none leading-relaxed transition-colors"
              />
              <div className="flex items-center justify-between text-xs text-theme-muted px-1">
                <span>{sectionNoteContent.length} characters</span>
                {sectionNoteNotification && (
                  <span className="text-emerald-400 font-semibold animate-fade-in flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    <span>{sectionNoteNotification}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setActiveSectionForNotes(null)}
                disabled={isSavingSectionNote}
                className="px-4 py-2 rounded-xl bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-text text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveActiveSectionNote}
                disabled={isSavingSectionNote}
                className="px-4.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/25 flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isSavingSectionNote ? 'Saving...' : 'Save Section Notes'}</span>
              </button>
            </div>
          </div>
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
                <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
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
                className="px-4 py-2 rounded-xl bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-text text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/25 flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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
