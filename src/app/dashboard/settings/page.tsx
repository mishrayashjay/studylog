'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Shield, Info, LogOut, Check } from 'lucide-react'

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
  const { user, profile, isOfflineMode } = useDashboard()
  const supabase = createClient()
  const router = useRouter()

  const [currentTheme, setCurrentTheme] = useState<string>('theme-oled')

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

    // Clean up all theme classes
    THEMES.forEach((t) => root.classList.remove(t.id))

    // Apply new theme class and data attribute
    root.classList.add(themeId)
    root.setAttribute('data-theme', themeId)

    // Toggle Tailwind .dark class
    if (themeOption.isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Persist current and preferred light/dark variants
    localStorage.setItem('theme', themeId)
    if (themeOption.isDark) {
      localStorage.setItem('pref-dark-theme', themeId)
    } else {
      localStorage.setItem('pref-light-theme', themeId)
    }

    setCurrentTheme(themeId)

    // Dispatch global event so all components sync in real-time
    window.dispatchEvent(new Event('theme-change'))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
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
          {/* Profile Card */}
          <div className="bg-theme-card p-6 rounded-2xl border border-theme-border shadow-sm transition-colors duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <User className="h-4.5 w-4.5 text-purple-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-theme-muted">Account Profile</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-1">Email Address</span>
                  <p className="text-sm font-semibold text-theme-text">{user?.email || 'Offline Session'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-1">Username</span>
                    <p className="text-sm font-semibold text-theme-text">{profile.username}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-1">Full Name</span>
                    <p className="text-sm font-semibold text-theme-text">{profile.full_name || '—'}</p>
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
                    : 'Your study logs and streak statistics are synchronized in the cloud and available on any authorized device.'}
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
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200 shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
