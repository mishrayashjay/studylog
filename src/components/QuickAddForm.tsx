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
  const [timestamp, setTimestamp] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const now = new Date()
    const tzoffset = now.getTimezoneOffset() * 60000
    const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16)
    setTimestamp(localISOTime)
  }, [])

  useEffect(() => {
    if (prefilledDuration !== null) {
      const mins = Number((prefilledDuration / 60).toFixed(1))
      setDurationMins(String(mins))
    }
  }, [prefilledDuration])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !durationMins || !timestamp) return

    setSubmitting(true)
    const minsVal = Number(durationMins)

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

      setSubject('')
      setDurationMins('')
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

  const handleSelectCommonSubject = (sub: string) => {
    setSubject(sub)
  }

  return (
    <div className="bg-[#FDFCFB] dark:bg-white/5 p-6 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-1.5 mb-4">
        <BookOpen className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50">Log Study Session</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50 mb-1.5">
            Subject
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Linear Algebra, React Context..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#FDFCFB] dark:bg-white/5 text-warmtext dark:text-darktext text-sm transition-colors duration-300"
          />
          {/* Suggestions */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {COMMON_SUBJECTS.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => handleSelectCommonSubject(sub)}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all duration-300 ${
                  subject.toLowerCase() === sub.toLowerCase()
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                    : 'bg-warmbg dark:bg-white/5 border-warmborder dark:border-white/10 text-warmtext/60 dark:text-darktext/50 hover:border-warmborder/80 dark:hover:border-white/20 hover:text-warmtext dark:hover:text-darktext'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50">
              Duration (minutes)
            </label>
            {prefilledDuration !== null && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Timer ({Math.floor(prefilledDuration / 60)}m {prefilledDuration % 60}s)</span>
                <button
                  type="button"
                  onClick={onClearPrefill}
                  className="text-warmtext/40 dark:text-darktext/40 hover:text-warmtext/60 dark:hover:text-darktext/60 p-0.5"
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
              className="w-full pl-9 pr-3.5 py-2 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#FDFCFB] dark:bg-white/5 text-warmtext dark:text-darktext text-sm transition-colors duration-300"
            />
            <Clock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-warmtext/40 dark:text-darktext/40" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50 mb-1.5">
            Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              required
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#FDFCFB] dark:bg-white/5 text-warmtext dark:text-darktext text-sm transition-colors duration-300 [color-scheme:light] dark:[color-scheme:dark]"
            />
            <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-warmtext/40 dark:text-darktext/40" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50 mb-1.5">
            Notes (optional)
          </label>
          <div className="relative">
            <textarea
              placeholder="What did you learn? Any key takeaways..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full pl-9 pr-3.5 py-2 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#FDFCFB] dark:bg-white/5 text-warmtext dark:text-darktext text-sm resize-none transition-colors duration-300"
            />
            <FileText className="absolute left-3 top-2.5 h-4.5 w-4.5 text-warmtext/40 dark:text-darktext/40" />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" />
          {submitting ? 'Logging...' : 'Log Session'}
        </button>
      </form>
    </div>
  )
}
