'use client'

import { useDashboard } from '@/context/DashboardContext'
import QuickAddForm from '@/components/QuickAddForm'
import { useRouter } from 'next/navigation'

export default function LogSessionPage() {
  const { handleAddSession, prefilledDuration, setPrefilledDuration } = useDashboard()
  const router = useRouter()

  const onAddSession = async (sessionData: {
    subject: string
    duration: number
    notes: string
    timestamp: string
  }) => {
    await handleAddSession(sessionData)
    router.push('/dashboard/history')
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-warmtext dark:text-darktext font-display">Log Session</h1>
        <p className="text-warmtext/50 dark:text-darktext/50 text-xs mt-0.5">
          Manually document study details or submit prefilled focus times from your stopwatch.
        </p>
      </div>

      <QuickAddForm
        onAddSession={onAddSession}
        prefilledDuration={prefilledDuration}
        onClearPrefill={() => setPrefilledDuration(null)}
      />
    </div>
  )
}
