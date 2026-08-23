import { DashboardProvider } from '@/context/DashboardContext'
import DashboardLayoutClient from './DashboardLayoutClient'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </DashboardProvider>
  )
}
