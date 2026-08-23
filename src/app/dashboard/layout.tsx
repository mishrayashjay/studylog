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

  // Rapid JWT session check - extremely fast server verification
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <DashboardProvider user={user}>
      <DashboardLayoutClient user={user}>
        {children}
      </DashboardLayoutClient>
    </DashboardProvider>
  )
}
