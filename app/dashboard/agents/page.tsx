import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AgentsManagement } from "@/components/dashboard/agents-management"

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <AgentsManagement />
    </DashboardLayout>
  )
}
