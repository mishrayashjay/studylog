import Link from "next/link";
import { BookOpen, Clock, Activity, ShieldCheck, Square, Award, RotateCcw, Pause } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ScrollClock from "@/components/ScrollClock";

export default function Home() {
  return (
    <div className="min-h-screen bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext flex flex-col font-sans relative overflow-x-hidden">

      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(240,235,227,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,235,227,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />
      {/* Ambient glows */}
      <div className="absolute top-[-80px] left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.04] dark:bg-indigo-500/[0.04] blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[-80px] w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] dark:bg-purple-500/[0.04] blur-[100px] pointer-events-none -z-10" />

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className="border-b border-warmborder dark:border-white/10 bg-[#FAF7F2]/75 dark:bg-[#1C1A18]/75 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-xl text-white shadow-sm shadow-indigo-600/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight font-display">studylog</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold px-3 py-1.5 text-warmtext/60 dark:text-darktext/60 hover:text-warmtext dark:hover:text-darktext transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?tab=signup"
              className="text-sm font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl transition-all duration-200 shadow-sm shadow-indigo-600/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN ───────────────────────────────────────────────── */}
      <main className="flex-1 z-10">

        {/* ══ EDITORIAL HERO ══════════════════════════════════════ */}
        <section className="relative w-full max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">

          {/* Giant watermark — sits behind everything */}
          <div
            aria-hidden="true"
            className="absolute -top-4 left-0 right-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            <span className="text-[22vw] font-black tracking-tighter leading-none text-indigo-950/[0.04] dark:text-white/[0.025] font-display whitespace-nowrap">
              STUDYLOG
            </span>
          </div>

          {/* ── Two-column layout: sidebar + main canvas ── */}
          <div className="relative flex gap-12 lg:gap-16 items-start">

            {/* LEFT SIDEBAR — vertical index navigation */}
            <aside className="hidden lg:flex flex-col gap-8 shrink-0 w-[120px] sticky top-28 pt-2">
              {/* System label */}
              <div>
                <p className="text-[8px] font-bold tracking-[0.2em] text-warmtext/30 dark:text-darktext/25 uppercase font-mono mb-3">
                  Index
                </p>
                <div className="w-5 h-px bg-warmtext/20 dark:bg-white/10" />
              </div>

              {/* Index links */}
              <nav className="flex flex-col gap-4">
                {[
                  { num: "01", label: "Dashboard", href: "/login" },
                  { num: "02", label: "Focus Timer", href: "/login" },
                  { num: "03", label: "Notepad", href: "/login" },
                  { num: "04", label: "History", href: "/login" },
                ].map((item) => (
                  <Link
                    key={item.num}
                    href={item.href}
                    className="group flex flex-col gap-0.5"
                  >
                    <span className="text-[7px] font-mono text-warmtext/25 dark:text-darktext/25 tracking-widest">
                      {item.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-warmtext/40 dark:text-darktext/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Status pill */}
              <div className="mt-auto">
                <div className="w-5 h-px bg-warmtext/20 dark:bg-white/10 mb-3" />
                <p className="text-[7px] font-mono tracking-[0.18em] text-warmtext/25 dark:text-darktext/25 uppercase mb-1">
                  Status
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-warmtext/30 dark:text-darktext/30 uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>
            </aside>

            {/* RIGHT MAIN CANVAS */}
            <div className="flex-1 min-w-0 relative">

              {/* ── Top micro label row ── */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-indigo-600 dark:text-indigo-400 uppercase">
                  Study Session Tracker
                </span>
                <div className="flex-1 h-px bg-warmtext/10 dark:bg-white/10 max-w-[80px]" />
                <span className="text-[9px] font-mono tracking-[0.2em] text-warmtext/30 dark:text-darktext/30 uppercase">
                  Focus · Streaks · History
                </span>
              </div>

              {/* ── Primary typographic headline ── */}
              <div className="mb-10">
                <h1 className="font-display font-black leading-[0.92] tracking-tight">
                  {/* First line — muted label */}
                  <span className="block text-[clamp(2rem,5vw,3.5rem)] text-warmtext/25 dark:text-darktext/20 uppercase tracking-[0.08em]">
                    BUILD YOUR
                  </span>
                  {/* Second line — high-contrast, gradient */}
                  <span className="block text-[clamp(3.5rem,9vw,7rem)] bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-300 dark:via-purple-300 dark:to-indigo-300 uppercase leading-[0.9]">
                    FOCUS
                  </span>
                  {/* Third line — smaller, high-contrast warm */}
                  <span className="block text-[clamp(2rem,5vw,3.5rem)] text-warmtext dark:text-darktext uppercase tracking-[0.04em]">
                    HABIT
                  </span>
                </h1>
              </div>

              {/* ── Body text + CTA row ── */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-8 mb-14">
                <div className="max-w-xs">
                  <p className="text-sm text-warmtext/60 dark:text-darktext/55 leading-relaxed">
                    A minimalist focus dashboard — log subjects, run a live stopwatch, maintain streaks, and analyze your weekly output.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/login?tab=signup"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Create Account
                    </Link>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 bg-transparent border border-warmborder dark:border-white/15 text-warmtext/70 dark:text-darktext/70 hover:text-warmtext dark:hover:text-darktext text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>

                {/* Stat column — editorial right-aligned numbers */}
                <div className="flex gap-6 sm:ml-auto shrink-0">
                  {[
                    { value: "2,400+", label: "Hours" },
                    { value: "12k+", label: "Sessions" },
                    { value: "99.9%", label: "Uptime" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-start">
                      <span className="text-2xl font-black text-warmtext dark:text-darktext font-display leading-none">
                        {s.value}
                      </span>
                      <span className="mt-1 text-[8px] font-mono font-bold tracking-[0.18em] text-warmtext/30 dark:text-darktext/30 uppercase">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── App Mockup — overlapping the watermark ── */}
              <div className="relative w-full rounded-2xl border border-warmborder dark:border-white/10 p-2 bg-warmborder/25 dark:bg-white/[0.03] shadow-2xl shadow-indigo-500/8">
                <div className="rounded-xl overflow-hidden border border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg flex flex-col text-left aspect-[16/9]">
                  {/* Mock Nav Bar */}
                  <div className="border-b border-warmborder/60 dark:border-white/10 px-4 py-3 flex items-center justify-between bg-warmbg/50 dark:bg-white/5 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-indigo-600 dark:bg-indigo-500 rounded text-white">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-xs text-warmtext dark:text-darktext">studylog</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-3.5 bg-warmborder/40 dark:bg-white/10 rounded-full" />
                      <div className="w-8 h-3.5 bg-warmborder/40 dark:bg-white/10 rounded-full" />
                    </div>
                  </div>
                  {/* Mock Body Grid */}
                  <div className="flex-1 p-4 grid grid-cols-12 gap-3 overflow-hidden bg-warmbg/20 dark:bg-darkbg">
                    {/* Left Column */}
                    <div className="col-span-5 space-y-3">
                      {/* Focus timer ring */}
                      <div className="bg-[#FDFCFB] dark:bg-white/5 p-4 rounded-xl border border-warmborder dark:border-white/10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-indigo-600/15 dark:border-indigo-500/15 border-t-indigo-600 dark:border-t-indigo-500 flex flex-col items-center justify-center">
                          <span className="font-mono text-sm font-extrabold text-warmtext dark:text-darktext">25:00</span>
                          <span className="text-[6px] text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest mt-0.5">Focusing</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <div className="p-1.5 rounded-full bg-warmbg dark:bg-white/10 text-warmtext/40 dark:text-darktext/40"><RotateCcw className="h-2.5 w-2.5" /></div>
                          <div className="p-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white"><Pause className="h-3 w-3 fill-white" /></div>
                          <div className="p-1.5 rounded-full bg-emerald-600 text-white"><Square className="h-2.5 w-2.5 fill-white" /></div>
                        </div>
                      </div>
                      {/* Recent note card */}
                      <div className="bg-[#FDFCFB] dark:bg-white/5 p-3 rounded-xl border border-warmborder dark:border-white/10 flex flex-col justify-between h-16 text-[9px]">
                        <div className="flex justify-between items-center text-warmtext/35 dark:text-darktext/35 font-bold uppercase tracking-wider text-[6px]">
                          <span>Recent Note</span><span>2m ago</span>
                        </div>
                        <p className="font-bold text-warmtext/80 dark:text-darktext/80 truncate text-[9px]">Algorithms Review</p>
                        <span className="text-[6px] px-1 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-500/20 font-bold uppercase tracking-widest w-fit">DSA</span>
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-span-7 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#FDFCFB] dark:bg-white/5 p-3 rounded-xl border border-warmborder dark:border-white/10 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                          <div>
                            <div className="text-[6px] text-warmtext/35 dark:text-darktext/35 uppercase">This Week</div>
                            <div className="text-xs font-extrabold text-warmtext dark:text-darktext">12.5h</div>
                          </div>
                        </div>
                        <div className="bg-[#FDFCFB] dark:bg-white/5 p-3 rounded-xl border border-warmborder dark:border-white/10 flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500 shrink-0" />
                          <div>
                            <div className="text-[6px] text-warmtext/35 dark:text-darktext/35 uppercase">Streak</div>
                            <div className="text-xs font-extrabold text-warmtext dark:text-darktext">6 days</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#FDFCFB] dark:bg-white/5 p-3.5 rounded-xl border border-warmborder dark:border-white/10 flex-1 flex flex-col gap-2">
                        <div className="text-[7px] font-bold text-warmtext/35 dark:text-darktext/35 uppercase tracking-wider">Time by Subject</div>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-bold text-warmtext/60 dark:text-darktext/40">
                              <span>Computer Science</span><span>70%</span>
                            </div>
                            <div className="h-1 bg-warmbg dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full w-[70%]" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-bold text-warmtext/60 dark:text-darktext/40">
                              <span>Mathematics</span><span>30%</span>
                            </div>
                            <div className="h-1 bg-warmbg dark:bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full w-[30%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating accent tag on mockup corner */}
                <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 dark:bg-indigo-500 rounded-full text-white text-[8px] font-bold tracking-widest uppercase shadow-lg shadow-indigo-600/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                  studylog 2.0
                </div>
              </div>
            </div>{/* end right canvas */}
          </div>{/* end two-column grid */}
        </section>

        {/* ══ REST OF PAGE — standard max-w-5xl centered ══════════ */}
        <div className="max-w-5xl mx-auto px-6">

          {/* Scroll Clock */}
          <ScrollClock />

          {/* Divider */}
          <div className="flex items-center gap-4 mb-16">
            <div className="flex-1 h-px bg-warmtext/8 dark:bg-white/8" />
            <span className="text-[8px] font-mono tracking-[0.25em] text-warmtext/25 dark:text-darktext/20 uppercase">Features</span>
            <div className="flex-1 h-px bg-warmtext/8 dark:bg-white/8" />
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-28">
            {/* Card 1 */}
            <div className="p-6 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-bold text-lg text-warmtext dark:text-darktext font-display">Focus Timer</h3>
              <p className="mt-2.5 text-warmtext/60 dark:text-darktext/60 text-sm leading-relaxed">
                Start and stop focus sessions. The stopwatch automatically calculates your duration and populates your study logs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-bold text-lg text-warmtext dark:text-darktext font-display">Streak Analytics</h3>
              <p className="mt-2.5 text-warmtext/60 dark:text-darktext/60 text-sm leading-relaxed">
                Maintain a study streak, visualize subject breakdowns, and compare weekly stats to see where your focus goes.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-bold text-lg text-warmtext dark:text-darktext font-display">Supabase Sync</h3>
              <p className="mt-2.5 text-warmtext/60 dark:text-darktext/60 text-sm leading-relaxed">
                Secure authentication and storage. Your study logs and streak histories are synchronized instantly across all your devices.
              </p>
            </div>
          </div>

          {/* Why I Built This */}
          <div className="border-t border-warmborder/50 dark:border-white/10 pt-16 pb-24 max-w-2xl mx-auto text-center">
            <h2 className="font-bold text-xl sm:text-2xl text-warmtext dark:text-darktext font-display">Why I Built This</h2>
            <p className="mt-6 text-sm sm:text-base text-warmtext/70 dark:text-darktext/70 leading-relaxed font-serif italic max-w-xl mx-auto">
              &ldquo;I used to sit down to study, and after a while I&apos;d get restless and just close everything &mdash; no real record of how long I&apos;d actually studied, or what I&apos;d covered. I built studylog to keep myself accountable: track my focus time, see my streaks, and actually know where my hours are going. If you&apos;ve ever felt the same way, I hope this helps you too.&rdquo;
            </p>
            <p className="mt-5 text-[10px] font-bold text-warmtext/35 dark:text-darktext/35 uppercase tracking-widest">
              &mdash; Yash Jay Mishra
            </p>
          </div>

        </div>{/* end centered content wrapper */}
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <span className="text-xs text-warmtext/40 dark:text-darktext/30">
            &copy; {new Date().getFullYear()} studylog
          </span>
          <span className="text-[8px] font-mono tracking-[0.2em] text-warmtext/25 dark:text-darktext/20 uppercase">
            Built for focus
          </span>
        </div>
      </footer>

    </div>
  );
}
