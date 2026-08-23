'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, Flame } from 'lucide-react'

interface TimerProps {
  onTimerStop: (durationInSeconds: number) => void
}

export default function Timer({ onTimerStop }: TimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Circular progress configuration
  const radius = 80
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius // ~502.65
  const targetSeconds = 3600 // Progress bar completes at 60 mins
  const progress = Math.min(seconds / targetSeconds, 1)
  const strokeDashoffset = circumference - progress * circumference

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const startTimer = () => {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
  }

  const pauseTimer = () => {
    if (!isRunning) return
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSeconds(0)
  }

  const stopAndLog = () => {
    const finalSeconds = seconds
    resetTimer()
    if (finalSeconds > 0) {
      onTimerStop(finalSeconds)
    }
  }

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60

    const pad = (num: number) => String(num).padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200 flex flex-col items-center">
      <div className="flex items-center gap-1.5 self-start mb-4">
        <Flame className={`h-4.5 w-4.5 ${isRunning ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Focus Session</h2>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative my-4 flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="w-56 h-56 transform -rotate-90" width="220" height="220">
          {/* Background circle */}
          <circle
            className="text-slate-100 dark:text-white/10 transition-colors duration-200"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="110"
            cy="110"
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
            cx="110"
            cy="110"
          />
        </svg>

        {/* Text inside Circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono text-3xl font-extrabold tracking-tight tabular-nums select-none ${isRunning ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100'}`}>
            {formatTime(seconds)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            {isRunning ? 'Focusing' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Circular control buttons */}
      <div className="flex items-center justify-center gap-4 w-full mt-6">
        {/* Reset button */}
        <button
          onClick={resetTimer}
          disabled={seconds === 0}
          className="p-3 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
          title="Reset Stopwatch"
        >
          <RotateCcw className="h-4.5 w-4.5" />
        </button>

        {/* Play/Pause button */}
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="p-4 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-indigo-600/10 dark:shadow-indigo-500/5 hover:scale-105"
            title="Start Focus"
          >
            <Play className="h-5 w-5 fill-white" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="p-4 rounded-full bg-slate-800 dark:bg-white/10 hover:bg-slate-900 dark:hover:bg-white/20 text-white dark:text-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
            title="Pause Focus"
          >
            <Pause className="h-5 w-5 fill-white dark:fill-slate-200" />
          </button>
        )}

        {/* Stop and Log button */}
        <button
          onClick={stopAndLog}
          disabled={seconds === 0}
          className="p-3 rounded-full bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-emerald-600/10 dark:shadow-emerald-500/5 disabled:opacity-30 disabled:pointer-events-none hover:scale-105"
          title="Stop & Log Focus"
        >
          <Square className="h-4.5 w-4.5 fill-white" />
        </button>
      </div>
    </div>
  )
}
