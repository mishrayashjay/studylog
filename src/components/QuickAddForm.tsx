'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Clock, FileText, CheckCircle, X } from 'lucide-react'

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

const COMMON_SUBJECTS = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Literature',
  'Languages',
]

export default function QuickAddForm({ onAddSession, prefilledDuration, onClearPrefill }: QuickAddFormProps) {
  const [subject, setSubject] = useState('')
  const [durationMins, setDurationMins] = useState('')
  const [notes, setNotes] = useState('')
  // Default to current local time in YYYY-MM-DDTHH:MM format
  const [timestamp, setTimestamp] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reset timestamp to current time on mount
  useEffect(() => {
    const now = new Date()
    const tzoffset = now.getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16)
    setTimestamp(localISOTime)
  }, [])

  // Auto-fill duration if prefilledDuration changes
  useEffect(() => {
    if (prefilledDuration !== null) {
      // Show as minutes, e.g. 15.5 or 4
      const mins = Number((prefilledDuration / 60).toFixed(1))
      setDurationMins(String(mins))
    }
  }, [prefilledDuration])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !durationMins || !timestamp) return

    setSubmitting(true)
    const minsVal = Number(durationMins)

    // Calculate final seconds. If it matches the prefilled duration minutes value, use the exact prefilled seconds.
    let durationSeconds = 0
    if (prefilledDuration !== null && Number((prefilledDuration / 60).toFixed(1)) === minsVal) {
      durationSeconds = prefilledDuration
    } else {
      durationSeconds = Math.round(minsVal * 60)
    }

    try {
      await onAddSession({
        subject: subject.trim(),
        duration: durationSeconds,
        notes: notes.trim(),
        timestamp: new Date(timestamp).toISOString(),
      })

      // Reset form
      setSubject('')
      setDurationMins('')
      setNotes('')
      // Reset timestamp to current time
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

  const handleSelectCommonSubject = (sub: string) => {
    setSubject(sub)
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-1.5 mb-4">
        <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Log Study Session</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject input & suggestions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Subject
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Linear Algebra, React Context..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {/* Quick Suggestions */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => handleSelectCommonSubject(sub)}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all ${
                  subject.toLowerCase() === sub.toLowerCase()
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Duration input */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Duration (minutes)
            </label>
            {prefilledDuration !== null && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span>Filled from Timer ({Math.floor(prefilledDuration / 60)}m {prefilledDuration % 60}s)</span>
                <button
                  type="button"
                  onClick={onClearPrefill}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear timer fill"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              required
              step="any"
              min="0.1"
              placeholder="e.g. 45, 90"
              value={durationMins}
              onChange={(e) => setDurationMins(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <Clock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        {/* Timestamp input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              required
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        {/* Notes input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Notes (optional)
          </label>
          <div className="relative">
            <textarea
              placeholder="What did you learn? Any key takeaways..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
            <FileText className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" />
          {submitting ? 'Logging...' : 'Log Session'}
        </button>
      </form>
    </div>
  )
}
