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

  // Clean up interval on unmount
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
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
      <div className="flex items-center gap-1.5 self-start mb-4">
        <Flame className={`h-4.5 w-4.5 ${isRunning ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Focus Timer</h2>
      </div>

      {/* Timer Screen */}
      <div className="my-4 text-center">
        <div className={`font-mono text-5xl font-extrabold tracking-tight tabular-nums select-none ${isRunning ? 'text-indigo-600' : 'text-slate-800'}`}>
          {formatTime(seconds)}
        </div>
        {isRunning && (
          <p className="text-xs text-indigo-500 font-semibold mt-2 animate-pulse">
            Session in progress...
          </p>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 w-full mt-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm"
          >
            <Play className="h-4 w-4 fill-white" />
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
          >
            <Pause className="h-4 w-4 fill-slate-800" />
            Pause
          </button>
        )}

        <button
          onClick={resetTimer}
          disabled={seconds === 0}
          className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          onClick={stopAndLog}
          disabled={seconds === 0}
          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:hover:bg-emerald-600 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm"
        >
          <Square className="h-4 w-4 fill-white" />
          Log Session
        </button>
      </div>
    </div>
  )
}
