'use client'

import { useDashboard } from '@/context/DashboardContext'
import SessionHistory from '@/components/SessionHistory'

export default function HistoryPage() {
  const { sessions, handleDeleteSession } = useDashboard()

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10 transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-text font-display">Study History</h1>
        <p className="text-theme-muted text-xs mt-0.5">
          Review, search, assign sections, and manage your past logged study sessions.
        </p>
      </div>

      <SessionHistory sessions={sessions} onDeleteSession={handleDeleteSession} />
    </div>
  )
}
