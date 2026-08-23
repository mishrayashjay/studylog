import Link from "next/link";
import { BookOpen, Clock, Activity, ShieldCheck, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200">
      {/* Background Glow Effect */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-darkbg/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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
              className="text-sm font-semibold px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?tab=signup"
              className="text-sm font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl transition-all duration-200 shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 mx-auto animate-fade-in">
          <span>Introducing studylog 2.0</span>
          <ChevronRight className="h-3 w-3" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 max-w-3xl mx-auto leading-[1.1] font-display mt-6">
          Track your study sessions. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Build learning habits.
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          A minimalist focus dashboard designed to log subjects, track focus times with a built-in stopwatch, monitor daily streaks, and analyze weekly performance.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/login?tab=signup"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/10 dark:shadow-indigo-500/5 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Your Account
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-100 font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Log In
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <h3 className="mt-5 font-bold text-lg text-slate-900 dark:text-slate-100 font-display">Focus Timer</h3>
            <p className="mt-2.5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Start and stop focus sessions. The stopwatch automatically calculates your duration and populates your study logs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-5.5 w-5.5" />
            </div>
            <h3 className="mt-5 font-bold text-lg text-slate-900 dark:text-slate-100 font-display">Streak Analytics</h3>
            <p className="mt-2.5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Maintain a study streak, visualize subject breakdowns, and compare weekly stats to see where your focus goes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <h3 className="mt-5 font-bold text-lg text-slate-900 dark:text-slate-100 font-display">Supabase Sync</h3>
            <p className="mt-2.5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Secure authentication and storage. Your study logs and streak histories are synchronized instantly across all your devices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-darkbg/50 py-8 transition-colors duration-200 z-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-400 dark:text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} studylog. Built for focus.
        </div>
      </footer>
    </div>
  );
}
