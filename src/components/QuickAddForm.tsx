'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import {
  BookOpen,
  Calendar,
  FileText,
  CheckCircle,
  Plus,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

interface QuickAddFormProps {
  onAddSession: (sessionData: {
    subject: string
    duration: number // seconds
    notes: string
    timestamp: string
  }) => Promise<void>
  prefilledDuration: number | null // in seconds
  onClearPrefill: () => void
}

const DURATION_PRESETS = [
  { label: '30m', hours: 0, minutes: 30 },
  { label: '45m', hours: 0, minutes: 45 },
  { label: '1h', hours: 1, minutes: 0 },
  { label: '1h 30m', hours: 1, minutes: 30 },
  { label: '2h', hours: 2, minutes: 0 },
  { label: '3h', hours: 3, minutes: 0 },
]

export default function QuickAddForm({ onAddSession, prefilledDuration, onClearPrefill }: QuickAddFormProps) {
  const { sessions, customSubjects, addCustomSubject } = useDashboard()

  const [subject, setSubject] = useState('')
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [newSubjectInput, setNewSubjectInput] = useState('')

  // Separate Hours and Minutes
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(30)

  const [notes, setNotes] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── 1. Real User Created Subjects ──
  const allUserSubjects = useMemo(() => {
    const set = new Set<string>()
    customSubjects.forEach((s) => s && s.trim() && set.add(s.trim()))
    sessions.forEach((s) => s.subject && s.subject.trim() && set.add(s.subject.trim()))
    return Array.from(set)
  }, [customSubjects, sessions])

  const handleCreateCustomSubject = () => {
    const trimmed = newSubjectInput.trim()
    if (!trimmed) return
    addCustomSubject(trimmed)
    setSubject(trimmed)
    setNewSubjectInput('')
    setIsAddingSubject(false)
  }

  // Set default timestamp to local now
  useEffect(() => {
    const now = new Date()
    const tzoffset = now.getTimezoneOffset() * 60000
    const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16)
    setTimestamp(localISOTime)
  }, [])

  // Handle prefilled duration from live timer
  useEffect(() => {
    if (prefilledDuration !== null) {
      const totalMins = Math.round(prefilledDuration / 60)
      setHours(Math.floor(totalMins / 60))
      setMinutes(totalMins % 60)
    }
  }, [prefilledDuration])

  // Total duration in seconds
  const totalSeconds = (hours * 3600) + (minutes * 60)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const activeSubj = subject.trim() || (allUserSubjects.length > 0 ? allUserSubjects[0] : '')
    if (!activeSubj || totalSeconds <= 0 || !timestamp) return

    setSubmitting(true)
    try {
      await onAddSession({
        subject: activeSubj,
        duration: totalSeconds,
        notes: notes.trim(),
        timestamp: new Date(timestamp).toISOString(),
      })

      setNotes('')
      const now = new Date()
      const tzoffset = now.getTimezoneOffset() * 60000
      const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16)
      setTimestamp(localISOTime)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-theme-card border border-theme-border p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-theme-border pb-4">
        <BookOpen className="h-4.5 w-4.5 text-purple-400" />
        <h3 className="text-base font-bold text-theme-text font-display">
          Log Study Session
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── 1. SUBJECT SELECTION & CUSTOM CREATOR ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-theme-muted">
              Subject Name
            </label>
            {!isAddingSubject && (
              <button
                type="button"
                onClick={() => setIsAddingSubject(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add Subject</span>
              </button>
            )}
          </div>

          {/* Subject Text Input */}
          <input
            type="text"
            required
            placeholder={allUserSubjects.length > 0 ? allUserSubjects[0] : "e.g. Linear Algebra, React Hooks..."}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-theme-subtle border border-theme-border rounded-xl focus:outline-none focus:border-purple-500 text-sm text-theme-text placeholder:text-theme-muted transition-colors"
          />

          {/* Inline Custom Subject Creator */}
          {isAddingSubject ? (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-theme-subtle border border-purple-500/40 animate-in fade-in duration-200">
              <input
                type="text"
                placeholder="Type new subject..."
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCustomSubject()}
                className="flex-1 px-3 py-1 bg-transparent text-xs text-theme-text placeholder:text-theme-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreateCustomSubject}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingSubject(false)
                  setNewSubjectInput('')
                }}
                className="p-1 text-theme-muted hover:text-theme-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : allUserSubjects.length > 0 ? (
            /* User's real previously used subject chips */
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 pt-1">
              {allUserSubjects.map((sub) => {
                const isSelected = subject.toLowerCase() === sub.toLowerCase()
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-xs'
                        : 'bg-theme-subtle border-theme-border text-theme-muted hover:text-theme-text'
                    }`}
                  >
                    {sub}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        {/* ── 2. SEPARATE HOURS AND MINUTES DURATION INPUT ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-theme-muted">
              Session Duration
            </label>
            {prefilledDuration !== null && (
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span>Prefilled ({Math.floor(prefilledDuration / 60)}m {prefilledDuration % 60}s)</span>
                <button
                  type="button"
                  onClick={onClearPrefill}
                  className="text-theme-muted hover:text-theme-text p-0.5"
                  title="Clear prefill"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {/* Hours and Minutes Two-Column Steppers */}
          <div className="grid grid-cols-2 gap-3">
            {/* Hours Input */}
            <div className="bg-theme-subtle border border-theme-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-theme-muted">Hours</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 bg-transparent text-xl font-bold font-mono text-theme-text focus:outline-none"
                  />
                  <span className="text-xs text-theme-muted font-medium">hrs</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setHours((h) => Math.min(24, h + 1))}
                  className="w-6 h-6 rounded-md bg-theme-border hover:opacity-80 flex items-center justify-center text-theme-text"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setHours((h) => Math.max(0, h - 1))}
                  className="w-6 h-6 rounded-md bg-theme-border hover:opacity-80 flex items-center justify-center text-theme-text"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Minutes Input */}
            <div className="bg-theme-subtle border border-theme-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-theme-muted">Minutes</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-xl font-bold font-mono text-theme-text focus:outline-none"
                  />
                  <span className="text-xs text-theme-muted font-medium">mins</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setMinutes((m) => Math.min(59, m + 5))}
                  className="w-6 h-6 rounded-md bg-theme-border hover:opacity-80 flex items-center justify-center text-theme-text"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMinutes((m) => Math.max(0, m - 5))}
                  className="w-6 h-6 rounded-md bg-theme-border hover:opacity-80 flex items-center justify-center text-theme-text"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5">
            {DURATION_PRESETS.map((p) => {
              const isSelected = hours === p.hours && minutes === p.minutes
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setHours(p.hours)
                    setMinutes(p.minutes)
                  }}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : 'bg-theme-subtle border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Total Duration Display */}
          <div className="text-right text-[11px] text-theme-muted font-mono">
            Total:{' '}
            <span className="text-theme-text font-bold">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>{' '}
            ({Math.round(totalSeconds / 60)} mins)
          </div>
        </div>

        {/* ── 3. DATE & TIME ── */}
        <div>
          <label className="block text-xs font-semibold text-theme-muted mb-1.5">
            Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              required
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-theme-subtle border border-theme-border rounded-xl focus:outline-none focus:border-purple-500 text-sm text-theme-text transition-colors"
            />
            <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-theme-muted pointer-events-none" />
          </div>
        </div>

        {/* ── 4. NOTES ── */}
        <div>
          <label className="block text-xs font-semibold text-theme-muted mb-1.5">
            Notes & Key Takeaways (Optional)
          </label>
          <div className="relative">
            <textarea
              placeholder="What did you work on or accomplish during this session?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full pl-10 pr-3.5 py-2.5 bg-theme-subtle border border-theme-border rounded-xl focus:outline-none focus:border-purple-500 text-sm text-theme-text placeholder:text-theme-muted resize-none transition-colors"
            />
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-theme-muted pointer-events-none" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || totalSeconds <= 0}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 shadow-md shadow-purple-500/20 active:scale-[0.98] disabled:opacity-40"
        >
          <CheckCircle className="h-4 w-4" />
          <span>{submitting ? 'Logging Session...' : 'Save & Log Session'}</span>
        </button>
      </form>
    </div>
  )
}
