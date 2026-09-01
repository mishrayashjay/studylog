'use client'

import { useState, useEffect, useRef } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import {
  Plus,
  Search,
  Trash2,
  Loader,
  Check,
  AlertCircle,
  FileText,
  Folder,
  X,
  Clock,
  Calendar
} from 'lucide-react'
import CustomSelect from '@/components/CustomSelect'

export default function NotesPage() {
  const {
    notes,
    sessions,
    allSubjects,
    addCustomSubject,
    handleAddNote,
    handleUpdateNoteState,
    handleUpdateNote,
    handleDeleteNote,
  } = useDashboard()

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All')

  // Local editor inputs
  const [localTitle, setLocalTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [localCategory, setLocalCategory] = useState('General')
  
  // Custom category creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [customCategoryInput, setCustomCategoryInput] = useState('')

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Track active note references
  const activeNote = notes.find((n) => n.id === activeNoteId)
  const previousNoteId = useRef<string | null>(null)

  // Track the values that have been persisted to the database to decouple autosave from UI updates
  const lastSyncedValues = useRef({ title: '', content: '', category: 'General' })

  // Synchronize local state when active note changes
  useEffect(() => {
    if (activeNote) {
      if (previousNoteId.current !== activeNote.id) {
        setLocalTitle(activeNote.title)
        setLocalContent(activeNote.content)
        setLocalCategory(activeNote.category || 'General')
        lastSyncedValues.current = {
          title: activeNote.title,
          content: activeNote.content,
          category: activeNote.category || 'General',
        }
        setIsCreatingCategory(false)
        setCustomCategoryInput('')
        setSaveStatus('saved')
        setDeleteConfirm(false)
        previousNoteId.current = activeNote.id
      }
    } else {
      setLocalTitle('')
      setLocalContent('')
      setLocalCategory('General')
      setIsCreatingCategory(false)
      setCustomCategoryInput('')
      setActiveNoteId(null)
      previousNoteId.current = null
    }
  }, [activeNote, activeNoteId])

  // Debounced auto-save effect checking local changes against database-synced values
  useEffect(() => {
    if (!activeNote) return

    // If local values match the database-synced copy, we don't need to write
    if (
      localTitle === lastSyncedValues.current.title &&
      localContent === lastSyncedValues.current.content &&
      localCategory === lastSyncedValues.current.category
    ) {
      return
    }

    setSaveStatus('saving')
    const timer = setTimeout(async () => {
      try {
        await handleUpdateNote(activeNote.id, {
          title: localTitle,
          content: localContent,
          category: localCategory,
        })
        
        lastSyncedValues.current = {
          title: localTitle,
          content: localContent,
          category: localCategory,
        }
        setSaveStatus('saved')
      } catch (err) {
        console.error('[Autosave] Save failed in Supabase!', err)
        setSaveStatus('unsaved')
      }
    }, 1200)

    return () => {
      clearTimeout(timer)
    }
  }, [localTitle, localContent, localCategory, activeNote, handleUpdateNote])

  const handleTitleChange = (val: string) => {
    setLocalTitle(val)
    if (activeNoteId) {
      handleUpdateNoteState(activeNoteId, { title: val })
    }
  }

  const handleContentChange = (val: string) => {
    setLocalContent(val)
    if (activeNoteId) {
      handleUpdateNoteState(activeNoteId, { content: val })
    }
  }

  const handleCategoryChange = (val: string) => {
    setLocalCategory(val)
    if (activeNoteId) {
      handleUpdateNoteState(activeNoteId, { category: val })
    }
  }

  const handleCreateNewNote = async () => {
    // Flush current note edits if unsaved
    if (saveStatus === 'saving' && activeNoteId) {
      try {
        await handleUpdateNote(activeNoteId, {
          title: localTitle,
          content: localContent,
          category: localCategory,
        })
        lastSyncedValues.current = {
          title: localTitle,
          content: localContent,
          category: localCategory,
        }
      } catch (e) {
        console.error('[CreateNote] Flushing failed', e)
      }
    }

    try {
      const startCategory = selectedCategoryFilter !== 'All' ? selectedCategoryFilter : 'General'
      const newNote = await handleAddNote('Untitled Note', '', startCategory)
      setActiveNoteId(newNote.id)
    } catch (err) {
      console.error('Failed to create new note', err)
    }
  }

  const handleSelectNote = async (noteId: string) => {
    // Flush current note edits immediately before switching
    if (saveStatus === 'saving' && activeNoteId) {
      try {
        await handleUpdateNote(activeNoteId, {
          title: localTitle,
          content: localContent,
          category: localCategory,
        })
        lastSyncedValues.current = {
          title: localTitle,
          content: localContent,
          category: localCategory,
        }
      } catch (e) {
        console.error('[SelectNote] Flushing failed', e)
      }
    }
    setActiveNoteId(noteId)
  }

  const handleDeleteActiveNote = async () => {
    if (!activeNoteId) return
    try {
      await handleDeleteNote(activeNoteId)
      const remaining = notes.filter((n) => n.id !== activeNoteId)
      if (remaining.length > 0) {
        setActiveNoteId(remaining[0].id)
      } else {
        setActiveNoteId(null)
      }
      setDeleteConfirm(false)
    } catch (err) {
      console.error('Failed to delete note', err)
    }
  }

  // Unified list of unique categories used across all notes, sessions, and custom subjects
  const uniqueCategories = Array.from(
    new Set(['General', ...allSubjects, ...notes.map((n) => n.category || 'General')])
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  const filterOptions = ['All', ...uniqueCategories]

  // Filter notes by search text and selected category
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategoryFilter === 'All' ||
      (n.category || 'General').toLowerCase().trim() === selectedCategoryFilter.toLowerCase().trim()

    return matchesSearch && matchesCategory
  })

  // Explicitly sort notes list by date (most recently updated first)
  filteredNotes.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  const formatNoteDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFullDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase().trim()
    if (c === 'general') return 'bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-darktext/60 border-slate-200/50 dark:border-white/5'
    if (c === 'dsa') return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/40 dark:border-indigo-500/10'
    if (c === 'physics') return 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 border-sky-200/40 dark:border-sky-500/10'
    if (c === 'chemistry') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-500/10'
    if (c === 'biology') return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/40 dark:border-rose-500/10'
    return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/40 dark:border-purple-500/10'
  }

  // Linked study session for the active note
  const matchingSessions = sessions.filter(
    (s) =>
      (s.section && localCategory && s.section.toLowerCase().trim() === localCategory.toLowerCase().trim()) ||
      (s.subject && localCategory && s.subject.toLowerCase().trim() === localCategory.toLowerCase().trim())
  )
  const latestSession = matchingSessions.length > 0 ? matchingSessions[0] : null

  return (
    <div className="space-y-6 w-full h-[calc(100vh-130px)] flex flex-col">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-warmtext dark:text-darktext font-display">Study Notepad</h1>
        <p className="text-warmtext/50 dark:text-darktext/50 text-xs mt-0.5">
          Organize your takeaways by categories and section notes. Auto-saves changes across all sections.
        </p>
      </div>

      {/* Main Split Pane Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 w-full">
        {/* Left Sidebar List Panel */}
        <div className="w-full md:w-80 flex flex-col bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shrink-0 min-h-[300px] md:min-h-0">
          
          {/* Action Header: Search & Category selector */}
          <div className="p-4 border-b border-warmborder/60 dark:border-white/10 space-y-3 shrink-0">
            <button
              onClick={handleCreateNewNote}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 shadow-sm shadow-indigo-600/10"
            >
              <Plus className="h-4 w-4" />
              <span>New Note</span>
            </button>

            {/* Keyword Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes title or body..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-warmbg dark:bg-white/5 text-warmtext dark:text-darktext text-xs transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-warmtext/40 dark:text-darktext/40" />
            </div>

            {/* Category CustomSelect Filter */}
            <CustomSelect
              value={selectedCategoryFilter}
              onChange={(val) => setSelectedCategoryFilter(val)}
              options={filterOptions.map((cat) => ({
                value: cat,
                label: `Category: ${cat}`,
              }))}
              prefixIcon={<Folder className="h-3.5 w-3.5" />}
              aria-label="Filter notes by category"
            />
          </div>

          {/* Notes Scrollable Rows */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <FileText className="h-8 w-8 text-warmtext/30 dark:text-darktext/30 mb-2" />
                <p className="text-xs font-bold text-warmtext/60 dark:text-darktext/50">
                  No notes match filter
                </p>
                <p className="text-[10px] text-warmtext/40 dark:text-darktext/40 mt-1 max-w-[200px]">
                  {searchQuery || selectedCategoryFilter !== 'All'
                    ? 'Clear your filters or keyword entries.'
                    : 'Click "+ New Note" to create study cards.'}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId
                const preview = note.content.trim()
                  ? note.content.slice(0, 50) + (note.content.length > 50 ? '...' : '')
                  : 'Empty note content...'

                return (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${
                      isActive
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5 ring-1 ring-indigo-600/20'
                        : 'border-transparent bg-transparent hover:bg-warmbg dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="text-xs font-bold text-warmtext dark:text-darktext truncate flex-1">
                        {note.title.trim() || 'Untitled Note'}
                      </span>
                      {/* Colored Category Tag */}
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border shrink-0 font-bold uppercase tracking-wider select-none ${getCategoryColor(note.category || 'General')}`}>
                        {note.category || 'General'}
                      </span>
                    </div>
                    
                    <span className="text-[10px] text-warmtext/50 dark:text-darktext/50 truncate w-full">
                      {preview}
                    </span>
                    <span className="text-[8px] text-warmtext/40 dark:text-darktext/40 font-semibold uppercase tracking-wider mt-0.5 block">
                      {formatNoteDate(note.updated_at)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Text Editor Sheet */}
        <div className="flex-1 flex flex-col bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 overflow-hidden min-w-0">
          {!activeNote ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
                <FileText className="h-10 w-10" />
              </div>
              <h3 className="text-sm font-bold text-warmtext dark:text-darktext">No Active Note Selected</h3>
              <p className="text-xs text-warmtext/50 dark:text-darktext/50 mt-1 max-w-sm">
                Pick a study sheet from the left pane, or click &quot;+ New Note&quot; to write on a fresh notepad.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Editor Header: Save status & Actions */}
              <div className="px-6 py-3 border-b border-warmborder/60 dark:border-white/10 flex items-center justify-between shrink-0 bg-warmbg/20 dark:bg-transparent">
                {/* Save badges */}
                <div className="flex items-center gap-2">
                  {saveStatus === 'saving' && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                      <Loader className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving changes...</span>
                    </span>
                  )}
                  {saveStatus === 'saved' && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" />
                      <span>Draft saved</span>
                    </span>
                  )}
                  {saveStatus === 'unsaved' && (
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5" title="Failed to sync with Supabase. Saved locally.">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Save failed (saved locally)</span>
                    </span>
                  )}
                </div>

                {/* Confirmable deletion triggers */}
                <div className="flex items-center gap-1.5">
                  {deleteConfirm ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleDeleteActiveNote}
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-warmborder dark:border-white/10 hover:bg-warmbg dark:hover:bg-white/5 transition-colors text-warmtext/60 dark:text-darktext/60"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="p-1.5 text-warmtext/40 dark:text-darktext/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title Input block */}
              <div className="px-6 pt-5 pb-1.5 shrink-0">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={localTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full text-xl font-bold tracking-tight text-warmtext dark:text-darktext border-none focus:ring-0 focus:outline-none bg-transparent placeholder-warmtext/30 dark:placeholder-darktext/30 p-0"
                />
              </div>

              {/* Unified Category & Session Metadata Toolbar */}
              <div className="px-6 py-2.5 bg-warmbg/40 dark:bg-white/[0.02] border-y border-warmborder/40 dark:border-white/5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-warmtext/60 dark:text-darktext/60 select-none">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest text-[9px]">
                    Category:
                  </span>

                  {isCreatingCategory ? (
                    <div className="flex items-center gap-1.5 w-full max-w-[220px] animate-fade-in">
                      <input
                        type="text"
                        placeholder="e.g. DSA, Physics..."
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="px-2 py-0.5 border border-warmborder dark:border-white/15 rounded-lg bg-transparent text-warmtext dark:text-darktext text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = customCategoryInput.trim() || 'General'
                            if (val !== 'General') addCustomSubject(val)
                            handleCategoryChange(val)
                            setIsCreatingCategory(false)
                            setCustomCategoryInput('')
                          }
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = customCategoryInput.trim() || 'General'
                          if (val !== 'General') addCustomSubject(val)
                          handleCategoryChange(val)
                          setIsCreatingCategory(false)
                          setCustomCategoryInput('')
                        }}
                        className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded shrink-0"
                        title="Save custom category"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingCategory(false)
                          setCustomCategoryInput('')
                        }}
                        className="p-1 text-warmtext/40 dark:text-darktext/40 hover:bg-warmbg dark:hover:bg-white/5 rounded shrink-0"
                        title="Cancel custom category"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-48">
                      <CustomSelect
                        value={localCategory}
                        onChange={(val) => handleCategoryChange(val)}
                        options={uniqueCategories.map((cat) => ({
                          value: cat,
                          label: cat,
                        }))}
                        actionOption={{
                          value: '__new__',
                          label: '+ Add custom...',
                          onSelect: () => {
                            setIsCreatingCategory(true)
                            setCustomCategoryInput('')
                          },
                        }}
                        className="py-1 bg-transparent border-warmborder dark:border-white/15 text-xs font-medium"
                        aria-label="Select note category"
                      />
                    </div>
                  )}

                  {/* Linked Study Session Metadata */}
                  {latestSession ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>
                        Linked Session: {formatFullDateTime(latestSession.timestamp)} ({matchingSessions.length} {matchingSessions.length === 1 ? 'log' : 'logs'})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-warmtext/50 dark:text-darktext/40 bg-warmbg dark:bg-white/5 border border-warmborder dark:border-white/10 px-2.5 py-0.5 rounded-full">
                      <Folder className="h-3 w-3 shrink-0" />
                      <span>Section Takeaways</span>
                    </div>
                  )}
                </div>

                {/* Last Updated Date & Time */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-warmtext/50 dark:text-darktext/40">
                  <Calendar className="h-3 w-3" />
                  <span>Last updated: {formatFullDateTime(activeNote.updated_at || activeNote.created_at)}</span>
                </div>
              </div>

              {/* Content Textarea */}
              <div className="flex-grow px-6 py-4 min-h-0">
                <textarea
                  placeholder="Start writing study insights here..."
                  value={localContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full text-sm text-warmtext/80 dark:text-darktext/80 border-none focus:ring-0 focus:outline-none bg-transparent resize-none p-0 leading-relaxed placeholder-warmtext/30 dark:placeholder-darktext/30 font-sans"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
