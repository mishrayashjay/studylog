'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import Timer from '@/components/Timer'
import QuickAddForm from '@/components/QuickAddForm'
import { Check } from 'lucide-react'

export default function FocusTimerPage() {
  const { handleAddSession } = useDashboard()
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(t)
    }
  }, [notification])

  const onAddSession = async (sessionData: {
    subject: string
    duration: number
    notes: string
    timestamp: string
  }) => {
    await handleAddSession(sessionData)
    const mins = Math.floor(sessionData.duration / 60)
    setNotification(`Manually logged past session: ${sessionData.subject} (${mins}m) successfully!`)
  }

  return (
    <div className="space-y-6 w-full relative">
      
      {/* Floating Success Notification for Manual logs */}
      {notification && (
        <div className="fixed top-20 right-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fade-in z-50 shadow-md">
          <Check className="h-4.5 w-4.5 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-warmtext dark:text-darktext font-display">Focus Zone</h1>
        <p className="text-warmtext/50 dark:text-darktext/50 text-xs mt-0.5">
          Run the live stopwatch to track focus intervals, or manually document past study sessions.
        </p>
      </div>

      {/* Rebuilt 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* Left Column: Immersive Circular Focus Timer (prominent space) */}
        <div className="lg:col-span-7 w-full">
          <Timer />
        </div>

        {/* Right Column: Integrated Manual Logging form */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="bg-[#FDFCFB] dark:bg-white/5 p-4 rounded-xl border border-warmborder dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50 mb-1">
              Log Past Session
            </h3>
            <p className="text-[10px] text-warmtext/40 dark:text-darktext/40">
              Input details of study sessions completed offline or outside the app.
            </p>
          </div>

          <QuickAddForm
            onAddSession={onAddSession}
            prefilledDuration={null}
            onClearPrefill={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
