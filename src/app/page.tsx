import Link from "next/link";
import { BookOpen, Clock, Activity, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">studylog</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?tab=signup"
              className="text-sm font-medium px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Track your study sessions. <br />
          <span className="text-indigo-600">Build learning habits.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto">
          A minimalist dashboard to log subjects, record focus times with a built-in stopwatch, monitor your daily streak, and analyze your weekly performance.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/login?tab=signup"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors text-base"
          >
            Create Your Account
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-lg transition-colors text-base"
          >
            Log In
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-lg text-slate-900">Built-in Focus Timer</h3>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed">
              Start and stop focus sessions. The stopwatch automatically calculates your duration and populates the logging details.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-lg text-slate-900">Habits & Analytics</h3>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed">
              Maintain a study streak, visualize subject breakdowns, and compare weekly stats to see where your focus goes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-lg text-slate-900">Supabase Cloud Sync</h3>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed">
              Secure authentication and storage. Your study logs and streak histories are synchronized instantly across all your devices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} studylog. Built for focus.
        </div>
      </footer>
    </div>
  );
}
