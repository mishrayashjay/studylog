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
    <div className={`w-full max-w-sm transition-all duration-700 ease-out transform ${formMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Brand Header & Back CTA */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4">
          <ChevronLeft className="h-3 w-3" />
          <span>Back to home</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-xl text-white shadow-sm shadow-indigo-600/10">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100 font-display">studylog</span>
        </div>
        <p className="mt-3 text-slate-400 dark:text-slate-500 text-xs">
          {activeTab === 'login' ? 'Sign in to sync your study metrics.' : 'Create an account to begin tracking.'}
        </p>
      </div>

      {/* Sliding Tab Switcher */}
      <div className="relative flex p-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl mb-6">
        <div
          className="absolute top-1 bottom-1 left-1 rounded-lg bg-white dark:bg-white/10 shadow-sm transition-all duration-300 ease-out"
          style={{
            width: 'calc(50% - 4px)',
            transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)',
          }}
        />
        <button
          type="button"
          onClick={() => handleTabChange('login')}
          className={`relative z-10 flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-center transition-colors duration-300 ${
            activeTab === 'login'
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('signup')}
          className={`relative z-10 flex-1 py-1.5 text-xs font-bold uppercase tracking-wider text-center transition-colors duration-300 ${
            activeTab === 'signup'
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs animate-fade-in">
          {successMsg}
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'signup' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-all duration-200"
                />
                <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-all duration-200"
                />
                <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-all duration-200"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-all duration-200"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:scale-[1.01] hover:shadow-md hover:shadow-indigo-600/10 dark:hover:shadow-indigo-500/5 active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
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
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200 font-sans">
      {/* Left Column: Form Container */}
      <div className="w-full md:w-[45%] lg:w-[40%] px-8 py-12 flex flex-col justify-center items-center bg-white dark:bg-darkbg border-r border-slate-200 dark:border-white/5 transition-colors duration-200 min-h-screen">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-500 animate-spin" />
            <p className="mt-4 text-sm text-slate-500">Loading form...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Column: Visual Mesh Gradient Stats Panel (Desktop Only) */}
      <div className="hidden md:flex md:w-[55%] lg:w-[60%] bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Grid & Blur Circle */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-[20%] -right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse duration-10000" />
        <div className="absolute bottom-[10%] -left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none animate-pulse duration-7000" />

        {/* Top brand header */}
        <div className={`flex items-center gap-2.5 transition-all duration-1000 transform ${rightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white border border-white/10">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-sm tracking-widest font-display text-indigo-200">STUDYLOG APP</span>
        </div>

        {/* Middle statistics banner */}
        <div className={`max-w-md transition-all duration-1000 delay-200 transform ${rightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Stat Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-indigo-300 mb-6">
            <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span>94% of users report improved weekly habits</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
            Focus is a muscle. <br />
            Track the workouts.
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Building consistence isn&apos;t about studying 10 hours a day, it&apos;s about studying every day. Keep your daily streak active and visualize your learning time breakdown.
          </p>
        </div>

        {/* Bottom learning quote */}
        <div className={`transition-all duration-1000 delay-400 transform ${rightMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-xs text-slate-400 italic">
            &ldquo;Learning is the only thing the mind never exhausts, never fears, and never regrets.&rdquo;
          </p>
          <span className="block mt-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">— Leonardo da Vinci</span>
        </div>
      </div>
    </div>
  )
}
