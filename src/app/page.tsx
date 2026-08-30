import Link from "next/link";
import { BookOpen, Clock, Activity, ShieldCheck, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollClock from "@/components/ScrollClock";
import AppShowcase from "@/components/AppShowcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext flex flex-col font-sans relative overflow-x-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(240,235,227,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,235,227,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />
      <div className="absolute top-[-80px] left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.04] blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[-80px] w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] blur-[100px] pointer-events-none -z-10" />

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <Navbar />

      {/* ─── MAIN ────────────────────────────────────────────────── */}
      <main className="flex-1 z-10">

        {/* ══ 1. EDITORIAL HERO ════════════════════════════════════ */}
        <section className="relative w-full max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12 sm:pt-20 sm:pb-14 overflow-hidden">

          {/* Giant watermark */}
          <div aria-hidden="true" className="absolute -top-4 left-0 right-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[22vw] font-black tracking-tighter leading-none text-indigo-950/[0.04] dark:text-white/[0.025] font-display whitespace-nowrap">
              STUDYLOG
            </span>
          </div>

          <div className="relative flex gap-12 lg:gap-16 items-start">

            {/* Left sidebar index nav */}
            <aside className="hidden lg:flex flex-col gap-8 shrink-0 w-[130px] sticky top-28 pt-2">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-warmtext/30 dark:text-darktext/25 uppercase font-mono mb-3">Index</p>
                <div className="w-5 h-px bg-warmtext/20 dark:bg-white/10" />
              </div>
              <nav className="flex flex-col gap-5">
                {[
                  { num: "01", label: "Dashboard", href: "/login" },
                  { num: "02", label: "Focus Timer", href: "/login" },
                  { num: "03", label: "Notepad", href: "/login" },
                  { num: "04", label: "History", href: "/login" },
                ].map((item) => (
                  <Link key={item.num} href={item.href} className="group flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-warmtext/25 dark:text-darktext/25 tracking-widest">{item.num}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-warmtext/45 dark:text-darktext/45 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <div className="w-5 h-px bg-warmtext/20 dark:bg-white/10 mb-3" />
                <p className="text-[9px] font-mono tracking-[0.18em] text-warmtext/25 dark:text-darktext/25 uppercase mb-1.5">Status</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-warmtext/30 dark:text-darktext/30 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </aside>

            {/* Right main canvas */}
            <div className="flex-1 min-w-0 relative">

              {/* Micro label row */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-mono font-bold tracking-[0.22em] text-indigo-600 dark:text-indigo-400 uppercase">Study Session Tracker</span>
                <div className="flex-1 h-px bg-warmtext/10 dark:bg-white/10 max-w-[80px]" />
                <span className="text-xs font-mono tracking-[0.18em] text-warmtext/35 dark:text-darktext/30 uppercase">Focus · Streaks · History</span>
              </div>

              {/* Headline */}
              <div className="mb-10">
                <h1 className="font-display font-black leading-[0.92] tracking-tight">
                  <span className="block text-[clamp(2rem,5vw,3.75rem)] text-warmtext/25 dark:text-darktext/20 uppercase tracking-[0.08em]">BUILD YOUR</span>
                  <span className="block text-[clamp(3.75rem,9.5vw,7.5rem)] bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-300 uppercase leading-[0.9]">FOCUS</span>
                  <span className="block text-[clamp(2rem,5vw,3.75rem)] text-warmtext dark:text-darktext uppercase tracking-[0.04em]">HABIT</span>
                </h1>
              </div>

              {/* Body + CTA + Stats */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-8 mb-14">
                <div className="max-w-sm">
                  <p className="text-base text-warmtext/65 dark:text-darktext/60 leading-relaxed">
                    A minimalist focus dashboard — log subjects, run a live stopwatch, maintain streaks, and analyse your weekly output.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/login?tab=signup" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:-translate-y-0.5 transition-all duration-200">
                      Create Account
                    </Link>
                    <Link href="/login" className="px-6 py-3 border border-warmborder dark:border-white/15 text-warmtext/75 dark:text-darktext/75 hover:text-warmtext dark:hover:text-darktext font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-200">
                      Sign In
                    </Link>
                  </div>
                </div>
                <div className="flex gap-6 sm:gap-8 sm:ml-auto shrink-0">
                  {[
                    { value: "100%", label: "Cloud Sync" },
                    { value: "0",    label: "Ads / Noise" },
                    { value: "Free", label: "Open & Private" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-start">
                      <span className="text-2xl sm:text-3xl font-black text-warmtext dark:text-darktext font-display leading-none">{s.value}</span>
                      <span className="mt-1.5 text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.18em] text-warmtext/40 dark:text-darktext/35 uppercase">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Hero Mockup */}
              <div className="relative w-full rounded-2xl border border-warmborder dark:border-white/10 p-2 bg-warmborder/25 dark:bg-white/[0.03] shadow-2xl shadow-purple-500/10">
                <div className="rounded-xl overflow-hidden border border-warmborder dark:border-white/10 bg-[#FAF7F2] dark:bg-[#0D0E12] flex flex-col text-left aspect-[16/9] select-none">
                  {/* Mock nav */}
                  <div className="border-b border-warmborder/60 dark:border-white/10 px-4 py-2.5 flex items-center justify-between bg-white/60 dark:bg-white/[0.03] shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-xs">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-warmtext dark:text-white">Welcome back, Scholar 👋</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white dark:bg-white/5 border border-warmborder dark:border-white/10 text-[9px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">10:24 AM</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                        <Plus className="h-3 w-3" />
                        <span>New Session</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock body */}
                  <div className="flex-1 p-3 sm:p-4 space-y-2.5 sm:space-y-3 overflow-hidden bg-warmbg/30 dark:bg-black/20">
                    {/* 4 Stat Cards */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-2 sm:p-2.5 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10">
                        <span className="text-[7px] sm:text-[8px] font-medium text-warmtext/50 dark:text-white/40 block truncate">Study Time</span>
                        <span className="text-xs sm:text-sm font-bold text-warmtext dark:text-white font-display">12.5h</span>
                      </div>
                      <div className="p-2 sm:p-2.5 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10">
                        <span className="text-[7px] sm:text-[8px] font-medium text-warmtext/50 dark:text-white/40 block truncate">Streak</span>
                        <span className="text-xs sm:text-sm font-bold text-blue-500 font-display">6 days</span>
                      </div>
                      <div className="p-2 sm:p-2.5 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10">
                        <span className="text-[7px] sm:text-[8px] font-medium text-warmtext/50 dark:text-white/40 block truncate">Sessions</span>
                        <span className="text-xs sm:text-sm font-bold text-teal-500 font-display">14</span>
                      </div>
                      <div className="p-2 sm:p-2.5 bg-white dark:bg-white/5 rounded-xl border border-warmborder dark:border-white/10">
                        <span className="text-[7px] sm:text-[8px] font-medium text-warmtext/50 dark:text-white/40 block truncate">All-Time</span>
                        <span className="text-xs sm:text-sm font-bold text-amber-500 font-display">48.2h</span>
                      </div>
                    </div>

                    {/* Chart & Dial Split */}
                    <div className="grid grid-cols-12 gap-2.5 flex-1 min-h-0">
                      {/* Left: Real Style SVG Chart */}
                      <div className="col-span-7 bg-white dark:bg-white/5 p-2.5 sm:p-3 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-warmtext dark:text-white">
                          <span>Study Overview</span>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">12.5h logged</span>
                        </div>
                        <div className="relative w-full h-16 sm:h-20 my-1">
                          <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="heroMockGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <line x1="15" y1="10" x2="295" y2="10" stroke="currentColor" className="text-warmborder/60 dark:text-white/5" strokeDasharray="2 2" />
                            <line x1="15" y1="35" x2="295" y2="35" stroke="currentColor" className="text-warmborder/60 dark:text-white/5" strokeDasharray="2 2" />
                            <line x1="15" y1="60" x2="295" y2="60" stroke="currentColor" className="text-warmborder/60 dark:text-white/5" />
                            <path d="M 25,50 C 60,30 95,40 130,15 C 165,30 200,10 235,25 C 265,45 280,35 290,40 L 290,60 L 25,60 Z" fill="url(#heroMockGrad)" />
                            <path d="M 25,50 C 60,30 95,40 130,15 C 165,30 200,10 235,25 C 265,45 280,35 290,40" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="130" cy="15" r="2.5" fill="#a855f7" stroke="white" strokeWidth="1" />
                            <circle cx="200" cy="10" r="2.5" fill="#a855f7" stroke="white" strokeWidth="1" />
                            <circle cx="235" cy="25" r="2.5" fill="#a855f7" stroke="white" strokeWidth="1" />
                          </svg>
                        </div>
                        <div className="flex justify-between text-[7px] text-warmtext/40 dark:text-white/30 pt-1 border-t border-warmborder/40 dark:border-white/5">
                          <span>Mon 25</span>
                          <span>Wed 27</span>
                          <span>Fri 29</span>
                          <span className="text-purple-600 dark:text-purple-400 font-bold">Sun 31</span>
                        </div>
                      </div>

                      {/* Right: Circular Focus Dial */}
                      <div className="col-span-5 bg-white dark:bg-white/5 p-2.5 rounded-xl border border-warmborder dark:border-white/10 flex flex-col items-center justify-center">
                        <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-purple-500/20 border-t-purple-500 flex flex-col items-center justify-center">
                          <span className="font-mono text-[10px] sm:text-xs font-bold text-warmtext dark:text-white">25:00</span>
                        </div>
                        <span className="mt-1 text-[7px] px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 font-semibold">
                          Computer Science
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white text-[9px] font-bold tracking-widest uppercase shadow-lg shadow-purple-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />studylog 2.0
                </div>
              </div>
            </div>{/* end right canvas */}
          </div>{/* end two-col grid */}
        </section>

        {/* ══ 2. SCROLL CLOCK ══════════════════════════════════════ */}
        <ScrollClock />

        {/* ══ 3. APP SHOWCASE ══════════════════════════════════════ */}
        <AppShowcase />

        {/* ══ 4. FEATURES + FOOTER CONTENT ════════════════════════ */}
        <div className="max-w-5xl mx-auto px-6 md:px-10 pt-6 pb-16">

          {/* Section divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-warmtext/10 dark:bg-white/10" />
            <span className="text-xs font-mono tracking-[0.25em] text-warmtext/30 dark:text-darktext/25 uppercase">Features</span>
            <div className="flex-1 h-px bg-warmtext/10 dark:bg-white/10" />
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: <Clock className="h-6 w-6" />,
                title: "Focus Timer",
                body: "Start and stop focus sessions. The stopwatch automatically calculates your duration and populates your study logs.",
              },
              {
                icon: <Activity className="h-6 w-6" />,
                title: "Streak Analytics",
                body: "Maintain a study streak, visualise subject breakdowns, and compare weekly stats to see where your focus goes.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6" />,
                title: "Supabase Sync",
                body: "Secure authentication and real-time storage. Your logs and streaks synchronise instantly across all your devices.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="p-7 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="mt-6 font-bold text-xl text-warmtext dark:text-darktext font-display">{title}</h3>
                <p className="mt-3 text-base text-warmtext/60 dark:text-darktext/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Why I Built This */}
          <div className="mt-16 border-t border-warmborder/50 dark:border-white/10 pt-16 pb-12 max-w-2xl mx-auto text-center">
            <h2 className="font-bold text-2xl sm:text-3xl text-warmtext dark:text-darktext font-display">Why I Built This</h2>
            <p className="mt-6 text-base sm:text-lg text-warmtext/70 dark:text-darktext/70 leading-relaxed font-serif italic max-w-xl mx-auto">
              &ldquo;I used to sit down to study, and after a while I&apos;d get restless and just close everything &mdash; no real record of how long I&apos;d actually studied, or what I&apos;d covered. I built studylog to keep myself accountable: track my focus time, see my streaks, and actually know where my hours are going. If you&apos;ve ever felt the same way, I hope this helps you too.&rdquo;
            </p>
            <p className="mt-6 text-xs font-bold text-warmtext/35 dark:text-darktext/35 uppercase tracking-widest">
              &mdash; Yash Jay Mishra
            </p>
          </div>

        </div>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <span className="text-sm text-warmtext/40 dark:text-darktext/30">&copy; {new Date().getFullYear()} studylog</span>
          <span className="text-xs font-mono tracking-[0.18em] text-warmtext/25 dark:text-darktext/20 uppercase">Built for focus</span>
        </div>
      </footer>

    </div>
  );
}
