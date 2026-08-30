import Link from "next/link";
import { Clock, Activity, ShieldCheck } from "lucide-react";
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
        <section className="relative w-full max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-12 sm:pt-20 sm:pb-16 overflow-hidden">

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
              <div className="flex flex-col sm:flex-row sm:items-end gap-8">
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
