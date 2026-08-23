import Link from "next/link";
import { BookOpen, Clock, Activity, ShieldCheck, ChevronRight, Square, Award, RotateCcw, Pause } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(240,235,227,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,235,227,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse duration-5000" />
      <div className="absolute top-[250px] right-[-100px] w-[300px] h-[300px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[80px] pointer-events-none -z-10 animate-pulse duration-7000" />

      {/* Header */}
      <header className="border-b border-warmborder dark:border-white/10 bg-warmbg/70 dark:bg-darkbg/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
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
              className="text-sm font-semibold px-3 py-1.5 text-warmtext/70 dark:text-darktext/70 hover:text-warmtext dark:hover:text-darktext transition-colors"
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
        {/* Shimmer Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 mx-auto transition-all duration-300 shadow-sm shadow-indigo-500/10 hover:shadow-indigo-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span>Introducing studylog 2.0</span>
          <ChevronRight className="h-3 w-3" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-warmtext dark:text-darktext max-w-3xl mx-auto leading-[1.1] font-display mt-6">
          Track your study sessions. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Build learning habits.
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-warmtext/70 dark:text-darktext/70 max-w-xl mx-auto leading-relaxed">
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
            className="px-6 py-3 bg-[#FDFCFB] dark:bg-white/5 border border-warmborder dark:border-white/10 text-warmtext/80 dark:text-darktext/80 hover:bg-warmbg dark:hover:bg-white/10 hover:text-warmtext dark:hover:text-darktext font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Log In
          </Link>
        </div>

        {/* Counter Metrics */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto text-warmtext/60 dark:text-darktext/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <div className="flex flex-col items-center p-3 rounded-xl bg-[#FDFCFB]/40 dark:bg-white/5 border border-warmborder/50 dark:border-white/5 backdrop-blur-sm">
            <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">2,400+</span>
            <span className="mt-1 text-[9px] text-warmtext/50 dark:text-darktext/40">Hours Logged</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-[#FDFCFB]/40 dark:bg-white/5 border border-warmborder/50 dark:border-white/5 backdrop-blur-sm">
            <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">12,000+</span>
            <span className="mt-1 text-[9px] text-warmtext/50 dark:text-darktext/40">Sessions</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-[#FDFCFB]/40 dark:bg-white/5 border border-warmborder/50 dark:border-white/5 backdrop-blur-sm">
            <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">99.9%</span>
            <span className="mt-1 text-[9px] text-warmtext/50 dark:text-darktext/40">Study Uptime</span>
          </div>
        </div>

        {/* Interactive Dashboard Preview Mockup */}
        <div className="mt-16 relative mx-auto w-full max-w-3xl rounded-2xl border border-warmborder dark:border-white/10 p-2 bg-warmborder/30 dark:bg-white/5 shadow-2xl shadow-indigo-500/5">
          <div className="rounded-xl overflow-hidden border border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg flex flex-col text-left aspect-[16/10]">
            {/* Mock Nav Bar */}
            <div className="border-b border-warmborder/60 dark:border-white/10 px-4 py-3 flex items-center justify-between bg-warmbg/50 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-indigo-600 dark:bg-indigo-500 rounded text-white">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-xs text-warmtext dark:text-darktext">studylog</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-4 bg-warmborder/40 dark:bg-white/10 rounded-full" />
                <div className="w-8 h-4 bg-warmborder/40 dark:bg-white/10 rounded-full" />
              </div>
            </div>
            {/* Mock Body Grid */}
            <div className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden bg-warmbg/30 dark:bg-darkbg">
              {/* Left Column: Timer */}
              <div className="col-span-5 space-y-4">
                <div className="bg-[#FDFCFB] dark:bg-white/5 p-4 rounded-xl border border-warmborder dark:border-white/10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-600/20 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-500 flex flex-col items-center justify-center relative">
                    <span className="font-mono text-base font-extrabold text-warmtext dark:text-darktext">25:00</span>
                    <span className="text-[7px] text-warmtext/50 dark:text-darktext/40 uppercase tracking-widest mt-0.5">Focusing</span>
                  </div>
                  <div className="flex gap-2 mt-3.5">
                    <div className="p-1.5 rounded-full bg-warmbg dark:bg-white/10 text-warmtext/40 dark:text-darktext/40"><RotateCcw className="h-3 w-3" /></div>
                    <div className="p-2 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white"><Pause className="h-3.5 w-3.5 fill-white" /></div>
                    <div className="p-1.5 rounded-full bg-emerald-600 dark:bg-emerald-50 text-white"><Square className="h-3 w-3 fill-white" /></div>
                  </div>
                </div>
                <div className="bg-[#FDFCFB] dark:bg-white/5 p-3.5 rounded-xl border border-warmborder dark:border-white/10 h-20" />
              </div>
              {/* Right Column: Stats & Breakdown */}
              <div className="col-span-7 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FDFCFB] dark:bg-white/5 p-3.5 rounded-xl border border-warmborder dark:border-white/10 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-500 shrink-0" />
                    <div>
                      <div className="text-[7px] text-warmtext/40 dark:text-darktext/40 uppercase">This Week</div>
                      <div className="text-sm font-extrabold text-warmtext dark:text-darktext">12.5h</div>
                    </div>
                  </div>
                  <div className="bg-[#FDFCFB] dark:bg-white/5 p-3.5 rounded-xl border border-warmborder dark:border-white/10 flex items-center gap-3">
                    <Award className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-[7px] text-warmtext/40 dark:text-darktext/40 uppercase">Streak</div>
                      <div className="text-sm font-extrabold text-warmtext dark:text-darktext">6 days</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FDFCFB] dark:bg-white/5 p-4 rounded-xl border border-warmborder dark:border-white/10 flex-1 flex flex-col justify-between">
                  <div className="text-[8px] font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-wider mb-2">Time by Subject</div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-warmtext/70 dark:text-darktext/40">
                        <span>Computer Science</span>
                        <span>70%</span>
                      </div>
                      <div className="h-1 bg-warmbg dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-[70%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-warmtext/70 dark:text-darktext/40">
                        <span>Mathematics</span>
                        <span>30%</span>
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
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="p-6 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-5.5 w-5.5" />
            </div>
            <h3 className="mt-5 font-bold text-lg text-warmtext dark:text-darktext font-display">Focus Timer</h3>
            <p className="mt-2.5 text-warmtext/60 dark:text-darktext/60 text-sm leading-relaxed">
              Start and stop focus sessions. The stopwatch automatically calculates your duration and populates your study logs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-5.5 w-5.5" />
            </div>
            <h3 className="mt-5 font-bold text-lg text-warmtext dark:text-darktext font-display">Streak Analytics</h3>
            <p className="mt-2.5 text-warmtext/60 dark:text-darktext/60 text-sm leading-relaxed">
              Maintain a study streak, visualize subject breakdowns, and compare weekly stats to see where your focus goes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-[#FDFCFB] dark:bg-white/5 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <h3 className="mt-5 font-bold text-lg text-warmtext dark:text-darktext font-display">Supabase Sync</h3>
            <p className="mt-2.5 text-warmtext/60 dark:text-darktext/60 text-sm leading-relaxed">
              Secure authentication and storage. Your study logs and streak histories are synchronized instantly across all your devices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-warmborder dark:border-white/10 bg-[#FDFCFB] dark:bg-darkbg/50 py-8 transition-colors duration-300 z-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-warmtext/50 dark:text-darktext/40 text-xs">
          &copy; {new Date().getFullYear()} studylog. Built for focus.
        </div>
      </footer>
    </div>
  );
}
