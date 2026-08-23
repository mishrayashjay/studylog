import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DashboardProvider } from '@/context/DashboardContext'
import DashboardLayoutClient from './DashboardLayoutClient'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const userProfile = profile || { id: user.id, username: user.email?.split('@')[0] || 'user', full_name: '' }

  // Fetch user's study sessions
  const { data: initialSessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  return (
    <DashboardProvider
      user={user}
      profile={userProfile}
      initialSessions={initialSessions || []}
    >
      <DashboardLayoutClient profile={userProfile} user={user}>
        {children}
      </DashboardLayoutClient>
    </DashboardProvider>
  )
}
