'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Flame,
  Check,
  Plus,
  X,
  Timer as TimerIcon,
  Watch
} from 'lucide-react'

const PRESET_DURATIONS = [
  { label: '15m', seconds: 15 * 60 },
  { label: '25m', seconds: 25 * 60 },
  { label: '45m', seconds: 45 * 60 },
  { label: '60m', seconds: 60 * 60 },
  { label: '90m', seconds: 90 * 60 },
]

export default function Timer() {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerSubject,
    setTimerMode,
    setTimerTargetDuration,
    stopAndLogTimer,
    allSubjects,
    addCustomSubject,
  } = useDashboard()

  const [isAddingSubject, setIsAddingSubject] = useState(false)
  const [newSubjectInput, setNewSubjectInput] = useState('')
  const [notification, setNotification] = useState<string | null>(null)

  const seconds = timerState.seconds
  const isRunning = timerState.isRunning
  const subject = timerState.subject
  const mode = timerState.mode || 'timer'
  const targetDuration = timerState.targetDuration || 1500

  // Unified list of all user subjects/sections across the entire app
  const allUserSubjects = allSubjects

  // Active subject fallback
  const activeSubject = subject || (allUserSubjects.length > 0 ? allUserSubjects[0] : '')

  const handleCreateSubject = () => {
    const trimmed = newSubjectInput.trim()
    if (!trimmed) return
    addCustomSubject(trimmed)
    setTimerSubject(trimmed)
    setNewSubjectInput('')
    setIsAddingSubject(false)
  }

  // ── 2. Time Calculations ──
  // For Timer Mode: Countdown
  const remainingSeconds = Math.max(0, targetDuration - seconds)
  const isTimerFinished = mode === 'timer' && seconds >= targetDuration && targetDuration > 0

  // Circular progress configuration
  const radius = 110
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius // ~691.15

  // Progress fraction (0 to 1)
  let progress = 0
  if (mode === 'timer') {
    progress = targetDuration > 0 ? Math.min(seconds / targetDuration, 1) : 0
  } else {
    // Stopwatch: wraps every 60 mins
    progress = (seconds % 3600) / 3600
  }
  const strokeDashoffset = circumference - progress * circumference

  // Clear notification timer
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(t)
    }
  }, [notification])

  // Play subtle chime when countdown finishes
  useEffect(() => {
    if (isTimerFinished && isRunning) {
      pauseTimer()
      setNotification(`🎉 Focus target completed for ${activeSubject || 'Session'}!`)
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // D5
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15) // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.5)
      } catch {
        // audio context not allowed without prior gesture
      }
    }
  }, [isTimerFinished, isRunning, pauseTimer, activeSubject])

  const toggleStart = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer(activeSubject || 'General Study')
    }
  }

  const handleStopAndLog = async () => {
    const finalSeconds = seconds
    const targetSubj = activeSubject || 'General Study'

    if (finalSeconds <= 0) return

    try {
      await stopAndLogTimer(mode === 'timer' ? 'Target focus session' : 'Live stopwatch session')
      const mins = Math.floor(finalSeconds / 60)
      const secs = finalSeconds % 60
      const formattedDuration = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
      setNotification(`Logged focus session: ${targetSubj} (${formattedDuration}) successfully!`)
    } catch (err) {
      console.error('Failed to auto log timer session', err)
    }
  }

  const formatDisplayTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    const pad = (num: number) => String(num).padStart(2, '0')
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    return `${pad(mins)}:${pad(secs)}`
  }

  return (
    <div className="bg-theme-card border border-theme-border p-6 sm:p-8 rounded-2xl shadow-sm transition-all duration-200 flex flex-col items-center w-full min-h-[520px] justify-between relative overflow-hidden">
      
      {/* Floating Success Notification */}
      {notification && (
        <div className="absolute top-4 left-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in z-20 shadow-md">
          <Check className="h-4 w-4 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* ── 1. TOP BAR: MODE SWITCH (Timer vs Stopwatch) ── */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-theme-border pb-4">
        <div className="flex items-center gap-2">
          <Flame className={`h-5 w-5 ${isRunning ? 'text-purple-400 animate-pulse' : 'text-theme-muted'}`} />
          <span className="text-sm font-bold text-theme-text font-display">Live Focus Clock</span>
        </div>

        {/* Sleek Mode Toggle Pills */}
        <div className="flex items-center p-1 rounded-xl bg-theme-subtle border border-theme-border">
          <button
            type="button"
            onClick={() => setTimerMode('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'timer'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            <TimerIcon className="h-3.5 w-3.5" />
            <span>Timer (Countdown)</span>
          </button>
          <button
            type="button"
            onClick={() => setTimerMode('stopwatch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'stopwatch'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            <Watch className="h-3.5 w-3.5" />
            <span>Stopwatch (Count Up)</span>
          </button>
        </div>
      </div>

      {/* ── 2. SUBJECT SELECTION AREA (User Created Subjects & Custom Creator) ── */}
      <div className="w-full max-w-lg space-y-2.5 my-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-theme-muted">
            What subject are you studying?
          </label>
          {!isAddingSubject && (
            <button
              type="button"
              onClick={() => setIsAddingSubject(true)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="h-3 w-3" />
              <span>Add Custom Subject</span>
            </button>
          )}
        </div>

        {/* Inline Custom Subject Creator */}
        {isAddingSubject ? (
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-theme-subtle border border-purple-500/40 animate-in fade-in duration-200">
            <input
              type="text"
              placeholder="e.g. Quantum Computing, Biochemistry..."
              value={newSubjectInput}
              onChange={(e) => setNewSubjectInput(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateSubject()}
              className="flex-1 px-3 py-1 bg-transparent text-xs text-theme-text placeholder:text-theme-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCreateSubject}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingSubject(false)
                setNewSubjectInput('')
              }}
              className="p-1 text-theme-muted hover:text-theme-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : allUserSubjects.length > 0 ? (
          /* Chips of user's real subjects */
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {allUserSubjects.map((sub) => {
              const isSelected = activeSubject === sub
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setTimerSubject(sub)}
                  className={`text-xs font-medium px-3 py-1 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-xs'
                      : 'bg-theme-subtle border-theme-border text-theme-muted hover:text-theme-text'
                  }`}
                >
                  {sub}
                </button>
              )
            })}
          </div>
        ) : (
          /* Empty prompt for new user */
          <div className="p-3 rounded-xl bg-theme-subtle border border-dashed border-theme-border text-center space-y-2">
            <p className="text-xs text-theme-muted">No subjects created yet.</p>
            <button
              type="button"
              onClick={() => setIsAddingSubject(true)}
              className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Type your first subject name</span>
            </button>
          </div>
        )}
      </div>

      {/* ── 3. PRESETS BAR (Only in Countdown Timer mode) ── */}
      {mode === 'timer' && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-theme-muted mr-1">Target:</span>
          {PRESET_DURATIONS.map((preset) => {
            const isSelected = targetDuration === preset.seconds
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setTimerTargetDuration(preset.seconds)}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-xs'
                    : 'bg-theme-subtle border-theme-border text-theme-muted hover:text-theme-text'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── 4. CIRCULAR CLOCK DIAL ── */}
      <div className="relative my-3 flex items-center justify-center scale-105 sm:scale-115 transition-transform duration-300">
        <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90" width="280" height="280">
          {/* Background circle track */}
          <circle
            stroke="var(--theme-border)"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
          />
          {/* Foreground glowing progress circle */}
          <circle
            stroke={isTimerFinished ? '#10b981' : '#a855f7'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
            style={{
              filter: isRunning
                ? 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.7))'
                : 'none',
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
        </svg>

        {/* Center Clock Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center space-y-1">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-theme-text drop-shadow-sm">
            {mode === 'timer' ? formatDisplayTime(remainingSeconds) : formatDisplayTime(seconds)}
          </span>

          <span className="text-[11px] font-semibold text-theme-muted">
            {activeSubject || 'Select Subject'}
          </span>

          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning
                  ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400'
                  : isTimerFinished
                  ? 'bg-emerald-400'
                  : 'bg-amber-500'
              }`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isRunning
                  ? 'text-emerald-400'
                  : isTimerFinished
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {isTimerFinished
                ? 'Target Complete'
                : isRunning
                ? (mode === 'timer' ? 'Counting Down' : 'Stopwatch Running')
                : (seconds > 0 ? 'Paused' : 'Ready')}
            </span>
          </div>
        </div>
      </div>

      {/* ── 5. ACTION CONTROLS ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-4">
        {/* Play / Pause Primary Button */}
        <button
          type="button"
          onClick={toggleStart}
          className={`flex-1 w-full py-3 px-6 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white shadow-purple-500/25'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 fill-white" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>{seconds > 0 ? 'Resume Focus' : 'Start Focus Session'}</span>
            </>
          )}
        </button>

        {/* Reset & Finish Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {seconds > 0 && (
            <button
              type="button"
              onClick={resetTimer}
              className="p-3 bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-muted hover:text-theme-text rounded-xl transition-colors duration-200"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleStopAndLog}
            disabled={seconds <= 0}
            className="flex-1 sm:flex-initial py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl font-semibold text-xs transition-all duration-200 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
            title="Log elapsed time to database"
          >
            <Square className="h-3.5 w-3.5 fill-white" />
            <span>Finish & Save</span>
          </button>
        </div>
      </div>

    </div>
  )
}
