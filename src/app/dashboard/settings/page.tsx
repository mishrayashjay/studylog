'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
  User,
  Shield,
  Info,
  LogOut,
  Check,
  Pencil,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw
} from 'lucide-react'

const THEMES = [
  {
    id: 'theme-light',
    name: 'Light Cream',
    desc: 'Cozy warm cream paper',
    bg: '#FAF7F2',
    text: '#1F1C18',
    border: '#E5DCD0',
    accent: '#7C3AED',
    isDark: false,
  },
  {
    id: 'theme-sepia',
    name: 'Sepia Paper',
    desc: 'Soft warm vintage sepia',
    bg: '#F4ECD8',
    text: '#3E2E1E',
    border: '#DFCEAF',
    accent: '#C2410C',
    isDark: false,
  },
  {
    id: 'theme-dark',
    name: 'Warm Charcoal',
    desc: 'Soothing espresso dark',
    bg: '#181614',
    text: '#F2EDE4',
    border: 'rgba(242, 237, 228, 0.15)',
    accent: '#A78BFA',
    isDark: true,
  },
  {
    id: 'theme-oled',
    name: 'Pitch Black',
    desc: 'OLED pure deep black',
    bg: '#000000',
    text: '#F3F4F6',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#8B5CF6',
    isDark: true,
  },
  {
    id: 'theme-midnight',
    name: 'Midnight Blue',
    desc: 'Cool cosmic indigo blue',
    bg: '#080C1A',
    text: '#E2E8F0',
    border: 'rgba(148, 163, 184, 0.18)',
    accent: '#6366F1',
    isDark: true,
  },
]

export default function SettingsPage() {
  const {
    user,
    profile,
    isOfflineMode,
    updateUsername,
    updateFullName,
    requestEmailChange,
    verifyEmailChangeOtp,
  } = useDashboard()

  const supabase = createClient()
  const router = useRouter()

  const [currentTheme, setCurrentTheme] = useState<string>('theme-oled')

  // ── Username Edit State ──
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null)

  // ── Full Name Edit State ──
  const [isEditingFullName, setIsEditingFullName] = useState(false)
  const [fullNameInput, setFullNameInput] = useState('')
  const [fullNameLoading, setFullNameLoading] = useState(false)
  const [fullNameError, setFullNameError] = useState<string | null>(null)
  const [fullNameSuccess, setFullNameSuccess] = useState<string | null>(null)

  // ── Email Change State ──
  // 'idle' | 'requesting' | 'verifying'
  const [emailEditStep, setEmailEditStep] = useState<'idle' | 'requesting' | 'verifying'>('idle')
  const [newEmailInput, setNewEmailInput] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [emailInfoMessage, setEmailInfoMessage] = useState<string | null>(null)

  useEffect(() => {
    // Read current theme state on mount
    const active = localStorage.getItem('theme') || 'theme-oled'
    setCurrentTheme(active)

    const syncTheme = () => {
      setCurrentTheme(localStorage.getItem('theme') || 'theme-oled')
    }

    window.addEventListener('theme-change', syncTheme)
    return () => window.removeEventListener('theme-change', syncTheme)
  }, [])

  const handleSelectTheme = (themeId: string) => {
    const root = window.document.documentElement
    const themeOption = THEMES.find((t) => t.id === themeId)
    if (!themeOption) return

    THEMES.forEach((t) => root.classList.remove(t.id))

    root.classList.add(themeId)
    root.setAttribute('data-theme', themeId)

    if (themeOption.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', themeId)
    if (themeOption.isDark) {
      localStorage.setItem('pref-dark-theme', themeId)
    } else {
      localStorage.setItem('pref-light-theme', themeId)
    }

    setCurrentTheme(themeId)
    window.dispatchEvent(new Event('theme-change'))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // ── Save Username Handler ──
  const handleStartEditUsername = () => {
    setUsernameInput(profile.username || '')
    setUsernameError(null)
    setUsernameSuccess(null)
    setIsEditingUsername(true)
  }

  const handleCancelEditUsername = () => {
    setIsEditingUsername(false)
    setUsernameError(null)
  }

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setUsernameLoading(true)
    setUsernameError(null)
    setUsernameSuccess(null)

    const res = await updateUsername(usernameInput)
    setUsernameLoading(false)

    if (res.success) {
      setUsernameSuccess('Username updated!')
      setIsEditingUsername(false)
      setTimeout(() => setUsernameSuccess(null), 4000)
    } else {
      setUsernameError(res.error || 'Failed to update username')
    }
  }

  // ── Save Full Name Handler ──
  const handleStartEditFullName = () => {
    setFullNameInput(profile.full_name || '')
    setFullNameError(null)
    setFullNameSuccess(null)
    setIsEditingFullName(true)
  }

  const handleCancelEditFullName = () => {
    setIsEditingFullName(false)
    setFullNameError(null)
  }

  const handleSaveFullName = async (e: React.FormEvent) => {
    e.preventDefault()
    setFullNameLoading(true)
    setFullNameError(null)
    setFullNameSuccess(null)

    const res = await updateFullName(fullNameInput)
    setFullNameLoading(false)

    if (res.success) {
      setFullNameSuccess('Full name updated!')
      setIsEditingFullName(false)
      setTimeout(() => setFullNameSuccess(null), 4000)
    } else {
      setFullNameError(res.error || 'Failed to update full name')
    }
  }

  // ── Email Change Handlers ──
  const handleStartEditEmail = () => {
    setNewEmailInput('')
    setOtpInput('')
    setEmailError(null)
    setEmailSuccess(null)
    setEmailInfoMessage(null)
    setEmailEditStep('requesting')
  }

  const handleCancelEditEmail = () => {
    setEmailEditStep('idle')
    setNewEmailInput('')
    setOtpInput('')
    setEmailError(null)
    setEmailInfoMessage(null)
  }

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailError(null)
    setEmailSuccess(null)

    const res = await requestEmailChange(newEmailInput)
    setEmailLoading(false)

    if (res.success) {
      setEmailInfoMessage(res.message || `Confirmation sent to ${newEmailInput.trim()}! Check your email for the verification code or link.`)
      setEmailEditStep('verifying')
    } else {
      setEmailError(res.error || 'Failed to request email change')
    }
  }

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailError(null)
    setEmailSuccess(null)

    const res = await verifyEmailChangeOtp(newEmailInput, otpInput)
    setEmailLoading(false)

    if (res.success) {
      setEmailSuccess('Email address updated successfully!')
      setEmailEditStep('idle')
      setNewEmailInput('')
      setOtpInput('')
      setEmailInfoMessage(null)
      setTimeout(() => setEmailSuccess(null), 5000)
    } else {
      setEmailError(res.error || 'Invalid verification code or code expired. Please check and try again.')
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-text font-display">Settings</h1>
        <p className="text-theme-muted text-xs mt-0.5">
          Manage your account profile, appearance themes, and sync configurations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Top 2-Column Grid: Profile & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Account Profile Card */}
          <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm transition-colors duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                    <User className="h-4 w-4" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-theme-muted">Account Profile</h2>
                </div>
                {(usernameSuccess || fullNameSuccess || emailSuccess) && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 animate-fade-in">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{usernameSuccess || fullNameSuccess || emailSuccess}</span>
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {/* ── 1. EMAIL ADDRESS ROW ── */}
                <div className="p-3.5 rounded-xl bg-theme-subtle border border-theme-border/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest">
                      Email Address
                    </span>
                    {emailEditStep === 'idle' && (
                      <button
                        type="button"
                        onClick={handleStartEditEmail}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>Change Email</span>
                      </button>
                    )}
                  </div>

                  {/* Normal Email Display */}
                  {emailEditStep === 'idle' && (
                    <p className="text-sm font-semibold text-theme-text">{user?.email || 'Offline Session'}</p>
                  )}

                  {/* Step 1: Input New Email Form */}
                  {emailEditStep === 'requesting' && (
                    <form onSubmit={handleRequestEmailChange} className="mt-2 space-y-3">
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="Enter new email address"
                          value={newEmailInput}
                          onChange={(e) => setNewEmailInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-theme-card border border-theme-border rounded-lg text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                        />
                        <Mail className="h-3.5 w-3.5 absolute left-3 top-2.5 text-theme-muted" />
                      </div>

                      {emailError && (
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{emailError}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={emailLoading}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          {emailLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                          <span>Send Confirmation</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditEmail}
                          disabled={emailLoading}
                          className="px-3 py-1.5 bg-theme-card hover:bg-theme-border border border-theme-border text-theme-muted hover:text-theme-text rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 2: OTP / Code Verification Form */}
                  {emailEditStep === 'verifying' && (
                    <form onSubmit={handleVerifyEmailOtp} className="mt-2 space-y-3">
                      {emailInfoMessage && (
                        <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs leading-relaxed flex items-start gap-2">
                          <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <span>We sent a confirmation code and link to <strong>{newEmailInput}</strong>.</span>
                            <span className="block mt-0.5 text-theme-muted">Enter the 6-digit code below to confirm, or click the link in your email.</span>
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={8}
                          placeholder="Enter 6-digit OTP code"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono tracking-widest bg-theme-card border border-theme-border rounded-lg text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                        />
                        <KeyRound className="h-3.5 w-3.5 absolute left-3 top-2.5 text-theme-muted" />
                      </div>

                      {emailError && (
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{emailError}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={emailLoading}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          {emailLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                          <span>Verify & Confirm</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRequestEmailChange}
                          disabled={emailLoading}
                          className="px-2.5 py-1.5 text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Resend</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditEmail}
                          disabled={emailLoading}
                          className="px-3 py-1.5 bg-theme-card hover:bg-theme-border border border-theme-border text-theme-muted hover:text-theme-text rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* ── 2. USERNAME & FULL NAME 2-COL ROW ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Username Card */}
                  <div className="p-3.5 rounded-xl bg-theme-subtle border border-theme-border/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest">
                        Username
                      </span>
                      {!isEditingUsername && (
                        <button
                          type="button"
                          onClick={handleStartEditUsername}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {!isEditingUsername ? (
                      <p className="text-sm font-semibold text-theme-text">{profile.username}</p>
                    ) : (
                      <form onSubmit={handleSaveUsername} className="mt-1 space-y-2">
                        <input
                          type="text"
                          required
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-theme-card border border-theme-border rounded-lg text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="new_username"
                          autoFocus
                        />
                        <p className="text-[10px] text-theme-muted">3–30 chars, letters, numbers, underscores.</p>
                        
                        {usernameError && (
                          <p className="text-[11px] text-red-400 leading-tight">{usernameError}</p>
                        )}

                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="submit"
                            disabled={usernameLoading}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {usernameLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditUsername}
                            disabled={usernameLoading}
                            className="px-2 py-1 text-theme-muted hover:text-theme-text text-xs rounded-md transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Full Name Card */}
                  <div className="p-3.5 rounded-xl bg-theme-subtle border border-theme-border/70 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest">
                        Full Name
                      </span>
                      {!isEditingFullName && (
                        <button
                          type="button"
                          onClick={handleStartEditFullName}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {!isEditingFullName ? (
                      <p className="text-sm font-semibold text-theme-text">{profile.full_name || '—'}</p>
                    ) : (
                      <form onSubmit={handleSaveFullName} className="mt-1 space-y-2">
                        <input
                          type="text"
                          value={fullNameInput}
                          onChange={(e) => setFullNameInput(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-theme-card border border-theme-border rounded-lg text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Your full name"
                          autoFocus
                        />

                        {fullNameError && (
                          <p className="text-[11px] text-red-400 leading-tight">{fullNameError}</p>
                        )}

                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="submit"
                            disabled={fullNameLoading}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {fullNameLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditFullName}
                            disabled={fullNameLoading}
                            className="px-2 py-1 text-theme-muted hover:text-theme-text text-xs rounded-md transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Status Info */}
          <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm transition-colors duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <Info className="h-4.5 w-4.5 text-purple-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-theme-muted">System Status</h2>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-theme-muted">
                <div className="p-3 rounded-xl bg-theme-subtle border border-theme-border flex items-center justify-between">
                  <span className="font-semibold text-theme-text">Database Sync</span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    isOfflineMode
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {isOfflineMode ? 'Offline Storage' : 'Supabase Cloud'}
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">
                  {isOfflineMode
                    ? 'Your data is being saved inside your local browser cache. To sync across multiple devices, define your Supabase credentials in .env.local.'
                    : 'Your study logs, streaks, section notes, and profile settings are synchronized in real-time in Supabase Cloud.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings (5 Full Themes) */}
        <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="h-4.5 w-4.5 text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-theme-muted">Appearance Themes</h2>
          </div>
          <p className="text-[11px] text-theme-muted mb-5">
            Select a complete theme palette for your workspace. Theme applies across all dashboard pages, charts, widgets, and controls.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {THEMES.map((themeOption) => {
              const isSelected = currentTheme === themeOption.id
              return (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => handleSelectTheme(themeOption.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 ring-2 ring-purple-500/30 bg-theme-subtle shadow-md'
                      : 'border-theme-border bg-theme-card hover:border-purple-400/40 hover:bg-theme-subtle'
                  }`}
                >
                  {/* Swatch Mini Preview Frame */}
                  <div
                    style={{ backgroundColor: themeOption.bg, borderColor: themeOption.border }}
                    className="w-full aspect-[1.3] rounded-lg border flex flex-col justify-between p-2 shadow-xs overflow-hidden mb-2.5 relative select-none"
                  >
                    {/* Simulated Text Lines */}
                    <div className="space-y-1">
                      <div
                        style={{ backgroundColor: themeOption.text }}
                        className="w-10 h-1.5 rounded-full opacity-60"
                      />
                      <div
                        style={{ backgroundColor: themeOption.text }}
                        className="w-6 h-1 rounded-full opacity-30"
                      />
                    </div>

                    {/* Bottom Preview Pill with Selected Check */}
                    <div className="flex justify-between items-center">
                      <div
                        style={{ backgroundColor: themeOption.accent }}
                        className="w-2.5 h-2.5 rounded-full shadow-xs"
                      />
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-theme-text truncate w-full">{themeOption.name}</span>
                  <span className="text-[10px] text-theme-muted font-medium truncate w-full mt-0.5">{themeOption.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Logout Action */}
        <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Account Session</h3>
            <p className="text-[11px] text-theme-muted mt-0.5">End your current session on this device.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shadow-xs cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
