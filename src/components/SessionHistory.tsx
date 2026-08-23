'use client'

import { useState } from 'react'
import { StudySession } from './DashboardClient'
import { Search, Calendar, Trash2, Clock, AlertCircle } from 'lucide-react'

interface SessionHistoryProps {
  sessions: StudySession[]
  onDeleteSession: (id: string) => Promise<void>
}

export default function SessionHistory({ sessions, onDeleteSession }: SessionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

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

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.subject.toLowerCase().includes(searchQuery.toLowerCase())

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
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Study History</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
            View, search, and filter your logged study sessions
          </p>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Text Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 pl-9 pr-3.5 py-1.5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-xs transition-colors duration-200"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="w-full sm:w-40 pl-9 pr-8 py-1.5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs appearance-none cursor-pointer font-medium transition-colors duration-200"
            >
              <option value="all">All History</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
            <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500 text-[9px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredSessions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p>No study sessions found matching your criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/10 max-h-[500px] overflow-y-auto pr-1">
          {filteredSessions.map((session) => (
            <div key={session.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 group">
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* Subject & Time */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm sm:text-base">
                    {session.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {formatDateTime(session.timestamp)}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full w-fit">
                  <Clock className="h-3 w-3" />
                  <span>{formatDurationDetailed(session.duration)}</span>
                </div>

                {/* Notes */}
                {session.notes && (
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed italic bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/10 max-w-2xl mt-1">
                    {session.notes}
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this study session?')) {
                    onDeleteSession(session.id)
                  }
                }}
                className="p-2 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all shrink-0 align-self-start opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Log"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
