'use client'

import { useDashboard } from '@/context/DashboardContext'
import Timer from '@/components/Timer'
import { useRouter } from 'next/navigation'

export default function FocusTimerPage() {
  const { setPrefilledDuration } = useDashboard()
  const router = useRouter()

  const handleTimerStop = (duration: number) => {
    setPrefilledDuration(duration)
    router.push('/dashboard/log')
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">Focus Timer</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Use the circular progress ring stopwatch to track and record your active study sessions.
        </p>
      </div>

      <Timer onTimerStop={handleTimerStop} />
    </div>
  )
}
