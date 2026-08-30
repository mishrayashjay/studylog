'use client'

import { motion } from 'framer-motion'
import { Clock, Award, BookOpen, FileText, RotateCcw, Pause, Square } from 'lucide-react'

// ── Mock data ──────────────────────────────────────────────────────────────────

const HISTORY_SESSIONS = [
  { subject: 'Data Structures',  duration: '1h 45m', date: 'Today, 09:14 AM',    tag: 'DSA',     color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' },
  { subject: 'Linear Algebra',   duration: '55m',    date: 'Yesterday, 8:30 PM', tag: 'Math',    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' },
  { subject: 'OS Concepts',      duration: '2h 10m', date: 'Mon, 3:00 PM',       tag: 'Systems', color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20' },
  { subject: 'QuickSort Review', duration: '40m',    date: 'Sun, 10:00 AM',      tag: 'DSA',     color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' },
]

// ── View Mockup Components ─────────────────────────────────────────────────────

function DashboardCard() {
  return (
    <div className="rounded-2xl border border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg shadow-xl shadow-indigo-500/5 overflow-hidden flex flex-col h-[320px] select-none">
      <div className="shrink-0 border-b border-warmborder/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between bg-warmbg/50 dark:bg-white/[0.03]">
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-indigo-600 dark:bg-indigo-500 rounded text-white">
            <BookOpen className="h-3 w-3" />
          </div>
          <span className="font-bold text-[11px] text-warmtext dark:text-darktext">studylog</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-14 h-3 bg-warmborder/40 dark:bg-white/10 rounded-full" />
          <div className="w-7 h-3 bg-warmborder/40 dark:bg-white/10 rounded-full" />
        </div>
      </div>
      <div className="flex-1 min-h-0 p-3.5 grid grid-cols-12 gap-3 bg-warmbg/20 dark:bg-[#18161408]">
        <div className="col-span-5 flex flex-col gap-2.5">
          <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-warmborder dark:border-white/10 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-[3px] border-indigo-600/15 dark:border-indigo-500/15 border-t-indigo-600 dark:border-t-indigo-500 flex flex-col items-center justify-center">
              <span className="font-mono text-sm font-extrabold text-warmtext dark:text-darktext">25:00</span>
              <span className="text-[7px] text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest">Focusing</span>
            </div>
            <div className="flex gap-1.5">
              <div className="p-1.5 rounded-full bg-warmbg dark:bg-white/10 text-warmtext/40"><RotateCcw className="h-2.5 w-2.5" /></div>
              <div className="p-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white"><Pause className="h-3 w-3 fill-white" /></div>
              <div className="p-1.5 rounded-full bg-emerald-600 text-white"><Square className="h-2.5 w-2.5 fill-white" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 p-2.5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col gap-1.5">
            <span className="text-[7px] font-bold text-warmtext/35 dark:text-darktext/35 uppercase tracking-wider">Recent Note</span>
            <span className="text-xs font-bold text-warmtext/80 dark:text-darktext/80 truncate">Algorithms Review</span>
            <span className="text-[7px] px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-500/20 font-bold uppercase tracking-widest w-fit">DSA</span>
          </div>
        </div>
        <div className="col-span-7 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white dark:bg-white/5 p-2.5 rounded-xl border border-warmborder dark:border-white/10 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
              <div>
                <div className="text-[7px] text-warmtext/35 dark:text-darktext/35 uppercase">This Week</div>
                <div className="text-sm font-extrabold text-warmtext dark:text-darktext">12.5h</div>
              </div>
            </div>
            <div className="bg-white dark:bg-white/5 p-2.5 rounded-xl border border-warmborder dark:border-white/10 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <div className="text-[7px] text-warmtext/35 dark:text-darktext/35 uppercase">Streak</div>
                <div className="text-sm font-extrabold text-warmtext dark:text-darktext">6 days</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-warmborder dark:border-white/10 flex flex-col gap-2">
            <div className="text-[7px] font-bold text-warmtext/35 dark:text-darktext/35 uppercase tracking-wider">Time by Subject</div>
            {[
              { label: 'Computer Science', pct: 65, color: 'bg-indigo-500' },
              { label: 'Mathematics',      pct: 25, color: 'bg-emerald-500' },
              { label: 'OS Concepts',      pct: 10, color: 'bg-sky-500' },
            ].map(({ label, pct, color }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-warmtext/55 dark:text-darktext/40">
                  <span>{label}</span><span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-warmbg dark:bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryCard() {
  return (
    <div className="rounded-2xl border border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg shadow-xl shadow-indigo-500/5 overflow-hidden flex flex-col h-[320px] select-none">
      <div className="shrink-0 border-b border-warmborder/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between bg-warmbg/50 dark:bg-white/[0.03]">
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-indigo-600 dark:bg-indigo-500 rounded text-white">
            <Clock className="h-3 w-3" />
          </div>
          <span className="font-bold text-[11px] text-warmtext dark:text-darktext">History</span>
        </div>
        <span className="text-[8px] font-bold text-warmtext/30 dark:text-darktext/30 uppercase tracking-widest">4 sessions this week</span>
      </div>
      <div className="flex-1 min-h-0 p-3.5 flex flex-col gap-2 bg-warmbg/20 dark:bg-transparent overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100/60 dark:border-indigo-500/15 shrink-0">
          <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Weekly Total</span>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-display">12h 30m</span>
        </div>
        {HISTORY_SESSIONS.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-[7px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-widest shrink-0 ${s.color}`}>{s.tag}</span>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-warmtext/85 dark:text-darktext/85 truncate">{s.subject}</div>
                <div className="text-[7px] text-warmtext/40 dark:text-darktext/40">{s.date}</div>
              </div>
            </div>
            <span className="text-[9px] font-bold text-warmtext/50 dark:text-darktext/50 shrink-0 ml-2">{s.duration}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotepadCard() {
  return (
    <div className="rounded-2xl border border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg shadow-xl shadow-indigo-500/5 overflow-hidden flex flex-col h-[320px] select-none">
      <div className="shrink-0 border-b border-warmborder/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between bg-warmbg/50 dark:bg-white/[0.03]">
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-indigo-600 dark:bg-indigo-500 rounded text-white">
            <FileText className="h-3 w-3" />
          </div>
          <span className="font-bold text-[11px] text-warmtext dark:text-darktext">Notepad</span>
        </div>
        <span className="text-[8px] font-bold text-warmtext/30 dark:text-darktext/30 uppercase tracking-widest">3 notes</span>
      </div>
      <div className="flex-1 min-h-0 flex overflow-hidden bg-warmbg/20 dark:bg-transparent">
        <div className="w-32 shrink-0 border-r border-warmborder/60 dark:border-white/10 p-2 flex flex-col gap-1.5 overflow-hidden">
          {[
            { title: 'Algorithms Review', cat: 'DSA',     active: true },
            { title: 'Eigenvalues',        cat: 'Math',    active: false },
            { title: 'Process Scheduling', cat: 'Systems', active: false },
          ].map((n, i) => (
            <div key={i} className={`p-2 rounded-lg border flex flex-col gap-1 ${n.active ? 'border-indigo-500/40 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent'}`}>
              <span className="text-[9px] font-bold text-warmtext/80 dark:text-darktext/80 truncate leading-snug">{n.title}</span>
              <span className="text-[7px] px-1 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-500/20 font-bold uppercase tracking-widest w-fit">{n.cat}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0 p-3 flex flex-col gap-2 overflow-hidden">
          <div>
            <div className="text-xs font-bold text-warmtext dark:text-darktext">Algorithms Review</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[7px] px-1 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-500/20 font-bold uppercase tracking-widest">DSA</span>
              <span className="text-[8px] text-warmtext/30 dark:text-darktext/30">Saved just now</span>
            </div>
          </div>
          <div className="h-px bg-warmborder/50 dark:bg-white/8" />
          <div className="text-[9px] text-warmtext/55 dark:text-darktext/55 leading-relaxed space-y-2">
            <p>Binary search runs in O(log n) by halving the search range each step.</p>
            <p>QuickSort avg case O(n log n) — worst O(n²) if pivot is always min/max.</p>
            <p>Merge sort is stable, always O(n log n), but needs O(n) extra space.</p>
          </div>
          <div className="w-0.5 h-3.5 bg-indigo-500 animate-pulse mt-1" />
        </div>
      </div>
    </div>
  )
}

// ── Slide Row Component (Replaying whileInView with smooth fade + slide) ────────

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
        className="shrink-0 lg:w-72 w-full flex flex-col justify-center"
      >
        <span className="text-xs font-mono font-bold tracking-[0.22em] text-indigo-600 dark:text-indigo-400 uppercase mb-2 block">
          {num} &mdash; {sub}
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-warmtext dark:text-darktext leading-tight">
          {heading}
        </h3>
        <p className="mt-3 text-sm text-warmtext/60 dark:text-darktext/50 leading-relaxed">
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/[0.03] dark:bg-indigo-500/[0.03] blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col divide-y divide-warmborder/40 dark:divide-white/5">
        {/* Slide 1: Dashboard */}
        <ShowcaseSlide
          num="01"
          sub="Dashboard"
          heading="Track your focus."
          desc="Live timers, streak counters, and weekly stats — all at a single glance."
          card={<DashboardCard />}
        />

        {/* Slide 2: History */}
        <ShowcaseSlide
          num="02"
          sub="History"
          heading="Review your history."
          desc="Every session logged, categorized, and searchable. Know where your hours went."
          card={<HistoryCard />}
          reverse
        />

        {/* Slide 3: Notepad */}
        <ShowcaseSlide
          num="03"
          sub="Notepad"
          heading="Capture your thoughts."
          desc="Write and organize insights from each study session, tagged by subject."
          card={<NotepadCard />}
        />
      </div>
    </section>
  )
}
