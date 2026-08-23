'use client'

import { useDashboard } from '@/context/DashboardContext'
import ThemeToggle from '@/components/ThemeToggle'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Shield, Info, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, isOfflineMode } = useDashboard()
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">Settings</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Manage your account profile, app theme preferences, and sync configurations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-4">
            <User className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Account Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email Address</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.email || 'Offline Session'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Username</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.username}</p>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Full Name</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.full_name || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-4">
            <Shield className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Preferences</h2>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Dark Theme</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Toggle interface appearance between light and dark modes.</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Database Status Info */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-1.5 mb-4">
            <Info className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">System Status</h2>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Database Sync:</span>{' '}
              {isOfflineMode ? 'Disabled (Offline Storage)' : 'Enabled (Supabase Cloud)'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
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
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}
