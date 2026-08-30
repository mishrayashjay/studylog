'use client'

import { motion } from 'framer-motion'
import {
  Clock,
  Bookmark,
  CheckCircle2,
  Trophy,
  Activity,
  Plus,
  RotateCcw,
  Play,
  Pause,
  Folder,
  Search,
  ChevronDown,
  Trash2,
  FileText,
  BookOpen,
  Calendar,
  Layers,
  Code
} from 'lucide-react'

// ── 1. Dashboard Mockup (Matching Real studylog Dashboard Layout) ──────────────

function DashboardMockupCard() {
  return (
    <div className="rounded-2xl border border-warmborder dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0D0E12] shadow-2xl shadow-purple-500/10 overflow-hidden flex flex-col h-[440px] select-none text-left font-sans">
      {/* Top Header Row */}
      <div className="shrink-0 border-b border-warmborder/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between bg-white/70 dark:bg-white/[0.03] backdrop-blur-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white shadow-xs shrink-0">
            <BookOpen className="h-3 w-3" />
          </div>
          <span className="font-bold text-xs text-warmtext dark:text-white truncate">
            Welcome back, Scholar 👋
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Clock Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-white/5 border border-warmborder dark:border-white/10 px-2.5 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col text-[8px] leading-tight">
              <span className="text-warmtext/50 dark:text-white/40">Mon, Aug 31</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">10:24 AM</span>
            </div>
          </div>

          {/* + New Session Button */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold shadow-xs">
            <Plus className="h-3 w-3" />
            <span>New Session</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 min-h-0 p-3.5 space-y-2.5 overflow-hidden bg-warmbg/30 dark:bg-black/20 flex flex-col justify-between">
        
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-4 gap-2 shrink-0">
          {/* 1. Study Time */}
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-medium text-warmtext/50 dark:text-white/40 truncate">Study Time</span>
              <Clock className="h-3 w-3 text-purple-500" />
            </div>
            <div className="mt-0.5">
              <span className="text-xs sm:text-sm font-bold text-warmtext dark:text-white font-display leading-tight">12.5h</span>
              <span className="text-[6.5px] text-purple-600 dark:text-purple-400 block font-medium">This Week</span>
            </div>
          </div>

          {/* 2. Streak */}
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-medium text-warmtext/50 dark:text-white/40 truncate">Streak</span>
              <Bookmark className="h-3 w-3 text-blue-500" />
            </div>
            <div className="mt-0.5">
              <span className="text-xs sm:text-sm font-bold text-blue-500 font-display leading-tight">6 days</span>
              <span className="text-[6.5px] text-blue-500 block font-medium">🔥 Active</span>
            </div>
          </div>

          {/* 3. Sessions */}
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-medium text-warmtext/50 dark:text-white/40 truncate">Sessions</span>
              <CheckCircle2 className="h-3 w-3 text-teal-500" />
            </div>
            <div className="mt-0.5">
              <span className="text-xs sm:text-sm font-bold text-teal-500 font-display leading-tight">14</span>
              <span className="text-[6.5px] text-teal-500 block font-medium">Completed</span>
            </div>
          </div>

          {/* 4. Total Time */}
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-medium text-warmtext/50 dark:text-white/40 truncate">All-Time</span>
              <Trophy className="h-3 w-3 text-amber-500" />
            </div>
            <div className="mt-0.5">
              <span className="text-xs sm:text-sm font-bold text-amber-500 font-display leading-tight">48.2h</span>
              <span className="text-[6.5px] text-amber-500 block font-medium">Lifetime</span>
            </div>
          </div>
        </div>

        {/* Middle Two Columns Grid (Chart & Focus Panel) */}
        <div className="grid grid-cols-12 gap-2.5 flex-1 min-h-0">
          {/* Left Main (7 of 12 cols): Study Overview Real SVG Area Chart */}
          <div className="col-span-7 bg-white dark:bg-white/5 p-2.5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-purple-500" />
                <span className="text-[9px] font-bold text-warmtext dark:text-white">Study Overview</span>
              </div>
              <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-warmbg dark:bg-white/10 text-warmtext/60 dark:text-white/50 font-medium">
                This Week
              </span>
            </div>

            {/* SVG Chart Preview with Distinct Y-Ticks and Day Dates */}
            <div className="relative w-full h-20 my-0.5">
              <svg viewBox="0 0 300 90" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Grid lines */}
                <line x1="20" y1="12" x2="295" y2="12" stroke="currentColor" className="text-warmborder/60 dark:text-white/5" strokeDasharray="2 2" />
                <line x1="20" y1="38" x2="295" y2="38" stroke="currentColor" className="text-warmborder/60 dark:text-white/5" strokeDasharray="2 2" />
                <line x1="20" y1="64" x2="295" y2="64" stroke="currentColor" className="text-warmborder/60 dark:text-white/5" />

                {/* Y labels */}
                <text x="2" y="15" fill="currentColor" className="text-warmtext/30 dark:text-white/30" fontSize="7">2h</text>
                <text x="2" y="41" fill="currentColor" className="text-warmtext/30 dark:text-white/30" fontSize="7">1h</text>
                <text x="2" y="67" fill="currentColor" className="text-warmtext/30 dark:text-white/30" fontSize="7">0</text>

                {/* Area and Line */}
                <path d="M 30,55 C 65,35 100,45 135,18 C 170,30 205,12 240,25 C 270,48 285,35 290,40 L 290,64 L 30,64 Z" fill="url(#mockGrad)" />
                <path d="M 30,55 C 65,35 100,45 135,18 C 170,30 205,12 240,25 C 270,48 285,35 290,40" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />

                {/* Points */}
                <circle cx="135" cy="18" r="2.5" fill="#a855f7" stroke="white" strokeWidth="1" />
                <circle cx="205" cy="12" r="2.5" fill="#a855f7" stroke="white" strokeWidth="1" />
                <circle cx="240" cy="25" r="2.5" fill="#a855f7" stroke="white" strokeWidth="1" />

                {/* X-axis days + dates */}
                {['M 25', 'T 26', 'W 27', 'T 28', 'F 29', 'S 30', 'S 31'].map((d, i) => (
                  <text key={d} x={30 + i * 43} y="78" textAnchor="middle" fill="currentColor" className={i === 6 ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-warmtext/40 dark:text-white/30'} fontSize="6.5">
                    {d}
                  </text>
                ))}
              </svg>
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-warmborder/50 dark:border-white/10 text-[6.5px]">
              <div>
                <span className="text-warmtext/40 dark:text-white/30 block">Total</span>
                <span className="font-bold text-warmtext dark:text-white">12.5 hrs</span>
              </div>
              <div>
                <span className="text-warmtext/40 dark:text-white/30 block">Daily Avg</span>
                <span className="font-bold text-warmtext dark:text-white">1.8 hrs</span>
              </div>
              <div>
                <span className="text-warmtext/40 dark:text-white/30 block">Best Day</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">Wed (3.2h)</span>
              </div>
            </div>
          </div>

          {/* Right Main (5 of 12 cols): Live Focus Clock Ring & Subject Donut */}
          <div className="col-span-5 flex flex-col gap-2 justify-between">
            {/* Today's Focus Circular Dial */}
            <div className="bg-white dark:bg-white/5 p-2 rounded-xl border border-warmborder dark:border-white/10 flex flex-col items-center justify-center flex-1">
              <div className="w-14 h-14 rounded-full border-[2.5px] border-purple-500/20 border-t-purple-500 flex flex-col items-center justify-center relative shadow-xs">
                <span className="font-mono text-xs font-bold text-warmtext dark:text-white leading-none">25:00</span>
                <span className="text-[6px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mt-0.5">Focus</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[7.5px] font-semibold text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 truncate max-w-[90px]">
                  Computer Science
                </span>
              </div>
              <div className="flex gap-1.5 mt-1">
                <div className="p-1 rounded-full bg-warmbg dark:bg-white/10 text-warmtext/50 dark:text-white/40"><RotateCcw className="h-2 w-2" /></div>
                <div className="p-1 rounded-full bg-purple-600 text-white shadow-xs"><Play className="h-2 w-2 fill-white" /></div>
                <div className="p-1 rounded-full bg-warmbg dark:bg-white/10 text-warmtext/50 dark:text-white/40"><Pause className="h-2 w-2" /></div>
              </div>
            </div>

            {/* Time by Subject Bars */}
            <div className="bg-white dark:bg-white/5 p-2 rounded-xl border border-warmborder dark:border-white/10 space-y-1 shrink-0">
              <div className="flex items-center justify-between text-[7px] font-bold text-warmtext/50 dark:text-white/40 uppercase tracking-wider">
                <span>Time by Subject</span>
                <span className="text-purple-500">2 Active</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between text-[7px] font-semibold text-warmtext/70 dark:text-white/60"><span>CompSci</span><span>65%</span></div>
                <div className="h-1 bg-warmbg dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full w-[65%]" /></div>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between text-[7px] font-semibold text-warmtext/70 dark:text-white/60"><span>Math</span><span>25%</span></div>
                <div className="h-1 bg-warmbg dark:bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full w-[25%]" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Sessions Preview */}
        <div className="bg-white dark:bg-white/5 p-2.5 rounded-xl border border-warmborder dark:border-white/10 shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-[7.5px] font-bold text-warmtext/50 dark:text-white/40 uppercase tracking-wider">
            <span>Recent Activity</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">View All →</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Session 1 */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-warmbg/40 dark:bg-white/[0.02] border border-warmborder/40 dark:border-white/5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="p-1 rounded bg-purple-500/10 text-purple-500 shrink-0">
                  <Code className="h-2.5 w-2.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-warmtext dark:text-white truncate block">Algorithms & DP</span>
                  <span className="text-[6.5px] text-warmtext/40 dark:text-white/35">Today, 9:14 AM</span>
                </div>
              </div>
              <span className="text-[7.5px] font-semibold text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/10 shrink-0">
                1h 45m
              </span>
            </div>

            {/* Session 2 */}
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-warmbg/40 dark:bg-white/[0.02] border border-warmborder/40 dark:border-white/5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="p-1 rounded bg-blue-500/10 text-blue-500 shrink-0">
                  <Layers className="h-2.5 w-2.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-warmtext dark:text-white truncate block">Linear Algebra</span>
                  <span className="text-[6.5px] text-warmtext/40 dark:text-white/35">Yesterday, 8:30 PM</span>
                </div>
              </div>
              <span className="text-[7.5px] font-semibold text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/10 shrink-0">
                55m
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── 2. History Mockup (Matching Real History Component with Sections) ─────────

function HistoryMockupCard() {
  const SESSIONS = [
    {
      subject: 'Data Structures & Algorithms',
      section: 'Dynamic Programming',
      duration: '1h 45m',
      date: 'Today, 09:14 AM',
      notes: 'Reviewed knapsack variants and memoization tabular bounds.',
    },
    {
      subject: 'Linear Algebra',
      section: 'Vector Spaces',
      duration: '55m',
      date: 'Yesterday, 8:30 PM',
      notes: 'Matrix diagonalization, eigenvalues, and basis transformations.',
    },
    {
      subject: 'Operating Systems',
      section: 'Memory Management',
      duration: '2h 10m',
      date: 'Aug 29, 3:00 PM',
      notes: 'Virtual memory paging algorithms, TLB cache hierarchy.',
    },
  ]

  return (
    <div className="rounded-2xl border border-warmborder dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0D0E12] shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col h-[440px] select-none text-left font-sans">
      {/* History Header with Filters */}
      <div className="shrink-0 border-b border-warmborder/60 dark:border-white/10 p-3.5 flex flex-col gap-2.5 bg-white/70 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-bold text-xs text-warmtext dark:text-white block">Study History</span>
              <span className="text-[8px] text-warmtext/50 dark:text-white/40">Review and assign sections</span>
            </div>
          </div>
          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            3 sessions logged
          </span>
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              readOnly
              value="Search by subject, section..."
              className="w-full pl-7 pr-2 py-1 text-[9px] bg-warmbg/60 dark:bg-white/5 border border-warmborder dark:border-white/10 rounded-lg text-warmtext/40 dark:text-white/30"
            />
            <Search className="h-2.5 w-2.5 absolute left-2.5 top-2 text-warmtext/40 dark:text-white/30" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-warmbg/60 dark:bg-white/5 border border-warmborder dark:border-white/10 rounded-lg text-[9px] text-warmtext/60 dark:text-white/50">
            <Calendar className="h-2.5 w-2.5 text-warmtext/40 dark:text-white/40" />
            <span>This Week</span>
            <ChevronDown className="h-2.5 w-2.5 ml-1 text-warmtext/30 dark:text-white/30" />
          </div>
        </div>
      </div>

      {/* Session Rows List */}
      <div className="flex-1 min-h-0 p-3 space-y-2.5 overflow-hidden bg-warmbg/20 dark:bg-black/20">
        {SESSIONS.map((sess, idx) => (
          <div
            key={idx}
            className="p-3 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10 shadow-xs flex items-start justify-between gap-3"
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-xs text-warmtext dark:text-white truncate">
                  {sess.subject}
                </span>
                <span className="text-[8px] font-medium text-warmtext/40 dark:text-white/35 shrink-0">
                  {sess.date}
                </span>
              </div>

              {/* Badges: Duration + Interactive Section Tag */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[8px] font-semibold">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{sess.duration}</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-300 text-[8px] font-medium">
                  <Folder className="h-2.5 w-2.5" />
                  <span>{sess.section}</span>
                </div>
              </div>

              {/* Notes Snippet */}
              <p className="text-[8.5px] italic text-warmtext/60 dark:text-white/50 leading-relaxed bg-warmbg/50 dark:bg-white/[0.02] p-1.5 rounded-lg border border-warmborder/50 dark:border-white/5">
                {sess.notes}
              </p>
            </div>

            {/* Action Icon */}
            <div className="p-1 text-warmtext/30 dark:text-white/20 hover:text-red-400">
              <Trash2 className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 3. Notepad Mockup (Matching Real Notes Page with Split Pane & Autosave) ────

function NotepadMockupCard() {
  return (
    <div className="rounded-2xl border border-warmborder dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0D0E12] shadow-2xl shadow-purple-500/10 overflow-hidden flex flex-col h-[440px] select-none text-left font-sans">
      {/* Top Header */}
      <div className="shrink-0 border-b border-warmborder/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between bg-white/70 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-purple-500/10 text-purple-500 rounded-lg border border-purple-500/20">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-xs text-warmtext dark:text-white">Study Notes</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Saved to Cloud</span>
        </div>
      </div>

      {/* Split Pane: Left Notes List + Right Note Editor */}
      <div className="flex-1 min-h-0 flex bg-warmbg/20 dark:bg-black/20 overflow-hidden">
        {/* Left Notes Sidebar */}
        <div className="w-40 shrink-0 border-r border-warmborder/60 dark:border-white/10 p-2 space-y-1.5 overflow-hidden">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[7px] font-bold uppercase text-warmtext/40 dark:text-white/30 tracking-wider">All Notes</span>
            <span className="text-[7px] font-bold text-purple-500">+ New</span>
          </div>

          {/* Note 1: Active */}
          <div className="p-2 rounded-xl bg-white dark:bg-white/10 border border-purple-500/40 shadow-xs space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-bold text-warmtext dark:text-white truncate">Algorithms Review</span>
              <span className="text-[6.5px] px-1 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold uppercase shrink-0">DSA</span>
            </div>
            <p className="text-[7.5px] text-warmtext/50 dark:text-white/40 truncate">
              Binary search invariants and heap bounds...
            </p>
          </div>

          {/* Note 2 */}
          <div className="p-2 rounded-xl bg-transparent hover:bg-white/40 dark:hover:bg-white/5 border border-transparent space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-semibold text-warmtext/70 dark:text-white/70 truncate">Eigenvalues & Basis</span>
              <span className="text-[6.5px] px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold uppercase shrink-0">Math</span>
            </div>
            <p className="text-[7.5px] text-warmtext/40 dark:text-white/30 truncate">
              Diagonalization conditions for symmetric...
            </p>
          </div>

          {/* Note 3 */}
          <div className="p-2 rounded-xl bg-transparent hover:bg-white/40 dark:hover:bg-white/5 border border-transparent space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-semibold text-warmtext/70 dark:text-white/70 truncate">Virtual Memory</span>
              <span className="text-[6.5px] px-1 py-0.2 rounded bg-blue-500/15 text-blue-600 dark:text-blue-300 font-bold uppercase shrink-0">Systems</span>
            </div>
            <p className="text-[7.5px] text-warmtext/40 dark:text-white/30 truncate">
              Page fault interrupt routines and TLB...
            </p>
          </div>
        </div>

        {/* Right Note Active Editor */}
        <div className="flex-1 p-3.5 flex flex-col gap-2 overflow-hidden bg-white dark:bg-white/[0.02]">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-bold text-warmtext dark:text-white font-display">
              Algorithms Review
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold uppercase tracking-wider">
                Category: DSA
              </span>
              <span className="text-[8px] text-warmtext/40 dark:text-white/30">Updated just now</span>
            </div>
          </div>

          <div className="h-px bg-warmborder/60 dark:border-white/10 my-0.5" />

          {/* Editor Body */}
          <div className="text-[9px] text-warmtext/70 dark:text-white/70 leading-relaxed space-y-2 overflow-hidden">
            <p>
              • <strong>Binary Search:</strong> Runs in <code className="px-1 py-0.5 bg-warmbg dark:bg-white/10 rounded font-mono text-purple-600 dark:text-purple-300">O(log n)</code> by maintaining monotonic search spaces.
            </p>
            <p>
              • <strong>QuickSelect:</strong> Expected <code className="px-1 py-0.5 bg-warmbg dark:bg-white/10 rounded font-mono text-purple-600 dark:text-purple-300">O(n)</code> for k-th order statistics with random pivoting.
            </p>
            <p>
              • <strong>Dynamic Programming:</strong> Always verify optimal substructure and overlapping subproblems before setting state dimensions.
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between pt-2 border-t border-warmborder/40 dark:border-white/10 text-[8px] text-warmtext/40 dark:text-white/30">
            <span>Markdown formatting enabled</span>
            <span className="font-mono">142 words</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Slide Row Component (Scroll-Triggered whileInView) ─────────────────────────

interface ShowcaseSlideProps {
  num: string
  sub: string
  heading: string
  desc: string
  card: React.ReactNode
  reverse?: boolean
}

function ShowcaseSlide({ num, sub, heading, desc, card, reverse = false }: ShowcaseSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`py-14 flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-between gap-8 lg:gap-14`}
    >
      {/* Text Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="shrink-0 lg:w-72 w-full flex flex-col justify-center text-left"
      >
        <span className="text-xs font-mono font-bold tracking-[0.22em] text-purple-600 dark:text-purple-400 uppercase mb-2 block">
          {num} &mdash; {sub}
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-warmtext dark:text-white leading-tight">
          {heading}
        </h3>
        <p className="mt-3 text-sm text-warmtext/60 dark:text-white/60 leading-relaxed">
          {desc}
        </p>
      </motion.div>

      {/* Mockup Card Column */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, margin: '-60px' }}
        transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 min-w-0 max-w-2xl w-full"
      >
        {card}
      </motion.div>
    </motion.div>
  )
}

// ── Main Showcase Component (Normal Sequential Flow, Zero Overlap) ─────────────

export default function AppShowcase() {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 md:px-10 py-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-purple-500/[0.03] blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col divide-y divide-warmborder/40 dark:divide-white/5">
        {/* Slide 1: Dashboard */}
        <ShowcaseSlide
          num="01"
          sub="Dashboard"
          heading="Track your focus."
          desc="Real streak counters, weekly aggregated area charts, circular focus dials, and subject analytics — at a single glance."
          card={<DashboardMockupCard />}
        />

        {/* Slide 2: History */}
        <ShowcaseSlide
          num="02"
          sub="Study History"
          heading="Review your sessions."
          desc="Every session logged with custom section tags, duration badges, and notes. Assign and categorize seamlessly."
          card={<HistoryMockupCard />}
          reverse
        />

        {/* Slide 3: Notepad */}
        <ShowcaseSlide
          num="03"
          sub="Study Notes"
          heading="Capture your insights."
          desc="Organize study notes with subject categories, instant cloud sync, and markdown formatting alongside your focus sessions."
          card={<NotepadMockupCard />}
        />
      </div>
    </section>
  )
}
