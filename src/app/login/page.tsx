'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, AlertCircle, Loader2, Mail, Lock, User, CheckCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [formMounted, setFormMounted] = useState(false)

  useEffect(() => {
    setFormMounted(true)
  }, [])

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab)
    setErrorMsg(null)
    setSuccessMsg(null)
    setPassword('')
  }

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setErrorMsg(error)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    if (activeTab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      if (!username.trim()) {
        setErrorMsg('Username is required')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
      } else {
        if (data.session) {
          router.push('/dashboard')
          router.refresh()
        } else {
          setSuccessMsg('Registration successful! Please check your email to confirm your account.')
          setEmail('')
          setPassword('')
          setUsername('')
          setFullName('')
          setLoading(false)
        }
      }
    }
  }

  return (
    <div className={`w-full max-w-md transition-all duration-700 ease-out transform ${formMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Brand Header & Back CTA */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-base font-semibold text-warmtext/70 dark:text-darktext/65 hover:text-warmtext dark:hover:text-darktext transition-colors mb-6 group">
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-xl text-white shadow-md shadow-indigo-600/15">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl sm:text-3xl tracking-tight text-warmtext dark:text-darktext font-display">studylog</span>
        </div>
        <p className="mt-3 text-base sm:text-lg text-warmtext/75 dark:text-darktext/70 leading-relaxed font-normal">
          {activeTab === 'login' ? 'Sign in to sync your study metrics.' : 'Create an account to begin tracking.'}
        </p>
      </div>

      {/* Sliding Tab Switcher */}
      <div className="relative flex p-1.5 bg-warmbg dark:bg-white/5 border border-warmborder dark:border-white/10 rounded-2xl mb-7 shadow-xs">
        <div
          className="absolute top-1.5 bottom-1.5 left-1.5 rounded-xl bg-[#FDFCFB] dark:bg-white/10 shadow-sm transition-all duration-300 ease-out"
          style={{
            width: 'calc(50% - 6px)',
            transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
        <button
          type="button"
          onClick={() => handleTabChange('login')}
          className={`relative z-10 flex-1 py-2.5 text-base font-bold uppercase tracking-wider text-center transition-colors duration-300 cursor-pointer ${
            activeTab === 'login'
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'text-warmtext/50 dark:text-darktext/50 hover:text-warmtext dark:hover:text-darktext'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('signup')}
          className={`relative z-10 flex-1 py-2.5 text-base font-bold uppercase tracking-wider text-center transition-colors duration-300 cursor-pointer ${
            activeTab === 'signup'
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'text-warmtext/50 dark:text-darktext/50 hover:text-warmtext dark:hover:text-darktext'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="mb-5 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm sm:text-base flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm sm:text-base animate-fade-in">
          {successMsg}
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {activeTab === 'signup' && (
          <>
            <div>
              <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-warmtext/70 dark:text-darktext/65 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-[#FDFCFB] dark:bg-white/5 text-base sm:text-lg text-warmtext dark:text-darktext placeholder:text-warmtext/45 dark:placeholder:text-darktext/45 placeholder:text-base sm:placeholder:text-lg transition-all duration-200"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmtext/40 dark:text-darktext/40" />
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-warmtext/70 dark:text-darktext/65 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-[#FDFCFB] dark:bg-white/5 text-base sm:text-lg text-warmtext dark:text-darktext placeholder:text-warmtext/45 dark:placeholder:text-darktext/45 placeholder:text-base sm:placeholder:text-lg transition-all duration-200"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmtext/40 dark:text-darktext/40" />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-warmtext/70 dark:text-darktext/65 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-[#FDFCFB] dark:bg-white/5 text-base sm:text-lg text-warmtext dark:text-darktext placeholder:text-warmtext/45 dark:placeholder:text-darktext/45 placeholder:text-base sm:placeholder:text-lg transition-all duration-200"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmtext/40 dark:text-darktext/40" />
          </div>
        </div>

        <div>
          <label className="block text-sm sm:text-base font-bold uppercase tracking-wider text-warmtext/70 dark:text-darktext/65 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 border border-warmborder dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-[#FDFCFB] dark:bg-white/5 text-base sm:text-lg text-warmtext dark:text-darktext placeholder:text-warmtext/45 dark:placeholder:text-darktext/45 placeholder:text-base sm:placeholder:text-lg transition-all duration-200"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmtext/40 dark:text-darktext/40" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 text-base sm:text-lg shadow-md hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-600/15 dark:hover:shadow-indigo-500/10 active:scale-95 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : activeTab === 'login' ? (
            'Sign In'
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  const [rightMounted, setRightMounted] = useState(false)

  useEffect(() => {
    setRightMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-warmbg dark:bg-darkbg text-warmtext dark:text-darktext flex flex-col md:flex-row font-sans">
      {/* Left Column: Form Container */}
      <div className="w-full md:w-[48%] lg:w-[42%] px-6 sm:px-12 py-10 sm:py-16 flex flex-col justify-center items-center bg-[#FDFCFB] dark:bg-darkbg border-r border-warmborder dark:border-white/5 transition-colors duration-300 min-h-screen">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-500 animate-spin" />
            <p className="mt-4 text-base text-slate-500">Loading form...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Column: Visual Mesh Gradient Stats Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-[52%] lg:w-[58%] bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-12 lg:p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Grid & Blur Circle */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-[20%] -right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse duration-10000" />
        <div className="absolute bottom-[10%] -left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none animate-pulse duration-7000" />

        {/* Top brand header */}
        <div className={`flex items-center gap-3 transition-all duration-1000 transform ${rightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/10">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-bold text-base tracking-widest font-display text-indigo-200">STUDYLOG APP</span>
        </div>

        {/* Middle statistics banner */}
        <div className={`max-w-md transition-all duration-1000 delay-200 transform ${rightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Stat Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-indigo-200 mb-6">
            <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>94% of users report improved weekly habits</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
            Focus is a muscle. <br />
            Track the workouts.
          </h2>
          <p className="mt-5 text-darktext/80 text-base sm:text-lg leading-relaxed font-normal">
            Building consistency isn&apos;t about studying 10 hours a day, it&apos;s about studying every day. Keep your daily streak active and visualize your learning time breakdown.
          </p>
        </div>

        {/* Bottom learning quote */}
        <div className={`transition-all duration-1000 delay-400 transform ${rightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-sm text-darktext/70 italic">
            &ldquo;Learning is the only thing the mind never exhausts, never fears, and never regrets.&rdquo;
          </p>
          <span className="block mt-2 text-xs font-bold text-darktext/50 uppercase tracking-widest">— Leonardo da Vinci</span>
        </div>
      </div>
    </div>
  )
}
