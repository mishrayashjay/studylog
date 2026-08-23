import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClient from '@/components/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
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

  // Fetch user's study sessions
  const { data: initialSessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  return (
    <DashboardClient
      user={user}
      profile={profile || { id: user.id, username: user.email?.split('@')[0] || 'user', full_name: '' }}
      initialSessions={initialSessions || []}
    />
  )
}
