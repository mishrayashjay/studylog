'use client'

import { useDashboard } from '@/context/DashboardContext'
import Stats from '@/components/Stats'
import { Flame } from 'lucide-react'

export default function DashboardOverviewPage() {
  const { sessions, profile, isOfflineMode } = useDashboard()

  const getTodaySessions = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return sessions.filter((s) => new Date(s.timestamp) >= today)
  }

  const todaySessions = getTodaySessions()
  const todayMinutes = todaySessions.reduce((acc, curr) => acc + curr.duration / 60, 0)

  return (
    <div className="space-y-6">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl text-amber-800 dark:text-amber-400 text-sm flex items-start gap-3 transition-colors duration-200">
          <div>
            <p className="font-bold">Offline / Local Mode Enabled</p>
            <p className="mt-1 text-amber-700 dark:text-amber-400/80 leading-relaxed text-xs">
              Supabase URL & Anon Key are not configured in your <code>.env.local</code>. Data will be saved in your browser&apos;s local storage.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">Dashboard Overview</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Welcome back, {profile.full_name || profile.username || 'scholar'}. Here is your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stats (2/3 width) */}
        <div className="lg:col-span-8">
          <Stats sessions={sessions} />
        </div>

        {/* Right Column: Today's Summary (1/3 width) */}
        <div className="lg:col-span-4 bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-4">
            <Flame className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Today&apos;s Focus</h2>
          </div>

          <div className="text-center py-4 border-b border-slate-100 dark:border-white/10 mb-4">
            <p className="text-3xl font-extrabold tracking-tight font-display text-indigo-600 dark:text-indigo-400">
              {todayMinutes.toFixed(0)}m
            </p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
              Time Studied Today
            </p>
          </div>

          {todaySessions.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4 leading-relaxed">
              You haven&apos;t logged any study sessions today. Head over to the Focus Timer or Log pages to start!
            </p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {todaySessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300 truncate">{session.subject}</p>
                    {session.notes && <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate italic mt-0.5">{session.notes}</p>}
                  </div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                    {Math.round(session.duration / 60)}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
