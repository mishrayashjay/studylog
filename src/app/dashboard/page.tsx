'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Clock,
  Bookmark,
  CheckCircle2,
  Trophy,
  Activity,
  ChevronDown,
  Plus,
  Target,
  Layers,
  Code,
  Sigma,
  BookOpen,
  X,
  ArrowRight,
  Sparkles,
  CalendarDays,
  Pause,
  Play,
  Square,
  Check
} from 'lucide-react'
import { useDashboard, StudySession } from '@/context/DashboardContext'

const SUBJECT_COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981']

// Curated authentic quotes on discipline, focus, and learning with real author attributions
const MOTIVATIONAL_QUOTES = [
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi' },
  { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { text: 'Focus is a muscle. The more you practice it, the stronger it gets.', author: 'Cal Newport' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: "You don't have to be great to start, but you have to start to be great.", author: 'Zig Ziglar' },
  { text: 'Continuous effort—not strength or intelligence—is the key to unlocking our potential.', author: 'Winston Churchill' },
  { text: 'Small deeds done are better than great deeds planned.', author: 'Peter Marshall' },
  { text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert' },
  { text: 'Patience, persistence and perspiration make an unbeatable combination for success.', author: 'Napoleon Hill' },
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche' },
  { text: "Do not wait; the time will never be 'just right.'", author: 'George Herbert' },
  { text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Clarity about what matters provides clarity about what does not.', author: 'Cal Newport' },
]

/**
 * ── REAL CONSECUTIVE CALENDAR-DAY STREAK CALCULATION ──
 */
function calculateRealStreak(sessions: StudySession[]): number {
  if (!sessions || sessions.length === 0) return 0

  const toLocalDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const activeDays = new Set<string>()
  sessions.forEach((s) => {
    if (s.timestamp && s.duration > 0) {
      activeDays.add(toLocalDateKey(new Date(s.timestamp)))
    }
  })

  if (activeDays.size === 0) return 0

  const now = new Date()
  const todayKey = toLocalDateKey(now)

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = toLocalDateKey(yesterday)

  let anchorDate: Date
  if (activeDays.has(todayKey)) {
    anchorDate = new Date(now)
  } else if (activeDays.has(yesterdayKey)) {
    anchorDate = new Date(yesterday)
  } else {
    return 0
  }

  let streak = 0
  const cursor = new Date(anchorDate)

  while (true) {
    const cursorKey = toLocalDateKey(cursor)
    if (activeDays.has(cursorKey)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export default function DashboardOverviewPage() {
  const {
    sessions,
    profile,
    user,
    handleAddSession,
    timerState,
    startTimer,
    pauseTimer,
    stopAndLogTimer,
    setTimerSubject,
  } = useDashboard()

  // ── State for Interactive Features ──
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false)
  const [timeFilter, setTimeFilter] = useState<'This Week' | 'Last Week' | 'This Month'>('This Week')

  // ── Rotating Motivational Quotes (Random on load, smooth fade every 12s) ──
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length))
  const [isQuoteVisible, setIsQuoteVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsQuoteVisible(false)
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
        setIsQuoteVisible(true)
      }, 350)
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex]

  // ── Live Current Date / Time Clock (Updating live every second) ──
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedLiveDate = useMemo(() => {
    if (!currentTime) return ''
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [currentTime])

  const formattedLiveTime = useMemo(() => {
    if (!currentTime) return ''
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }, [currentTime])
  
  // Custom subject creation in "Today's Focus"
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [isCreatingCustomSubject, setIsCreatingCustomSubject] = useState(false)
  const [customSubjectInput, setCustomSubjectInput] = useState('')

  // New session modal inputs
  const [modalSubject, setModalSubject] = useState('')
  const [modalTopic, setModalTopic] = useState('')
  const [modalMinutes, setModalMinutes] = useState(60)
  const [isSubmittingSession, setIsSubmittingSession] = useState(false)

  // ── Compute Real User Created Subjects (No hardcoded mock subjects) ──
  const userSubjects = useMemo(() => {
    const set = new Set<string>()
    sessions.forEach(s => {
      if (s.subject && s.subject.trim()) {
        set.add(s.subject.trim())
      }
    })
    return Array.from(set)
  }, [sessions])

  // Current active chosen subject for new timers
  const activeFocusSubject = useMemo(() => {
    if (selectedSubject.trim()) return selectedSubject.trim()
    if (userSubjects.length > 0) return userSubjects[0]
    return 'General Study'
  }, [selectedSubject, userSubjects])

  // Handle adding custom subject on the fly
  const handleApplyCustomSubject = () => {
    if (customSubjectInput.trim()) {
      setSelectedSubject(customSubjectInput.trim())
      setTimerSubject(customSubjectInput.trim())
      setCustomSubjectInput('')
      setIsCreatingCustomSubject(false)
    }
  }

  // Submit quick session modal
  const handleModalAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    const subj = modalSubject.trim() || activeFocusSubject
    if (!subj || modalMinutes <= 0) return
    setIsSubmittingSession(true)
    try {
      await handleAddSession({
        subject: subj,
        duration: modalMinutes * 60,
        notes: modalTopic.trim() || 'Study session',
        timestamp: new Date().toISOString(),
      })
      setModalTopic('')
      setModalSubject('')
      setIsNewSessionModalOpen(false)
    } finally {
      setIsSubmittingSession(false)
    }
  }

  // ── Compute Pure Real Metrics from Live Sessions ──
  const displayName = profile.username || (user?.email ? user.email.split('@')[0] : 'Scholar')

  // Real Consecutive Day Streak
  const realStreak = useMemo(() => {
    return calculateRealStreak(sessions)
  }, [sessions])

  // 7 Days of the active week with calendar dates (e.g. Mon Aug 25)
  const weekDays = useMemo(() => {
    const now = new Date()
    const currentDay = now.getDay()
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

    const monday = new Date(now)
    monday.setDate(now.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + idx)
      const monthStr = d.toLocaleDateString([], { month: 'short' })
      const dayNum = d.getDate()
      const isToday = d.toDateString() === now.toDateString()

      return {
        dayName,
        monthStr,
        dayNum,
        dateLabel: `${monthStr} ${dayNum}`,
        isToday,
      }
    })
  }, [])

  // Real Weekly Aggregation & Metrics
  const realStats = useMemo(() => {
    const now = new Date()
    const currentDay = now.getDay()
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() + mondayOffset)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)

    let totalWeekSecs = 0
    let todaySecs = 0
    const dayHours = [0, 0, 0, 0, 0, 0, 0]

    const subjectMap: Record<string, number> = {}
    let weekSessionCount = 0

    const sortedSessions = [...sessions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    sortedSessions.forEach(s => {
      const d = new Date(s.timestamp)
      
      const subj = s.subject || 'General Study'
      subjectMap[subj] = (subjectMap[subj] || 0) + s.duration

      if (d >= todayStart) {
        todaySecs += s.duration
      }

      if (d >= startOfWeek && d < endOfWeek) {
        totalWeekSecs += s.duration
        weekSessionCount++
        const dayIdx = (d.getDay() + 6) % 7
        dayHours[dayIdx] += s.duration / 3600
      }
    })

    const totalWeekHours = totalWeekSecs / 3600
    const dailyAvgHours = totalWeekHours / 7

    const maxDayHour = Math.max(...dayHours)
    const bestDayIdx = dayHours.indexOf(maxDayHour)
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const bestDay = maxDayHour > 0 ? dayNames[bestDayIdx] : '—'

    const formatH = (hrs: number) => {
      const h = Math.floor(hrs)
      const m = Math.round((hrs % 1) * 60)
      if (h === 0 && m === 0) return '0m'
      if (h === 0) return `${m}m`
      if (m === 0) return `${h}h`
      return `${h}h ${m}m`
    }

    const totalAllSecs = Object.values(subjectMap).reduce((a, b) => a + b, 0)
    const subjectList = Object.entries(subjectMap)
      .map(([name, secs]) => ({
        name,
        hours: secs / 3600,
        pct: totalAllSecs > 0 ? Math.round((secs / totalAllSecs) * 100) : 0,
        secs,
      }))
      .sort((a, b) => b.secs - a.secs)

    return {
      totalWeekHours,
      totalWeekHoursStr: formatH(totalWeekHours),
      dailyAvgHoursStr: formatH(dailyAvgHours),
      bestDay,
      weekSessionCount,
      dayHours,
      subjectList,
      totalAllHoursStr: formatH(totalAllSecs / 3600),
      todayHoursStr: formatH(todaySecs / 3600),
      todaySecs,
      recentSessions: sortedSessions.slice(0, 5),
    }
  }, [sessions])

  // Chart SVG Coordinates with distinct, non-duplicate Y-axis intervals and room for dates
  const chartPoints = useMemo(() => {
    const W = 600
    const H = 180
    const paddingX = 35
    const paddingYTop = 20
    const paddingYBottom = 48
    const plotH = H - paddingYTop - paddingYBottom

    const maxData = Math.max(...realStats.dayHours)
    let maxVal = 2
    if (maxData > 8) {
      maxVal = Math.ceil(maxData / 4) * 4
    } else if (maxData > 4) {
      maxVal = Math.ceil(maxData / 2) * 2
    } else if (maxData > 2) {
      maxVal = 4
    } else if (maxData > 1) {
      maxVal = 2
    } else {
      maxVal = 2
    }

    const yTicks = [
      { val: maxVal, y: paddingYTop },
      { val: maxVal * 0.75, y: paddingYTop + plotH * 0.25 },
      { val: maxVal * 0.5, y: paddingYTop + plotH * 0.5 },
      { val: maxVal * 0.25, y: paddingYTop + plotH * 0.75 },
      { val: 0, y: paddingYTop + plotH },
    ].map((tick) => ({
      ...tick,
      label: tick.val === 0 ? '0' : tick.val % 1 === 0 ? `${tick.val}h` : `${tick.val.toFixed(1)}h`,
    }))

    const stepX = (W - paddingX * 2) / 6
    const points = realStats.dayHours.map((val, idx) => {
      const x = paddingX + idx * stepX
      const y = paddingYTop + plotH - (val / maxVal) * plotH
      return { x, y, val }
    })

    const pathD = points.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x},${pt.y}`
      const prev = points[idx - 1]
      const cx = (prev.x + pt.x) / 2
      return `${acc} C ${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`
    }, '')

    const areaD = `${pathD} L ${points[points.length - 1].x},${paddingYTop + plotH} L ${points[0].x},${paddingYTop + plotH} Z`

    return { points, pathD, areaD, W, H, yTicks, paddingX, paddingYTop, plotH, maxVal }
  }, [realStats.dayHours])

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = d.toDateString() === yesterday.toDateString()

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (isToday) return `Today, ${timeStr}`
    if (isYesterday) return `Yesterday, ${timeStr}`
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`
  }

  const formatLiveTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    return `${pad(mins)}:${pad(secs)}`
  }

  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('code') || lower.includes('cs') || lower.includes('computer') || lower.includes('program') || lower.includes('data')) {
      return <Code className="h-4 w-4" />
    }
    if (lower.includes('math') || lower.includes('calc') || lower.includes('algebra')) {
      return <Sigma className="h-4 w-4" />
    }
    return <BookOpen className="h-4 w-4" />
  }

  const donutSegments = useMemo(() => {
    const C = 2 * Math.PI * 38
    const totalSecs = realStats.subjectList.reduce((acc, s) => acc + s.secs, 0)
    if (totalSecs === 0) return []

    let accumulatedOffset = 0
    return realStats.subjectList.map((subj, idx) => {
      const fraction = subj.secs / totalSecs
      const arcLength = fraction * C
      const offset = -accumulatedOffset
      accumulatedOffset += arcLength
      return {
        ...subj,
        color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
        strokeDasharray: `${arcLength} ${C - arcLength}`,
        strokeDashoffset: offset,
      }
    })
  }, [realStats.subjectList])

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 transition-colors duration-200">

      {/* ═══ 1. TOP HEADER ROW ════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-theme-text font-display flex items-center gap-2">
            <span>Welcome back,</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              {displayName}
            </span>
            <span className="text-2xl">👋</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-theme-muted text-xs sm:text-sm">
              Every page you read today is a step toward your goals.
            </p>
            {formattedLiveDate && (
              <div className="inline-flex items-center gap-2.5 bg-theme-subtle px-3 py-1.5 rounded-xl border border-theme-border shadow-xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold text-theme-text font-sans">
                    {formattedLiveDate}
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-purple-400 tracking-normal">
                    {formattedLiveTime}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Motivational Quote Card with Smooth Fade Rotation */}
          <div className="hidden xl:flex items-center gap-2 bg-theme-card border border-theme-border px-3.5 py-2 rounded-xl text-xs text-theme-text shadow-sm max-w-sm overflow-hidden">
            <span className="text-purple-400 font-serif text-base leading-none shrink-0">&ldquo;</span>
            <div
              className={`flex items-center gap-1.5 min-w-0 transition-opacity duration-300 ease-in-out ${
                isQuoteVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="italic truncate">{currentQuote.text}</span>
              <span className="text-theme-muted text-[11px] shrink-0">— {currentQuote.author}</span>
            </div>
          </div>

          {/* + New Session Gradient Link Button (Navigates to Focus Timer) */}
          <Link
            href="/dashboard/timer"
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white font-semibold text-sm shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </Link>
        </div>
      </div>

      {/* ═══ 2. MAIN TWO-COLUMN DASHBOARD GRID ═════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT / CENTER MAIN COLUMN (8 of 12 cols) ────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* ── 4 STAT CARDS ROW ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {/* 1. Study Time (This Week) */}
            <div className="bg-theme-card border border-theme-border p-4 sm:p-4.5 rounded-2xl shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between overflow-hidden min-w-0 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-theme-muted truncate">Study Time (This Week)</p>
                <p className="text-lg sm:text-xl xl:text-2xl font-bold font-display text-theme-text mt-1 truncate">
                  {realStats.totalWeekHoursStr}
                </p>
                <p className="text-[11px] font-medium text-theme-muted mt-2 truncate flex items-center gap-1">
                  <span>{realStats.totalWeekHours > 0 ? 'Active this week' : 'No time logged yet'}</span>
                </p>
              </div>
            </div>

            {/* 2. Real Current Streak */}
            <div className="bg-theme-card border border-theme-border p-4 sm:p-4.5 rounded-2xl shadow-sm hover:border-blue-500/40 transition-all flex flex-col justify-between overflow-hidden min-w-0 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Bookmark className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-theme-muted truncate">Current Streak</p>
                <p className="text-lg sm:text-xl xl:text-2xl font-bold font-display text-theme-text mt-1 truncate">
                  {realStreak} {realStreak === 1 ? 'day' : 'days'}
                </p>
                <p className="text-[11px] font-medium text-amber-500 mt-2 truncate flex items-center gap-1">
                  <span>{realStreak > 0 ? '🔥 Active streak' : 'Start streak today!'}</span>
                </p>
              </div>
            </div>

            {/* 3. Real Sessions Completed This Week */}
            <div className="bg-theme-card border border-theme-border p-4 sm:p-4.5 rounded-2xl shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between overflow-hidden min-w-0 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-theme-muted truncate">Sessions (This Week)</p>
                <p className="text-lg sm:text-xl xl:text-2xl font-bold font-display text-theme-text mt-1 truncate">
                  {realStats.weekSessionCount}
                </p>
                <p className="text-[11px] font-medium text-teal-500 mt-2 truncate flex items-center gap-1">
                  <span>{sessions.length} total logged</span>
                </p>
              </div>
            </div>

            {/* 4. Real All-Time Total Study Time */}
            <div className="bg-theme-card border border-theme-border p-4 sm:p-4.5 rounded-2xl shadow-sm hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden min-w-0 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-theme-muted truncate">All-Time Study Time</p>
                <p className="text-lg sm:text-xl xl:text-2xl font-bold font-display text-theme-text mt-1 truncate">
                  {realStats.totalAllHoursStr}
                </p>
                <p className="text-[11px] font-medium text-theme-muted mt-2 truncate flex items-center gap-1">
                  <span>Lifetime focus</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── STUDY OVERVIEW REAL WEEKLY AREA CHART CARD ── */}
          <div className="bg-theme-card border border-theme-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Activity className="h-4.5 w-4.5 text-purple-400" />
                <h2 className="text-base font-bold text-theme-text font-display">Study Overview</h2>
              </div>

              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as 'This Week' | 'Last Week' | 'This Month')}
                  aria-label="Filter study overview time period"
                  className="appearance-none bg-theme-subtle border border-theme-border text-theme-text text-xs font-medium px-3 py-1.5 pr-7 rounded-lg hover:border-purple-400/30 focus:outline-none cursor-pointer"
                >
                  <option value="This Week">This Week</option>
                  <option value="Last Week">Last Week</option>
                  <option value="This Month">This Month</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-theme-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* SVG Real Area Chart */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[540px] relative">
                <svg viewBox={`0 0 ${chartPoints.W} ${chartPoints.H}`} className="w-full h-48 overflow-visible">
                  <defs>
                    <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Distinct, Non-Duplicate Y-Axis Grid Lines & Labels */}
                  {chartPoints.yTicks.map((grid, i) => (
                    <g key={i}>
                      <text x="0" y={grid.y + 3} fill="currentColor" className="text-theme-muted" fontSize="10" fontFamily="sans-serif">
                        {grid.label}
                      </text>
                      <line
                        x1="26"
                        y1={grid.y}
                        x2={chartPoints.W}
                        y2={grid.y}
                        stroke="currentColor"
                        className="text-theme-border"
                        strokeDasharray={i === chartPoints.yTicks.length - 1 ? 'none' : '3 3'}
                      />
                    </g>
                  ))}

                  {/* Area Gradient Fill */}
                  <path d={chartPoints.areaD} fill="url(#chartAreaGrad)" />

                  {/* Glowing Purple Line */}
                  <path d={chartPoints.pathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Data Points on Line */}
                  {chartPoints.points.map((pt, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={pt.x} cy={pt.y} r={pt.val > 0 ? "5" : "3"} fill={pt.val > 0 ? "#a855f7" : "var(--theme-border)"} stroke="var(--theme-card)" strokeWidth="2" />
                      {pt.val > 0 && (
                        <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#a855f7" strokeOpacity="0.4" className="group-hover:stroke-opacity-100 transition-opacity" />
                      )}
                    </g>
                  ))}

                  {/* X-Axis Day & Calendar Date Labels */}
                  {weekDays.map((dayInfo, idx) => {
                    const x = chartPoints.paddingX + idx * ((chartPoints.W - chartPoints.paddingX * 2) / 6)
                    const val = realStats.dayHours[idx]
                    return (
                      <g key={dayInfo.dayName} className="select-none">
                        {/* Day Name (e.g. Mon) */}
                        <text
                          x={x}
                          y={chartPoints.paddingYTop + chartPoints.plotH + 18}
                          textAnchor="middle"
                          fill="currentColor"
                          className={dayInfo.isToday ? 'text-purple-400 font-bold' : val > 0 ? 'text-theme-text font-semibold' : 'text-theme-muted font-medium'}
                          fontSize="11"
                          fontFamily="sans-serif"
                        >
                          {dayInfo.dayName}
                        </text>
                        {/* Calendar Date (e.g. Aug 31) */}
                        <text
                          x={x}
                          y={chartPoints.paddingYTop + chartPoints.plotH + 31}
                          textAnchor="middle"
                          fill="currentColor"
                          className={dayInfo.isToday ? 'text-purple-400 font-bold' : 'text-theme-muted font-normal'}
                          fontSize="9.5"
                          fontFamily="sans-serif"
                        >
                          {dayInfo.dateLabel}
                        </text>
                        {/* Dot Indicator for Today */}
                        {dayInfo.isToday && (
                          <circle
                            cx={x}
                            cy={chartPoints.paddingYTop + chartPoints.plotH + 40}
                            r="2"
                            fill="#a855f7"
                          />
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Chart Footer 3-Metric Summary Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-theme-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-theme-muted font-medium">Total Time</p>
                  <p className="text-sm font-bold text-theme-text">{realStats.totalWeekHoursStr}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-theme-muted font-medium">Daily Average</p>
                  <p className="text-sm font-bold text-theme-text">{realStats.dailyAvgHoursStr}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-theme-muted font-medium">Best Day</p>
                  <p className="text-sm font-bold text-theme-text">{realStats.bestDay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW: REAL TIME BY SUBJECT & REAL RECENT SESSIONS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. Real Time by Subject Card */}
            <div className="bg-theme-card border border-theme-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-theme-text font-display">Time by Subject</h3>
                </div>
                <Link href="/dashboard/history" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  View All
                </Link>
              </div>

              {realStats.subjectList.length > 0 ? (
                <div className="flex items-center gap-6">
                  {/* SVG Donut Chart with Center Total */}
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="var(--theme-card-subtle)" strokeWidth="12" />
                      {donutSegments.map((seg) => (
                        <circle
                          key={seg.name}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="12"
                          strokeDasharray={seg.strokeDasharray}
                          strokeDashoffset={seg.strokeDashoffset}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-theme-text">{realStats.totalAllHoursStr}</span>
                      <span className="text-[9px] text-theme-muted uppercase tracking-wider">Total</span>
                    </div>
                  </div>

                  {/* Real Subject List Legend */}
                  <div className="space-y-2 flex-1 min-w-0">
                    {donutSegments.slice(0, 5).map((subj) => (
                      <div key={subj.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subj.color }} />
                          <span className="text-theme-text truncate">{subj.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono shrink-0 ml-2">
                          <span className="text-theme-muted text-[11px]">{subj.hours < 0.1 ? `${Math.round(subj.secs / 60)}m` : `${subj.hours.toFixed(1)}h`}</span>
                          <span className="text-theme-muted text-[10px] w-6 text-right">{subj.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-theme-muted">No study sessions logged yet.</p>
                  <button
                    onClick={() => setIsNewSessionModalOpen(true)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Log your first session</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. Real Recent Sessions Card */}
            <div className="bg-theme-card border border-theme-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-theme-text font-display">Recent Sessions</h3>
                  </div>
                  <Link href="/dashboard/history" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    View All
                  </Link>
                </div>

                {realStats.recentSessions.length > 0 ? (
                  <div className="space-y-3">
                    {realStats.recentSessions.map((session) => {
                      const mins = Math.round(session.duration / 60)
                      const durStr = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`

                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-theme-subtle border border-theme-border hover:border-purple-400/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                              {getSubjectIcon(session.subject)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-theme-text truncate">{session.subject}</p>
                              <p className="text-[10px] text-theme-muted truncate">{session.notes || 'Focus session'}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-xs font-medium text-theme-text">{durStr} ⏱</p>
                            <p className="text-[9px] text-theme-muted">{formatTimestamp(session.timestamp)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-theme-muted">No recent sessions found.</p>
                    <button
                      onClick={() => setIsNewSessionModalOpen(true)}
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Add new session</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <Link
                href="/dashboard/history"
                className="w-full py-2 bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-text rounded-xl text-xs font-medium text-center transition-colors block mt-2"
              >
                View All Sessions
              </Link>
            </div>

          </div>

        </div>

        {/* ── RIGHT SIDEBAR COLUMN ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. "TODAY'S FOCUS" LIVE FUNCTIONAL TIMER CONTROLLER */}
          <div className="bg-theme-card border border-theme-border p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-theme-text font-display">Today&apos;s Focus</h3>
              </div>
              <Link href="/dashboard/timer" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Full Timer →
              </Link>
            </div>

            {/* ACTIVE RUNNING SESSION VIEW */}
            {timerState.isRunning || timerState.seconds > 0 ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-4">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--theme-card-subtle)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="#a855f7"
                      strokeWidth="8"
                      strokeDasharray="314"
                      strokeDashoffset={314 - ((timerState.seconds % 3600) / 3600) * 314}
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-2xl font-black font-mono text-theme-text tracking-tight">
                      {formatLiveTimer(timerState.seconds)}
                    </span>
                    <span className="text-[10px] text-theme-muted font-medium uppercase tracking-wider">
                      {timerState.isRunning ? 'Active Time' : 'Paused'}
                    </span>

                    <button
                      onClick={() => timerState.isRunning ? pauseTimer() : startTimer()}
                      className="w-8 h-8 rounded-full bg-theme-subtle hover:bg-theme-border border border-theme-border flex items-center justify-center text-theme-text transition-transform active:scale-95 shadow-sm mt-1"
                      title={timerState.isRunning ? "Pause stopwatch" : "Resume stopwatch"}
                    >
                      {timerState.isRunning ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-theme-text">{timerState.subject || 'Focus Session'}</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${timerState.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <span className={`text-xs font-medium ${timerState.isRunning ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {timerState.isRunning ? 'Session in progress' : 'Session paused'}
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2 pt-2 border-t border-theme-border">
                  <button
                    onClick={() => stopAndLogTimer('Dashboard focus session')}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Square className="h-3.5 w-3.5 fill-white" />
                    <span>Finish & Save Session</span>
                  </button>
                  <Link
                    href="/dashboard/timer"
                    className="w-full py-2 bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-text font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors block text-center"
                  >
                    Open in Fullscreen Timer
                  </Link>
                </div>
              </div>
            ) : (
              /* IDLE STATE VIEW */
              <div className="flex flex-col items-center justify-center py-2 space-y-5">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--theme-card-subtle)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      strokeDasharray="314"
                      strokeDashoffset={314 - Math.min(314, (realStats.todaySecs / 7200) * 314)}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-0.5">
                    <span className="text-xl font-bold font-display text-theme-text tracking-tight">
                      {realStats.todayHoursStr}
                    </span>
                    <span className="text-[10px] text-theme-muted font-medium uppercase tracking-wider">
                      Studied Today
                    </span>
                  </div>
                </div>

                {/* Custom Subject Selector & Chips */}
                <div className="w-full space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-theme-muted">Subject to Study</label>
                    {!isCreatingCustomSubject && (
                      <button
                        onClick={() => setIsCreatingCustomSubject(true)}
                        className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Subject</span>
                      </button>
                    )}
                  </div>

                  {isCreatingCustomSubject ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                      <input
                        type="text"
                        placeholder="Type subject name..."
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomSubject()}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-theme-subtle border border-purple-500/40 text-xs text-theme-text placeholder:text-theme-muted focus:outline-none"
                      />
                      <button
                        onClick={handleApplyCustomSubject}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingCustomSubject(false)
                          setCustomSubjectInput('')
                        }}
                        className="p-1.5 text-theme-muted hover:text-theme-text"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : userSubjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {userSubjects.map((subj) => {
                        const isSelected = activeFocusSubject === subj
                        return (
                          <button
                            key={subj}
                            onClick={() => {
                              setSelectedSubject(subj)
                              setTimerSubject(subj)
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-purple-600/30 border-purple-500 text-purple-300 shadow-xs'
                                : 'bg-theme-subtle border-theme-border text-theme-muted hover:text-theme-text'
                            }`}
                          >
                            {subj}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-theme-subtle border border-dashed border-theme-border text-center space-y-2">
                      <p className="text-xs text-theme-muted">No subjects created yet.</p>
                      <button
                        onClick={() => setIsCreatingCustomSubject(true)}
                        className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Type your first subject</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-2 pt-1 border-t border-theme-border">
                  <button
                    onClick={() => startTimer(activeFocusSubject)}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Start Focus Session ({activeFocusSubject})</span>
                  </button>

                  <button
                    onClick={() => setIsNewSessionModalOpen(true)}
                    className="w-full py-2 bg-theme-subtle hover:bg-theme-border border border-theme-border text-theme-text font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Log Past Study Time</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. "GOALS & MILESTONES" HONEST COMING SOON CARD */}
          <div className="bg-theme-card border border-theme-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-theme-text font-display">Goals & Milestones</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Coming Soon
              </span>
            </div>

            <p className="text-xs text-theme-muted leading-relaxed">
              Set weekly study targets, track chapter completion, and unlock automatic milestone badges as you log sessions.
            </p>

            <div className="space-y-2 pt-2 border-t border-theme-border">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-theme-subtle border border-theme-border">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs text-theme-text font-medium">Daily Study Targets</span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">In Dev</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-theme-subtle border border-theme-border">
                <div className="flex items-center gap-2.5">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-theme-text font-medium">Badge Milestones</span>
                </div>
                <span className="text-[10px] text-theme-muted font-mono">In Dev</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ═══ 3. QUICK NEW SESSION MODAL ═══════════════════════════ */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-theme-text">Log Study Session</h3>
              </div>
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="p-1 text-theme-muted hover:text-theme-text rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleModalAddSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-theme-muted mb-1">Subject</label>
                <input
                  type="text"
                  value={modalSubject}
                  onChange={(e) => setModalSubject(e.target.value)}
                  placeholder={activeFocusSubject || 'e.g. Mathematics, History'}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-theme-subtle border border-theme-border text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-muted mb-1">Topic / Notes</label>
                <input
                  type="text"
                  value={modalTopic}
                  onChange={(e) => setModalTopic(e.target.value)}
                  placeholder="e.g. Chapter 3 Problems"
                  className="w-full px-3.5 py-2 rounded-xl bg-theme-subtle border border-theme-border text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-muted mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={modalMinutes}
                  onChange={(e) => setModalMinutes(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-theme-subtle border border-theme-border text-sm text-theme-text placeholder:text-theme-muted focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-theme-muted hover:text-theme-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSession}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-purple-500/20 disabled:opacity-50"
                >
                  {isSubmittingSession ? 'Saving...' : 'Save Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
