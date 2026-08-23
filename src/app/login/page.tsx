'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, AlertCircle, Loader2 } from 'lucide-react'
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
    <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-full max-w-md transition-colors duration-200">
      {/* Tab Buttons */}
      <div className="flex border-b border-slate-200 dark:border-white/10 mb-6">
        <button
          onClick={() => handleTabChange('login')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'login'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => handleTabChange('signup')}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'signup'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Status Alerts */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm">
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
              <input
                type="text"
                required
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-colors duration-200"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm transition-colors duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : activeTab === 'login' ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkbg flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-600/5 blur-[80px] pointer-events-none -z-10" />

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-xl text-white group-hover:scale-105 transition-transform duration-200 shadow-sm shadow-indigo-600/10">
          <BookOpen className="h-6 w-6" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-slate-100 font-display">studylog</span>
      </Link>

      <Suspense fallback={
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm w-full max-w-md flex flex-col items-center justify-center py-12 transition-colors duration-200">
          <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-500 animate-spin" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
