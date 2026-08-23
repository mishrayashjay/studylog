'use client'

import { StudySession } from './DashboardClient'
import { Award, Clock, PieChart } from 'lucide-react'

interface StatsProps {
  sessions: StudySession[]
}

const SUBJECT_COLORS = [
  'bg-indigo-600',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-sky-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-orange-500',
]

const TEXT_COLORS = [
  'text-indigo-600',
  'text-emerald-500',
  'text-amber-500',
  'text-rose-500',
  'text-sky-500',
  'text-purple-500',
  'text-teal-500',
  'text-orange-500',
]

export default function Stats({ sessions }: StatsProps) {
  // Helper: Format duration (seconds) into human-readable hours and minutes
  const formatDuration = (totalSeconds: number) => {
    const hours = totalSeconds / 3600
    if (hours < 0.1) {
      const minutes = Math.round(totalSeconds / 60)
      return `${minutes}m`
    }
    return `${hours.toFixed(1)}h`
  }

  // 1. Calculate total hours this week (Monday - Sunday)
  const getWeeklySeconds = () => {
    const now = new Date()
    const currentDay = now.getDay()
    // Find Monday of the current week
    const startOfWeek = new Date(now)
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // adjust when day is sunday
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const weeklySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.timestamp)
      return sessionDate >= startOfWeek && sessionDate <= now
    })

    return weeklySessions.reduce((acc, curr) => acc + curr.duration, 0)
  }

  // 2. Calculate current streak (days)
  const getStreakDays = () => {
    if (sessions.length === 0) return 0

    // Group session timestamps by local date string (YYYY-MM-DD)
    const uniqueDays = new Set(
      sessions.map((s) => {
        const d = new Date(s.timestamp)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`
      })
    )

    const today = new Date()
    const formatDate = (d: Date) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`
    }

    const todayStr = formatDate(today)
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    const yesterdayStr = formatDate(yesterday)

    let currentStreak = 0
    let checkDate = new Date()

    if (uniqueDays.has(todayStr)) {
      checkDate = today
    } else if (uniqueDays.has(yesterdayStr)) {
      checkDate = yesterday
    } else {
      return 0
    }

    while (true) {
      const dateStr = formatDate(checkDate)
      if (uniqueDays.has(dateStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return currentStreak
  }

  // 3. Time by subject (breakdown)
  const getSubjectBreakdown = () => {
    const subjectsMap: { [key: string]: number } = {}
    sessions.forEach((s) => {
      const sub = s.subject.trim()
      subjectsMap[sub] = (subjectsMap[sub] || 0) + s.duration
    })

    const totalSeconds = Object.values(subjectsMap).reduce((a, b) => a + b, 0)

    return Object.keys(subjectsMap)
      .map((sub, index) => ({
        subject: sub,
        seconds: subjectsMap[sub],
        percentage: totalSeconds > 0 ? (subjectsMap[sub] / totalSeconds) * 100 : 0,
        colorClass: SUBJECT_COLORS[index % SUBJECT_COLORS.length],
        textClass: TEXT_COLORS[index % TEXT_COLORS.length],
      }))
      .sort((a, b) => b.seconds - a.seconds)
  }

  const weeklySeconds = getWeeklySeconds()
  const streak = getStreakDays()
  const subjectBreakdown = getSubjectBreakdown()
  const totalStudySeconds = sessions.reduce((acc, s) => acc + s.duration, 0)

  return (
    <div className="space-y-6">
      {/* Top Cards (Total Hours, Streak) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Weekly Stats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Week</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              {formatDuration(weeklySeconds)}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Mon – Sun focus time
            </p>
          </div>
        </div>

        {/* Streak Stats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              {streak} {streak === 1 ? 'day' : 'days'}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              {streak > 0 ? 'Keep the fire burning!' : 'Log a session to start'}
            </p>
          </div>
        </div>
      </div>

      {/* Subject Breakdown Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            <PieChart className="h-4.5 w-4.5 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Time by Subject</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Total: {formatDuration(totalStudySeconds)}
          </span>
        </div>

        {subjectBreakdown.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No study sessions logged yet. Your subject analytics will show up here.
          </div>
        ) : (
          <div className="space-y-4">
            {subjectBreakdown.slice(0, 5).map((item) => (
              <div key={item.subject} className="space-y-1">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-700 truncate max-w-[70%]">
                    {item.subject}
                  </span>
                  <div className="flex gap-2 items-center text-xs font-medium">
                    <span className="text-slate-500">{formatDuration(item.seconds)}</span>
                    <span className={`${item.textClass} font-semibold`}>
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                {/* Progress Bar container */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.colorClass}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {subjectBreakdown.length > 5 && (
              <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
                + {subjectBreakdown.length - 5} other subjects logged
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
