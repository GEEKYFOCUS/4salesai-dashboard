import { AgentsProvider } from "@/components/dashboard/agents-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { PropsWithChildren } from "react"

export default function DashboardLayoutWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <AgentsProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AgentsProvider>
  )
} 