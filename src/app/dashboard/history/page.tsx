'use client'

import { useDashboard } from '@/context/DashboardContext'
import SessionHistory from '@/components/SessionHistory'

export default function HistoryPage() {
  const { sessions, handleDeleteSession } = useDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-warmtext dark:text-darktext font-display">Study History</h1>
        <p className="text-warmtext/50 dark:text-darktext/50 text-xs mt-0.5">
          Review, search, and manage your past logged study sessions.
        </p>
      </div>

      <SessionHistory sessions={sessions} onDeleteSession={handleDeleteSession} />
    </div>
  )
}
