'use client'

import { useState, useEffect, useRef } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { Plus, Search, Trash2, Loader, Check, AlertCircle, FileText } from 'lucide-react'

export default function NotesPage() {
  const { notes, handleAddNote, handleUpdateNote, handleDeleteNote } = useDashboard()

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [localTitle, setLocalTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Track the current note reference
  const activeNote = notes.find((n) => n.id === activeNoteId)
  const previousNoteId = useRef<string | null>(null)

  // Synchronize local editor state when the active note changes
  useEffect(() => {
    if (activeNote) {
      // If we are switching from a different note, reset states
      if (previousNoteId.current !== activeNote.id) {
        setLocalTitle(activeNote.title)
        setLocalContent(activeNote.content)
        setSaveStatus('saved')
        setDeleteConfirm(false)
        previousNoteId.current = activeNote.id
      }
    } else {
      setLocalTitle('')
      setLocalContent('')
      setActiveNoteId(null)
      previousNoteId.current = null
    }
  }, [activeNote, activeNoteId])

  // Debounced auto-save effect
  useEffect(() => {
    if (!activeNote) return

    // If local values match the cached note values, it is already saved
    if (localTitle === activeNote.title && localContent === activeNote.content) {
      return
    }

    setSaveStatus('saving')
    const timer = setTimeout(async () => {
      try {
        await handleUpdateNote(activeNote.id, {
          title: localTitle,
          content: localContent,
        })
        setSaveStatus('saved')
      } catch (err) {
        console.error('Failed to auto-save note', err)
        setSaveStatus('unsaved')
      }
    }, 1200) // Trigger save 1.2s after user stops typing

    return () => clearTimeout(timer)
  }, [localTitle, localContent, activeNote, handleUpdateNote])

  const handleCreateNewNote = async () => {
    // Flush current note edits if unsaved before creating a new one
    if (saveStatus === 'saving' && activeNoteId) {
      await handleUpdateNote(activeNoteId, {
        title: localTitle,
        content: localContent,
      })
    }

    try {
      const newNote = await handleAddNote('Untitled Note', '')
      setActiveNoteId(newNote.id)
    } catch (err) {
      console.error('Failed to create new note', err)
    }
  }

  const handleSelectNote = async (noteId: string) => {
    // Flush current note edits immediately before switching
    if (saveStatus === 'saving' && activeNoteId) {
      await handleUpdateNote(activeNoteId, {
        title: localTitle,
        content: localContent,
      })
    }
    setActiveNoteId(noteId)
  }

  const handleDeleteActiveNote = async () => {
    if (!activeNoteId) return
    try {
      await handleDeleteNote(activeNoteId)
      // Pick the next available note or null
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

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatNoteDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6 w-full h-[calc(100vh-130px)] flex flex-col">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-warmtext dark:text-darktext font-display">Study Notepad</h1>
        <p className="text-warmtext/50 dark:text-darktext/50 text-xs mt-0.5">
          Write down key takeaways, study guidelines, and formulas. Auto-saves while typing.
        </p>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 w-full">
        {/* Left Side: Notes list */}
        <div className="w-full md:w-80 flex flex-col bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shrink-0 min-h-[250px] md:min-h-0">
          
          {/* Header Search & Create */}
          <div className="p-4 border-b border-warmborder/60 dark:border-white/10 space-y-3 shrink-0">
            <button
              onClick={handleCreateNewNote}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 shadow-sm shadow-indigo-600/10"
            >
              <Plus className="h-4 w-4" />
              <span>New Note</span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-warmbg dark:bg-darkbg/40 text-warmtext dark:text-darktext text-xs transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-warmtext/40 dark:text-darktext/40" />
            </div>
          </div>

          {/* Notes Scrollable list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <FileText className="h-8 w-8 text-warmtext/30 dark:text-darktext/30 mb-2" />
                <p className="text-xs font-bold text-warmtext/60 dark:text-darktext/50">
                  {searchQuery ? 'No matching notes found' : 'No notes written yet'}
                </p>
                <p className="text-[10px] text-warmtext/40 dark:text-darktext/40 mt-1 max-w-[180px]">
                  {searchQuery ? 'Try matching title or text content.' : 'Click "+ New Note" above to create one.'}
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
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-1 ${
                      isActive
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/10 dark:bg-indigo-500/5 ring-1 ring-indigo-600/20'
                        : 'border-transparent bg-transparent hover:bg-warmbg dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-bold text-warmtext dark:text-darktext truncate w-full">
                      {note.title.trim() || 'Untitled Note'}
                    </span>
                    <span className="text-[10px] text-warmtext/50 dark:text-darktext/50 truncate w-full">
                      {preview}
                    </span>
                    <span className="text-[8px] text-warmtext/40 dark:text-darktext/40 font-semibold uppercase tracking-wider mt-1 block">
                      {formatNoteDate(note.updated_at)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Text Editor */}
        <div className="flex-1 flex flex-col bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 overflow-hidden min-w-0">
          {!activeNote ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
                <FileText className="h-10 w-10" />
              </div>
              <h3 className="text-sm font-bold text-warmtext dark:text-darktext">No Active Note Selected</h3>
              <p className="text-xs text-warmtext/50 dark:text-darktext/50 mt-1 max-w-sm">
                Pick an existing study sheet from the list on the left, or create a brand new digital pad to start recording notes.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Editor Header Status & Delete */}
              <div className="px-6 py-3 border-b border-warmborder/60 dark:border-white/10 flex items-center justify-between shrink-0 bg-warmbg/20 dark:bg-transparent">
                {/* Save status indicators */}
                <div className="flex items-center gap-2">
                  {saveStatus === 'saving' && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                      <Loader className="h-3 w-3 animate-spin" />
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
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Save failure</span>
                    </span>
                  )}
                </div>

                {/* Confirmable delete button */}
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

              {/* Title Input field */}
              <div className="px-6 pt-5 pb-2 shrink-0">
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="w-full text-xl font-bold tracking-tight text-warmtext dark:text-darktext border-none focus:ring-0 focus:outline-none bg-transparent placeholder-warmtext/30 dark:placeholder-darktext/30 p-0"
                />
              </div>

              {/* Content Textarea */}
              <div className="flex-1 px-6 pb-6 min-h-0">
                <textarea
                  placeholder="Start writing your study notes here..."
                  value={localContent}
                  onChange={(e) => setLocalContent(e.target.value)}
                  className="w-full h-full text-sm text-warmtext/80 dark:text-darktext/80 border-none focus:ring-0 focus:outline-none bg-transparent resize-none p-0 leading-relaxed placeholder-warmtext/30 dark:placeholder-darktext/30"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
