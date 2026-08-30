'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { Play, Pause, Square, RotateCcw, Flame, Check } from 'lucide-react'

const COMMON_SUBJECTS = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'General Study',
]

export default function Timer() {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerSubject,
    stopAndLogTimer,
  } = useDashboard()

  const [customSubject, setCustomSubject] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const seconds = timerState.seconds
  const isRunning = timerState.isRunning
  const subject = timerState.subject

  // Circular progress configuration (larger, full-screen ready)
  const radius = 110
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius // ~691.15
  const targetSeconds = 3600 // Circular bar wraps at 60 mins
  const progress = Math.min(seconds / targetSeconds, 1)
  const strokeDashoffset = circumference - progress * circumference

  // Clear notification timer
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(t)
    }
  }, [notification])

  const toggleStart = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      const activeSubj = isCustomMode ? customSubject.trim() || 'General Study' : subject
      startTimer(activeSubj)
    }
  }

  const handleStopAndLog = async () => {
    const finalSeconds = seconds
    const activeSubject = isCustomMode ? customSubject.trim() || 'General Study' : subject

    if (finalSeconds <= 0) return

    try {
      await stopAndLogTimer('Live focus session')
      const mins = Math.floor(finalSeconds / 60)
      const secs = finalSeconds % 60
      const formattedDuration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
      setNotification(`Logged focus session: ${activeSubject} (${formattedDuration}) successfully!`)
    } catch (err) {
      console.error('Failed to auto log timer session', err)
    }
  }

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60

    const pad = (num: number) => String(num).padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  return (
    <div className="bg-[#FDFCFB] dark:bg-white/5 p-8 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm transition-all duration-300 flex flex-col items-center w-full min-h-[460px] justify-center relative">
      
      {/* Floating Success Notification */}
      {notification && (
        <div className="absolute top-4 left-4 right-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in z-10 shadow-xs">
          <Check className="h-4 w-4 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 self-start mb-6">
        <Flame className={`h-5 w-5 ${isRunning ? 'text-amber-500 animate-pulse' : 'text-warmtext/40 dark:text-darktext/40'}`} />
        <span className="text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50">Live Focus Clock</span>
      </div>

      {/* Subject Selection Area */}
      <div className="w-full max-w-md space-y-3 mb-6">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-warmtext/50 dark:text-darktext/50 text-center">
          What subject are you studying?
        </label>

        {/* Quick select chips */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {COMMON_SUBJECTS.map((sub) => {
            const isSelected = !isCustomMode && subject === sub
            return (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  setIsCustomMode(false)
                  setTimerSubject(sub)
                }}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-warmbg dark:bg-white/5 border-warmborder dark:border-white/10 text-warmtext/60 dark:text-darktext/50 hover:border-warmborder/80 dark:hover:border-white/20'
                }`}
              >
                {sub}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border transition-all duration-200 ${
              isCustomMode
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-warmbg dark:bg-white/5 border-warmborder dark:border-white/10 text-warmtext/60 dark:text-darktext/50 hover:border-warmborder/80 dark:hover:border-white/20'
            }`}
          >
            Custom...
          </button>
        </div>

        {/* Custom Subject Input field */}
        {isCustomMode && (
          <input
            type="text"
            placeholder="Enter custom subject name..."
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="w-full px-3.5 py-1.5 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-warmbg dark:bg-white/5 text-warmtext dark:text-darktext text-xs text-center transition-all duration-300"
          />
        )}
      </div>

      {/* Prominent Circular Progress Ring */}
      <div className="relative my-4 flex items-center justify-center scale-110 sm:scale-120 transition-transform duration-300">
        <svg className="w-72 h-72 transform -rotate-90" width="280" height="280">
          {/* Background circle */}
          <circle
            className="text-warmborder/40 dark:text-white/10 transition-colors duration-300"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
          />
          {/* Foreground progress circle */}
          <circle
            className="text-indigo-600 dark:text-indigo-500 transition-all duration-300 ease-in-out"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
          />
        </svg>

        {/* Floating Text inside Circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono text-4xl font-black tracking-tight tabular-nums select-none ${isRunning ? 'text-indigo-600 dark:text-indigo-400' : 'text-warmtext dark:text-darktext'}`}>
            {formatTime(seconds)}
          </span>
          <span className="text-[10px] font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest mt-1">
            {isRunning ? 'Focusing' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Circular control buttons */}
      <div className="flex items-center justify-center gap-5 w-full mt-10">
        {/* Reset button */}
        <button
          onClick={resetTimer}
          disabled={seconds === 0}
          className="p-3.5 rounded-full border border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-white/5 hover:bg-warmbg dark:hover:bg-white/10 text-warmtext/50 dark:text-darktext/50 hover:text-warmtext dark:hover:text-darktext transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none hover:scale-105"
          title="Reset Stopwatch"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={toggleStart}
          className={`p-5 rounded-full text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-115 active:scale-95 ${
            isRunning
              ? 'bg-warmtext dark:bg-white/10 hover:bg-warmtext/90 dark:hover:bg-white/20'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
          }`}
          title={isRunning ? 'Pause Focus' : 'Start Focus'}
        >
          {isRunning ? (
            <Pause className="h-6.5 w-6.5 fill-white dark:fill-darktext" />
          ) : (
            <Play className="h-6.5 w-6.5 fill-white translate-x-0.5" />
          )}
        </button>

        {/* Stop and Log button - automatically saves to db */}
        <button
          onClick={handleStopAndLog}
          disabled={seconds === 0}
          className="p-3.5 rounded-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-300 shadow-md disabled:opacity-30 disabled:pointer-events-none hover:scale-105"
          title="Stop & Auto Log Focus"
        >
          <Square className="h-5 w-5 fill-white" />
        </button>
      </div>
    </div>
  )
}
