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
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">Log Session</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
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
