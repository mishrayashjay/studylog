'use client'

import { useState, useEffect } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Shield, Info, LogOut } from 'lucide-react'

const THEMES = [
  {
    id: 'theme-light',
    name: 'Light Cream',
    desc: 'Cozy warm cream paper',
    bg: '#FAF7F2',
    text: '#2A2622',
    border: '#E6DFD5',
    isDark: false,
  },
  {
    id: 'theme-sepia',
    name: 'Sepia Paper',
    desc: 'Soft warm vintage sepia',
    bg: '#F4ECD8',
    text: '#433422',
    border: '#E4D5B7',
    isDark: false,
  },
  {
    id: 'theme-dark',
    name: 'Warm Charcoal',
    desc: 'Soothing espresso-brown',
    bg: '#1C1A18',
    text: '#F0EBE3',
    border: 'rgba(240, 235, 227, 0.1)',
    isDark: true,
  },
  {
    id: 'theme-oled',
    name: 'Pitch Black',
    desc: 'OLED pure deep black',
    bg: '#000000',
    text: '#F3F4F6',
    border: 'rgba(243, 244, 246, 0.1)',
    isDark: true,
  },
  {
    id: 'theme-midnight',
    name: 'Midnight Blue',
    desc: 'Cool cosmic indigo blue',
    bg: '#0A0D1A',
    text: '#E0E6ED',
    border: 'rgba(224, 230, 237, 0.1)',
    isDark: true,
  },
]

export default function SettingsPage() {
  const { user, profile, isOfflineMode } = useDashboard()
  const supabase = createClient()
  const router = useRouter()

  const [currentTheme, setCurrentTheme] = useState<string>('theme-light')

  useEffect(() => {
    // Read current theme state on mount
    const active = localStorage.getItem('theme') || 'theme-light'
    setCurrentTheme(active)

    // Listen to theme changes from the pull-cord quick toggle
    const syncTheme = () => {
      setCurrentTheme(localStorage.getItem('theme') || 'theme-light')
    }

    window.addEventListener('theme-change', syncTheme)
    return () => window.removeEventListener('theme-change', syncTheme)
  }, [])

  const handleSelectTheme = (themeId: string) => {
    const root = window.document.documentElement
    const themeOption = THEMES.find((t) => t.id === themeId)
    if (!themeOption) return

    // Clean up theme classes
    THEMES.forEach((t) => root.classList.remove(t.id))

    // Apply new theme class
    root.classList.add(themeId)

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

    // Dispatch global event so headers and cords update in real-time
    window.dispatchEvent(new Event('theme-change'))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-warmtext dark:text-darktext font-display">Settings</h1>
        <p className="text-warmtext/50 dark:text-darktext/50 text-xs mt-0.5">
          Manage your account profile, appearance themes, and sync configurations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#FDFCFB] dark:bg-white/5 p-6 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-1.5 mb-4">
            <User className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50">Account Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest mb-1">Email Address</span>
              <p className="text-sm font-semibold text-warmtext dark:text-darktext">{user?.email || 'Offline Session'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest mb-1">Username</span>
                <p className="text-sm font-semibold text-warmtext dark:text-darktext">{profile.username}</p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-warmtext/40 dark:text-darktext/40 uppercase tracking-widest mb-1">Full Name</span>
                <p className="text-sm font-semibold text-warmtext dark:text-darktext">{profile.full_name || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-[#FDFCFB] dark:bg-white/5 p-6 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50">Appearance Themes</h2>
          </div>
          <p className="text-[11px] text-warmtext/50 dark:text-darktext/50 mb-5">
            Select an appearance style for your study logs. Pull the top-nav cord switch to toggle between your active light and dark preferences.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {THEMES.map((themeOption) => {
              const isSelected = currentTheme === themeOption.id
              return (
                <button
                  key={themeOption.id}
                  onClick={() => handleSelectTheme(themeOption.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-300 ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-[#FAF7F2] dark:bg-white/10 shadow-sm'
                      : 'border-warmborder dark:border-white/10 bg-[#FDFCFB]/50 dark:bg-transparent hover:border-warmborder/80 dark:hover:border-white/20'
                  }`}
                >
                  {/* Swatch Mini Frame */}
                  <div
                    style={{ backgroundColor: themeOption.bg, borderColor: themeOption.border }}
                    className="w-full aspect-[1.3] rounded-lg border flex flex-col justify-between p-2 shadow-xs overflow-hidden mb-2 relative select-none"
                  >
                    {/* Simulated Text */}
                    <div className="space-y-1">
                      <div
                        style={{ backgroundColor: themeOption.text }}
                        className="w-8 h-1 rounded-full opacity-40"
                      />
                      <div
                        style={{ backgroundColor: themeOption.text }}
                        className="w-5 h-0.5 rounded-full opacity-20"
                      />
                    </div>
                    {/* Accent Color Dot */}
                    <div className="flex justify-between items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div
                        style={{ backgroundColor: themeOption.text }}
                        className="w-3 h-0.5 rounded-full opacity-20"
                      />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-warmtext dark:text-darktext truncate w-full">{themeOption.name}</span>
                  <span className="text-[8px] text-warmtext/50 dark:text-darktext/50 font-medium truncate w-full mt-0.5">{themeOption.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Database Status Info */}
        <div className="bg-[#FDFCFB] dark:bg-white/5 p-6 rounded-2xl border border-warmborder dark:border-white/10 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-1.5 mb-4">
            <Info className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-warmtext/50 dark:text-darktext/50">System Status</h2>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-warmtext/60 dark:text-darktext/60">
            <p>
              <span className="font-semibold text-warmtext/80 dark:text-darktext/80">Database Sync:</span>{' '}
              {isOfflineMode ? 'Disabled (Offline Storage)' : 'Enabled (Supabase Cloud)'}
            </p>
            <p className="text-[11px] text-warmtext/50 dark:text-darktext/50">
              {isOfflineMode
                ? 'Your data is being saved inside your local browser cache. To sync across multiple devices, define your Supabase credentials in .env.local.'
                : 'Your study logs and streak statistics are synchronized in the cloud and available on any authorized device.'}
            </p>
          </div>
        </div>

        {/* Logout Action */}
        <div className="border border-red-200/50 dark:border-red-500/20 bg-red-50/20 dark:bg-red-500/5 p-6 rounded-2xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400 mb-2">Actions</h3>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}
